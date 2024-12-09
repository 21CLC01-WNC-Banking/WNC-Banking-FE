"use client";

import { TextInput, Paper, Button, Text } from '@mantine/core';
import { useForm } from '@mantine/form';

const DepositForm = () => {
    // Dữ liệu số tài khoản và tên chủ tài khoản
    const accountData: { [key: string]: string } = {
        '1098462947': 'Hồ Hữu Tâm',
        '2001234567': 'Đỗ Minh Triết',
        '3009876543': 'Vũ Anh Khoa',
        '4095480548': 'Đặng Nhật Hòa',
        '5287329873': 'Nguyễn Quỳnh Hương',
    };

    const form = useForm({
        initialValues: {
            accountNumber: '',
            accountName: '',
            amount: 0,
            message: '',
        },
        validateInputOnChange: true,
        validate: {
            accountNumber: (value) =>
                value.trim() === '' ? 'Số tài khoản không được để trống' : null,
            accountName: (value) =>
                value.trim() === '' ? 'Số tài khoản không tồn tại' : null,
            amount: (value) =>
                value < 1000 ? 'Hạn mức không được ít hơn 1 ngàn đồng' : value > 1000000000 ? 'Hạn mức không được lớn hơn 1 tỷ đồng' : null,
            message: (value) =>
                value.length > 100 ? 'Nội dung không được vượt quá 100 ký tự' : null,
        },
    });

    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        // Chỉ cho phép nhập số
        if (/^\d*$/.test(input)) {
            form.setFieldValue('accountNumber', input);

            if (accountData[input]) {
                form.setFieldValue('accountName', accountData[input]);
            } else {
                form.setFieldValue('accountName', '');
            }
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        //Chỉ cho phép nhập số
        if (/^\d*$/.test(input)) {
            if (!input) {
                form.setFieldValue('amount', 0);
            } else {
                form.setFieldValue('amount', parseFloat(input));
            }
        }
    };

    const handleSubmit = (values: any) => {
        // Xử lý submit form
        console.log(values);
        form.reset();
    };

    return (
        <Paper radius="md" p="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                {/* Số tài khoản */}
                <TextInput
                    label="Số tài khoản"
                    required
                    value={form.values.accountNumber}
                    onChange={handleAccountNumberChange}
                    placeholder="Nhập số tài khoản"
                    error={form.errors.accountNumber}
                    styles={{
                        input: {
                            borderRadius: "0px",
                            borderTop: "0px",
                            borderLeft: "0px",
                            borderRight: "0px",
                        },
                    }}
                />

                {/* Chủ tài khoản */}
                <TextInput
                    label="Chủ tài khoản"
                    value={form.values.accountName}
                    readOnly
                    error={form.errors.accountName}
                    styles={{
                        input: {
                            borderRadius: "0px",
                            borderTop: "0px",
                            borderLeft: "0px",
                            borderRight: "0px",
                        },
                    }}
                />

                {/* Số tiền */}
                <TextInput
                    label="Số tiền"
                    required
                    value={form.values.amount}
                    onChange={handleAmountChange}
                    placeholder="Nhập số tiền"
                    error={form.errors.amount}
                    styles={{
                        input: {
                            borderRadius: "0px",
                            borderTop: "0px",
                            borderLeft: "0px",
                            borderRight: "0px",
                        },
                    }}
                />

                {/* Viết thành chữ */}
                {form.values.amountInWords && (
                    <Text mt="md" size="sm" c="gray">
                        {form.values.amountInWords}
                    </Text>
                )}

                {/* Nội dung */}
                <TextInput
                    label={`Nội dung (${form.values.message.length}/100)`}
                    value={form.values.message}
                    onChange={(e) => form.setFieldValue('message', e.target.value)}
                    placeholder="Nhập nội dung"
                    error={form.errors.message}
                    styles={{
                        input: {
                            borderRadius: "0px",
                            borderTop: "0px",
                            borderLeft: "0px",
                            borderRight: "0px",
                        },
                    }}
                />

                {/* Submit Button */}
                <Button type="submit" mt="xl" fullWidth>
                    Nạp tiền
                </Button>
            </form>
        </Paper>
    );
};

export default DepositForm;
