"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/app/customer/lib/hooks/withTypes";
import { setCurrentTransfer } from "@/app/customer/lib/slices/TransferSlice";
import { setFilteredReceivers } from "@/app/customer/lib/slices/ReceiversSlice";
import { getAccountThunk } from "@/app/customer/lib/thunks/AuthThunks";
import { formatAccountNumber, formatCurrency } from "@/app/customer/lib/utils";

import {
    Button,
    Center,
    Checkbox,
    NumberInput,
    Select,
    Textarea,
    TextInput,
    Title,
    Fieldset,
    Group,
    Tooltip,
    UnstyledButton,
    Input,
    rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IMaskInput } from "react-imask";
import { IconX } from "@tabler/icons-react";

import TransferInfoModal from "./TransferInfoModal";
import ReceiverDrawer from "./ReceiverDrawer";

const fetchReceiverName = async (accNum: string) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/customer-name?accountNumber=${accNum}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        }
    );

    if (!response.ok) {
        const responseData = await response.json();
        let message = responseData.errors[0].message;

        if (message.includes("no rows")) {
            message = "Không tìm thấy người nhận. Vui long kiểm tra lại số tài khoản.";
        }

        notifications.show({
            withBorder: true,
            radius: "md",
            icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
            color: "red",
            title: "Truy vấn người nhận thất bại",
            message: message || "Đã xảy ra lỗi kết nối với máy chủ.",
            position: "bottom-right",
        });
    }

    const data = await response.json();
    return data.data.name;
};

interface TransferFormProps {
    handleNextStep?: () => void;
    type: string;
}

