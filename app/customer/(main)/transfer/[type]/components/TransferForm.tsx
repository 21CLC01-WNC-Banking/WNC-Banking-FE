"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { setCurrentTransfer } from "@/lib/slices/customer/TransferSlice";
import { setFilteredReceivers } from "@/lib/slices/customer/ReceiversSlice";
import { getAccountThunk } from "@/lib/thunks/customer/UserAccountThunks";
import { formatAccountNumber, formatCurrency, makeToast } from "@/lib/utils/customer";

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
    NumberInputHandlers,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IMaskInput } from "react-imask";

import TransferInfoModal from "./TransferInfoModal";
import ReceiverDrawer from "./ReceiverDrawer";
import { transferFeeThunk } from "@/lib/thunks/customer/TransferThunks";
import { getReceiverNameThunk } from "@/lib/thunks/customer/ReceiversThunks";

interface TransferFormProps {
    handleNextStep: () => void;
    type: string;
}

const TransferForm: React.FC<TransferFormProps> = ({ handleNextStep, type }) => {
    const dispatch = useAppDispatch();
    const userAccount = useAppSelector((state) => state.auth.customerAccount);

    const searchParams = useSearchParams();

    const [opened, { open, close }] = useDisclosure(false);
    const [loading, { toggle }] = useDisclosure(false);

    const [selectedBank, setSelectedBank] = useState(
        type === "internal" || type === "debt-payment" ? "WNC Bank" : searchParams.get("at") || ""
    );
    const [receiverName, setReceiverName] = useState("");

    const handlersRef = useRef<NumberInputHandlers>(null);

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            receiverAccount: searchParams.get("to") || "",
            amount: parseInt(searchParams.get("amount") || "0"),
            message:
                type === "debt-payment"
                    ? `${userAccount?.name} thanh toan no`
                    : `${userAccount?.name} chuyen tien`,
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
            makeToast("error", "Tính phí giao dịch thất bại", (error as Error).message);
        }
    };

    const getReceiverName = async (account: string) => {
        try {
            const name = await dispatch(getReceiverNameThunk({ accountNumber: account })).unwrap();

            if (name && name.length > 0) {
                setReceiverName(name);
            }
        } catch (error) {
            makeToast("error", "Truy vấn thông tin người nhận thất bại", (error as Error).message);
        }
    };

    // callback to inject into ReceiverDrawer component
    const handleSetReceiverFormField = (account: string) => {
        form.setFieldValue("receiverAccount", account);
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
                receiverBank:
                    type === "internal" || type === "debt-payment" ? "WNC Bank" : selectedBank,
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

    useEffect(() => {
        dispatch(setFilteredReceivers(selectedBank));
    }, [dispatch, selectedBank]);

    useEffect(() => {
        if (form.getValues().receiverAccount !== "") {
            getReceiverName(form.getValues().receiverAccount);
        }
    }, []);

    useEffect(() => {
        setMessageLength(form.getValues().message.length);
    }, [form.getValues().message]);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                await dispatch(getAccountThunk()).unwrap();
            } catch (error) {
                makeToast(
                    "error",
                    "Truy vấn thông tin tài khoản thất bại",
                    (error as Error).message
                );
            }
        };

        if (userAccount === null) {
            fetchAccount();
        }

        form.setFieldValue(
            "message",
            type === "debt-payment"
                ? `${userAccount?.name} thanh toan no`
                : `${userAccount?.name} chuyen tien`
        );
    }, [dispatch, userAccount]);

    return (
        <>
            <Fieldset radius="md" p={30} mt="xl">
                <Center mb="xl">
                    <Title order={2}>
                        {type === "internal"
                            ? "Chuyển khoản nội bộ"
                            : type === "debt-payment"
                            ? "Thanh toán nợ"
                            : "Chuyển khoản liên ngân hàng"}
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
                        disabled={
                            type === "internal" || type === "debt-payment" || selectedBank !== ""
                        }
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
                            withAsterisk={type !== "debt-payment"}
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
                                    type === "debt-payment" ? null : (
                                        <ReceiverDrawer
                                            type={type}
                                            formHandler={handleSetReceiverFormField}
                                            selectedBank={selectedBank}
                                            onSelect={getReceiverName}
                                        />
                                    )
                                }
                                onBlur={(event) => {
                                    if (event.currentTarget.value.length >= 14) {
                                        form.setFieldValue(
                                            "receiverAccount",
                                            event.currentTarget.value
                                        );
                                        getReceiverName(event.currentTarget.value);
                                    }
                                }}
                                readOnly={type === "debt-payment"}
                                styles={{
                                    input:
                                        type === "debt-payment"
                                            ? {
                                                  color: "var(--mantine-color-blue-filled)",
                                                  backgroundColor:
                                                      "var(--mantine-color-blue-light)",
                                              }
                                            : undefined,
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
                            input: {
                                color: "var(--mantine-color-blue-filled)",
                                backgroundColor: "var(--mantine-color-blue-light)",
                            },
                        }}
                        readOnly
                    />

                    <Group mt="lg" gap="xl" align="flex-end" grow>
                        <NumberInput
                            size="md"
                            radius="md"
                            label="Số tiền cần chuyển"
                            withAsterisk={type !== "debt-payment"}
                            handlersRef={handlersRef}
                            step={10000}
                            allowNegative={false}
                            allowDecimal={false}
                            hideControls
                            decimalSeparator=","
                            thousandSeparator="."
                            suffix=" ₫"
                            readOnly={type === "debt-payment"}
                            styles={{
                                input:
                                    type === "debt-payment"
                                        ? {
                                              color: "var(--mantine-color-blue-filled)",
                                              backgroundColor: "var(--mantine-color-blue-light)",
                                          }
                                        : undefined,
                            }}
                            key={form.key("amount")}
                            {...form.getInputProps("amount")}
                        />

                        {type !== "debt-payment" && (
                            <Group grow mb={form.errors.amount ? "lg" : 0}>
                                <Button
                                    radius="md"
                                    size="md"
                                    onClick={() => handlersRef.current?.decrement()}
                                    variant="outline"
                                >
                                    - 10.000 ₫
                                </Button>

                                <Button
                                    radius="md"
                                    size="md"
                                    onClick={() => handlersRef.current?.increment()}
                                    variant="outline"
                                >
                                    + 10.000 ₫
                                </Button>
                            </Group>
                        )}
                    </Group>

                    <Textarea
                        size="md"
                        radius="md"
                        mt="lg"
                        label={`Nội dung chuyển khoản (${messageLength}/100)`}
                        withAsterisk
                        placeholder={type === "debt-payment" ? "Thanh toan no" : "Chuyen tien"}
                        autosize
                        minRows={2}
                        maxRows={4}
                        maxLength={100}
                        key={form.key("message")}
                        {...form.getInputProps("message")}
                        onChange={(event) => setMessageLength(event.currentTarget.value.length)}
                    />

                    {type !== "debt-payment" && (
                        <Checkbox
                            size="md"
                            radius="md"
                            mt="lg"
                            label="Người nhận chịu phí"
                            description="Nếu không chọn, bạn sẽ phải thanh toán phí chuyển khoản"
                            key={form.key("receiverHandlesFee")}
                            {...form.getInputProps("receiverHandlesFee")}
                        />
                    )}

                    {/*Invisible button for form submission*/}
                    <UnstyledButton type="submit" id="submit-form"></UnstyledButton>

                    <Button
                        radius="md"
                        fullWidth
                        loading={loading}
                        onClick={toggleConfirmModal}
                        mt="lg"
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
