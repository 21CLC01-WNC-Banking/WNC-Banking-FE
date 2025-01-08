"use client";

import { TextInput, Fieldset, Button, Text, Paper, Title, Flex, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import toVietnamese from "./ToVietnamese.js";
import { useState, useRef, useEffect } from "react";

const DepositForm = () => {
    const [transactionState, setTransactionState] = useState<
        "idle" | "submitting" | "success" | "failure"
    >("idle");
    const invoiceRef = useRef<HTMLDivElement>(null);

    const form = useForm({
        initialValues: {
            accountNumber: "",
            accountName: "",
            amount: 0,
            message: "",
            amountInWords: "",
        },
        validateInputOnChange: true,
        validate: {
            accountNumber: (value) =>
                value.trim() === "" ? "Số tài khoản không được để trống" : null,
            accountName: (value) => (value.trim() === "" ? "Số tài khoản không tồn tại" : null),
            amount: (value) =>
                value < 1000
                    ? "Hạn mức không được ít hơn 1 ngàn đồng"
                    : value > 1000000000
                        ? "Hạn mức không được lớn hơn 1 tỷ đồng"
                        : null,
            message: (value) =>
                value.length > 100 ? "Nội dung không được vượt quá 100 ký tự" : null,
        },
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const handleAccountNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (/^\d{0,12}$/.test(input)) {
            form.setFieldValue("accountNumber", input);

            // Nếu đủ 12 ký tự, gọi API để lấy tên tài khoản
            if (input.length === 12) {
                try {
                    const response = await fetch(
                        `${apiUrl}/account/customer-name?accountNumber=${input}`,
                        {
                            method: "GET",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Không thể lấy thông tin tài khoản");
                    }
                    const data = await response.json();
                    form.setFieldValue("accountName", data.data.name || "");
                } catch (error) {
                    form.setFieldValue("accountName", "");
                }
            } else {
                form.setFieldValue("accountName", "");
            }
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\./g, "");
        if (/^\d*$/.test(input)) {
            const numericValue = input ? parseFloat(input) : 0;
            form.setFieldValue("amount", numericValue);
            form.setFieldValue(
                "amountInWords",
                numericValue ? `${toVietnamese(numericValue).toUpperCase()} ĐỒNG` : "KHÔNG ĐỒNG"
            );
        }
    };

    useEffect(() => {
        if (invoiceRef.current) {
            invoiceRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [transactionState]);

    const handleSubmit = async (values: typeof form.values) => {
        setTransactionState("submitting");

        try {
            const response = await fetch(`${apiUrl}/staff/add-amount`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    accountNumber: values.accountNumber,
                    amount: values.amount,
                    description: values.message,
                }),
            });

            if (response.ok) {
                setTransactionState("success");
            } else {
                setTransactionState("failure");
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Xử lý khi giao dịch thất bại
            setTransactionState("failure");
        }
    };

    return (
        <>
            <Fieldset radius="md" p={30} mt="lg">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    {/* Số tài khoản */}
                    <TextInput
                        size="md"
                        radius="md"
                        label="Số tài khoản"
                        required
                        value={form.values.accountNumber}
                        onChange={handleAccountNumberChange}
                        placeholder="Nhập số tài khoản"
                        error={form.errors.accountNumber}
                    />

                    {/* Chủ tài khoản */}
                    <TextInput
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Chủ tài khoản"
                        value={form.values.accountName}
                        readOnly
                        error={form.errors.accountName}
                    />

                    {/* Số tiền */}
                    <TextInput
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Số tiền"
                        required
                        value={form.values.amount.toLocaleString("vi-VN")}
                        onChange={handleAmountChange}
                        placeholder="Nhập số tiền"
                        error={form.errors.amount}
                    />

                    {/* Viết thành chữ */}
                    {form.values.amountInWords && (
                        <Text mt="xs" size="sm" c="gray">
                            {form.values.amountInWords}
                        </Text>
                    )}

                    {/* Nội dung */}
                    <TextInput
                        size="md"
                        radius="md"
                        mt="lg"
                        label={`Nội dung (${form.values.message.length}/100)`}
                        value={form.values.message}
                        onChange={(e) => form.setFieldValue("message", e.target.value)}
                        placeholder="Nhập nội dung"
                        error={form.errors.message}
                    />

                    {/* Submit Button */}
                    <Button type="submit" mt={40} fullWidth>
                        NẠP TIỀN
                    </Button>
                </form>
            </Fieldset>

            {/* Hóa đơn */}
            {transactionState !== "idle" && (
                <Paper ref={invoiceRef} radius="md" p={30} mt="lg" withBorder>
                    <Flex justify="space-between" align="center" mb="md">
                        <Title order={3} c="blue">
                            WNC Bank
                        </Title>
                    </Flex>

                    <Flex
                        direction="row"
                        mb="lg"
                        gap="md"
                        align="center"
                        style={{
                            backgroundColor:
                                transactionState === "submitting"
                                    ? "#FFFBE6"
                                    : transactionState === "success"
                                        ? "#E6F9E6"
                                        : "#FDEDEE",
                            borderRadius: "8px",
                            padding: "10px",
                        }}
                    >
                        <Text
                            c={
                                transactionState === "submitting"
                                    ? "#FFC107"
                                    : transactionState === "success"
                                        ? "green"
                                        : "red"
                            }
                            fw={700}
                        >
                            {transactionState === "submitting"
                                ? "Đang thực hiện giao dịch..."
                                : transactionState === "success"
                                    ? "Giao dịch thành công!"
                                    : "Giao dịch thất bại, vui lòng thử lại sau!"}
                        </Text>
                        {transactionState === "submitting" && <Loader size={30} color="#FFC107" />}
                    </Flex>

                    {/* Thông tin hóa đơn */}
                    <Flex justify="space-between" align="flex-start" mb="sm">
                        <Text c="gray">Đến tài khoản</Text>
                        <Flex direction="column" align="flex-end">
                            <Text fw={700}>{form.values.accountNumber}</Text>
                            <Text>{form.values.accountName}</Text>
                        </Flex>
                    </Flex>

                    <Flex justify="space-between" align="flex-start" mb="sm">
                        <Text c="gray">Số tiền</Text>
                        <Flex direction="column" align="flex-end">
                            <Text fw={700}>{form.values.amount.toLocaleString("vi-VN")} VND</Text>
                            <Text size="xs">{form.values.amountInWords}</Text>
                        </Flex>
                    </Flex>

                    <Flex justify="space-between" align="center" mb="sm">
                        <Text c="gray">Phí</Text>
                        <Text>Miễn phí</Text>
                    </Flex>

                    <Flex justify="space-between" align="flex-start">
                        <Text c="gray">Nội dung</Text>
                        <div
                            style={{
                                maxWidth: "75%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {form.values.message}
                        </div>
                    </Flex>

                    <Button type="submit" mt={40} fullWidth>
                        IN HÓA ĐƠN
                    </Button>
                </Paper>
            )}
        </>
    );
};

export default DepositForm;