const TransferForm: React.FC<TransferFormProps> = ({ handleNextStep, type }) => {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();

    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

    const [selectedBank, setSelectedBank] = useState(
        type === "internal" ? "WNC Bank" : searchParams.get("at") || ""
    );

    const [receiverName, setReceiverName] = useState("");
    const [showBalance, setShowBalance] = useState(false);

    const userAccount = useAppSelector((state) => state.auth.account);

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            receiverAccount: searchParams.get("to") || "",
            amount: 0,
            message: `Chuyển tiền`,
            receiverHandlesFee: false,
        },
        validate: {
            receiverAccount: (value) =>
                value.length < 1
                    ? "Vui lòng nhập số tài khoản người nhận"
                    : /[0-9\s]{14}/.test(value)
                    ? null
                    : "Số tài khoản người nhận không hợp lệ",
            amount: (value) => (value < 10000 ? "Số tiền cần chuyển tối thiểu là 10000 VND" : null),
            message: isNotEmpty("Vui lòng nhập nội dung chuyển khoản"),
        },
        transformValues: (values) => ({
            sourceAccountNumber: userAccount?.accountNumber || "",
            targetAccountNumber: values.receiverAccount.split(" ").join(""),
            amount: values.amount,
            isSourceFee: !values.receiverHandlesFee,
            description: values.message.trim(),
            type: type,
        }),
    });

    const toggleConfirmModal = () => {
        const validatedForm = form.validate();

        if (!validatedForm.hasErrors) {
            const newTransfer = {
                amount: form.getValues().amount,
                message: form.getValues().message,
                receiverAccount: form.getValues().receiverAccount,
                receiverBank: type === "internal" ? "WNC Bank" : selectedBank,
                senderAccount: "Mặc định",
                senderHandlesFee: !form.getValues().receiverHandlesFee,
            };

            dispatch(setCurrentTransfer(newTransfer));

            openModal();
        }
    };

    const handleSelectReceiver = async (account: string) => {
        console.log("touched");

        const name = await fetchReceiverName(account);

        if (name && name.length > 0) {
            setReceiverName(name);
        }
    };

    useEffect(() => {
        dispatch(setFilteredReceivers(selectedBank));
    }, [dispatch, selectedBank]);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                await dispatch(getAccountThunk()).unwrap();
            } catch (error) {
                notifications.show({
                    withBorder: true,
                    radius: "md",
                    icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
                    color: "red",
                    title: "Truy vấn thông tin tài khoản thất bại",
                    message: (error as Error).message || "Đã xảy ra lỗi kết nối với máy chủ.",
                    position: "bottom-right",
                });
            }
        };

        if (userAccount === null) {
            fetchAccount();
        }
    }, [dispatch, userAccount]);

    return (
        <>
            <Fieldset radius="md" p={30} mt="xl">
                <Center mb="xl">
                    <Title order={2}>
                        Chuyển khoản {type === "internal" ? "nội bộ" : "liên ngân hàng"}
                    </Title>
                </Center>

                <form
                    onSubmit={form.onSubmit(() => {
                        if (handleNextStep) {
                            handleNextStep();
                        }
                    })}
                >
                    <Group grow gap="xl">
                        <Select
                            size="md"
                            radius="md"
                            comboboxProps={{ shadow: "md" }}
                            label="Tài khoản nguồn"
                            withAsterisk
                            allowDeselect={false}
                            placeholder="Chọn tài khoản"
                            data={[
                                `${formatAccountNumber(
                                    userAccount ? userAccount.accountNumber : ""
                                )} (mặc định)`,
                            ]}
                            onChange={() => {
                                form.setFieldValue("message", `${userAccount?.name} chuyển tiền`);
                                setShowBalance(true);
                            }}
                        />

                        <TextInput
                            size="md"
                            radius="md"
                            label="Số dư tài khoản"
                            value={
                                showBalance
                                    ? formatCurrency(userAccount?.balance || 0)
                                    : formatCurrency(0)
                            }
                            styles={{
                                input: {
                                    color: "var(--mantine-color-blue-filled)",
                                    backgroundColor: "var(--mantine-color-blue-light)",
                                },
                            }}
                            readOnly
                        />
                    </Group>

                    {type === "external" && (
                        <Select
                            size="md"
                            radius="md"
                            mt="lg"
                            comboboxProps={{ shadow: "md" }}
                            label="Ngân hàng của người nhận"
                            allowDeselect={false}
                            withAsterisk
                            placeholder="Chọn ngân hàng"
                            data={["Vietcombank", "Techcombank", "Agribank"]}
                            value={selectedBank}
                            onChange={(value) => {
                                if (value) {
                                    setSelectedBank(value);
                                }
                            }}
                        />
                    )}

                    <Tooltip
                        label="Vui lòng chọn ngân hàng trước khi nhập số tài khoản"
                        disabled={type === "internal" || selectedBank !== ""}
                    >
                        <Input.Wrapper
                            size="md"
                            mt="lg"
                            label="Số tài khoản người nhận"
                            description={
                                type === "external"
                                    ? "Để xem danh sách người nhận không thuộc ngân hàng đã chọn, hãy chọn ngân hàng khác ở danh sách bên trên"
                                    : ""
                            }
                            withAsterisk
                        >
                            <Input
                                component={IMaskInput}
                                size="md"
                                radius="md"
                                mask="0000 0000 0000"
                                placeholder="XXXX XXXX XXXX"
                                rightSectionPointerEvents="all"
                                error={form.errors.receiverAccount}
                                key={form.key("receiverAccount")}
                                {...form.getInputProps("receiverAccount")}
                                disabled={type === "external" && selectedBank === ""}
                                rightSection={
                                    <ReceiverDrawer
                                        type={type}
                                        form={form}
                                        selectedBank={selectedBank}
                                        onSelectReceiver={handleSelectReceiver}
                                    />
                                }
                                onBlur={(event) => handleSelectReceiver(event.currentTarget.value)}
                            />
                        </Input.Wrapper>
                    </Tooltip>

                    <TextInput
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Tên người nhận"
                        value={receiverName}
                        styles={{
                            root: {
                                display: receiverName.length < 0 ? "block" : "none",
                            },
                        }}
                        readOnly
                    />

                    <NumberInput
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Số tiền cần chuyển"
                        withAsterisk
                        allowNegative={false}
                        allowDecimal={false}
                        thousandSeparator=","
                        suffix=" VND"
                        key={form.key("amount")}
                        {...form.getInputProps("amount")}
                    />

                    <Textarea
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Nội dung chuyển khoản"
                        withAsterisk
                        placeholder="Người dùng chuyển tiền"
                        autosize
                        minRows={2}
                        maxRows={4}
                        key={form.key("message")}
                        {...form.getInputProps("message")}
                    />

                    <Checkbox
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Người nhận chịu phí"
                        description="Nếu không chọn, người gửi tiền sẽ thanh toán phí chuyển khoản"
                        key={form.key("receiverHandlesFee")}
                        {...form.getInputProps("receiverHandlesFee")}
                    />

                    {/*Invisible button for form submission*/}
                    <UnstyledButton type="submit" id="submit-form"></UnstyledButton>

                    <Button fullWidth onClick={toggleConfirmModal} mt={40} radius="md">
                        Tiếp tục
                    </Button>
                </form>
            </Fieldset>

            <TransferInfoModal isOpen={modalOpened} onClose={closeModal} />
        </>
    );
};

export default TransferForm;
