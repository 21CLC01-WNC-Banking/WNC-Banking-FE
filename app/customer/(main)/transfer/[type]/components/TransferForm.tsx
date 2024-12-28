"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { setCurrentTransfer } from "@/lib/slices/customer/TransferSlice";
import { setFilteredReceivers } from "@/lib/slices/customer/ReceiversSlice";
import { getAccountThunk } from "@/lib/thunks/customer/UserAccountThunks";
import { formatAccountNumber, formatCurrency } from "@/lib/utils/customer";

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
    NumberInputHandlers,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IMaskInput } from "react-imask";
import { IconX } from "@tabler/icons-react";

import TransferInfoModal from "./TransferInfoModal";
import ReceiverDrawer from "./ReceiverDrawer";
import { transferFeeThunk } from "@/lib/thunks/customer/TransferThunks";

const fetchReceiverName = async (accNum: string) => {
    const deformatted = accNum.split(" ").join("");

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/customer-name?accountNumber=${deformatted}`,
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
            message = "Không tìm thấy người nhận. Vui lòng kiểm tra lại số tài khoản.";
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

        return "";
    }

    const data = await response.json();
    return data.data.name;
};

interface TransferFormProps {
    handleNextStep: () => void;
    type: string;
}

const TransferForm: React.FC<TransferFormProps> = ({ handleNextStep, type }) => {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();

    const [opened, { open, close }] = useDisclosure(false);
    const [loading, { toggle }] = useDisclosure(false);

    const [selectedBank, setSelectedBank] = useState(
        type === "internal" ? "WNC Bank" : searchParams.get("at") || ""
    );

    const [receiverName, setReceiverName] = useState("");

    const handlersRef = useRef<NumberInputHandlers>(null);

    const userAccount = useAppSelector((state) => state.auth.customerAccount);

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            receiverAccount: searchParams.get("to") || "",
            amount: 0,
            message: `${userAccount?.name} chuyển tiền`,
            receiverHandlesFee: false,
        },
        validate: {
            receiverAccount: (value) =>
                value.length < 1
                    ? "Vui lòng nhập số tài khoản người nhận"
                    : /[0-9\s]{14}/.test(value)
                    ? null
                    : "Số tài khoản người nhận không hợp lệ",
            amount: (value) =>
                value < 2000
                    ? "Số tiền chuyển phải lớn hơn 2.000 ₫"
                    : value > (userAccount?.balance ?? 0)
                    ? "Số dư không đủ"
                    : null,
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

    const [messageLength, setMessageLength] = useState(form.getValues().message.length);

    const estimateTransferFee = async (amount: number) => {
        try {
            const fee = await dispatch(transferFeeThunk({ amount: amount })).unwrap();

            return fee;
        } catch (error) {
            notifications.show({
                withBorder: true,
                radius: "md",
                icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
                color: "red",
                title: "Tính phí giao dịch thất bại",
                message: (error as Error).message || "Đã xảy ra lỗi kết nối với máy chủ.",
                position: "bottom-right",
            });
        }
    };

    const toggleConfirmModal = async () => {
        const validatedForm = form.validate();

        if (!validatedForm.hasErrors) {
            // toggle the loading state for the confirm button
            toggle();

            const fee = await estimateTransferFee(form.getValues().amount);

            const newTransfer = {
                amount: form.getValues().amount,
                message: form.getValues().message,
                receiverAccount: form.getValues().receiverAccount,
                receiverName: receiverName,
                receiverBank: type === "internal" ? "WNC Bank" : selectedBank,
                senderAccount:
                    formatAccountNumber(userAccount ? userAccount.accountNumber : "") || "-",
                senderName: userAccount?.name || "-",
                senderHandlesFee: !form.getValues().receiverHandlesFee,
                transferFee: fee || 0,
            };

            dispatch(setCurrentTransfer(newTransfer));

            open();
        }
    };

    const handleSelectReceiver = async (account: string) => {
        const name = await fetchReceiverName(account);

        if (name && name.length > 0) {
            setReceiverName(name);
        }
    };

    useEffect(() => {
        dispatch(setFilteredReceivers(selectedBank));
    }, [dispatch, selectedBank]);

    useEffect(() => {
        setMessageLength(form.getValues().message.length);
    }, [form.getValues().message]);

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

        form.setFieldValue("message", `${userAccount?.name} chuyển tiền`);
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
                        form.reset();
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
                            value={`${formatAccountNumber(
                                userAccount ? userAccount.accountNumber : ""
                            )} (mặc định)`}
                            data={[
                                `${formatAccountNumber(
                                    userAccount ? userAccount.accountNumber : ""
                                )} (mặc định)`,
                            ]}
                        />

                        <TextInput
                            size="md"
                            radius="md"
                            label="Số dư tài khoản"
                            value={formatCurrency(userAccount?.balance || 0)}
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
                            error={form.errors.receiverAccount}
                            withAsterisk
                        >
                            <Input
                                component={IMaskInput}
                                size="md"
                                radius="md"
                                mask="0000 0000 0000"
                                placeholder="XXXX XXXX XXXX"
                                rightSectionPointerEvents="all"
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
                                onBlur={(event) => {
                                    if (event.currentTarget.value.length >= 14) {
                                        form.setFieldValue(
                                            "receiverAccount",
                                            event.currentTarget.value
                                        );
                                        handleSelectReceiver(event.currentTarget.value);
                                    }
                                }}
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
                                display: receiverName.length > 0 ? "block" : "none",
                            },
                        }}
                        readOnly
                    />

                    <Group mt="lg" gap="xl" align="flex-end" grow>
                        <NumberInput
                            size="md"
                            radius="md"
                            label="Số tiền cần chuyển"
                            withAsterisk
                            handlersRef={handlersRef}
                            step={10000}
                            allowNegative={false}
                            allowDecimal={false}
                            hideControls
                            decimalSeparator=","
                            thousandSeparator="."
                            suffix=" ₫"
                            key={form.key("amount")}
                            {...form.getInputProps("amount")}
                        />

                        <Group grow mb={form.errors.amount ? "lg" : 0}>
                            <Button
                                size="md"
                                radius="md"
                                onClick={() => handlersRef.current?.decrement()}
                                variant="outline"
                            >
                                - 10.000 ₫
                            </Button>

                            <Button
                                size="md"
                                radius="md"
                                onClick={() => handlersRef.current?.increment()}
                                variant="outline"
                            >
                                + 10.000 ₫
                            </Button>
                        </Group>
                    </Group>

                    <Textarea
                        size="md"
                        radius="md"
                        mt="lg"
                        label={`Nội dung chuyển khoản (${messageLength}/100)`}
                        withAsterisk
                        placeholder="Người dùng chuyển tiền"
                        autosize
                        minRows={2}
                        maxRows={4}
                        maxLength={100}
                        key={form.key("message")}
                        {...form.getInputProps("message")}
                        onChange={(event) => setMessageLength(event.currentTarget.value.length)}
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

                    <Button
                        fullWidth
                        loading={loading}
                        onClick={toggleConfirmModal}
                        mt="lg"
                        radius="md"
                    >
                        Tiếp tục
                    </Button>
                </form>
            </Fieldset>

            <TransferInfoModal
                isOpen={opened}
                onClose={close}
                handleNextStep={handleNextStep}
                confirmToggle={toggle}
            />
        </>
    );
};

export default TransferForm;
