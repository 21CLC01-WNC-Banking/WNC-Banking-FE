"use client";

import React, { useEffect } from "react";
import { Modal, Button, TextInput, Group } from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import { Employee } from "@/lib/types/staff";
import { showNotification } from "@mantine/notifications";

interface EditEmployeeModalProps {
    employee: Employee | null;
    opened: boolean;
    onClose: () => void;
    onSave: (updatedEmployee: Employee) => void;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
    employee,
    opened,
    onClose,
    onSave,
}) => {
    const form = useForm<Employee>({
        initialValues: {
            id: 0,
            name: "",
            email: "",
            phoneNumber: "",
        },
        validate: {
            name: isNotEmpty("Vui lòng nhập họ tên"),
            email: isEmail("Vui lòng nhập email hợp lệ"),
            phoneNumber: (value) =>
                /^(?:\+84|0)(?:\d){9}$/.test(value) ? null : "Vui lòng nhập số điện thoại hợp lệ",
        },
    });

    // Gắn giá trị ban đầu khi `employee` thay đổi
    useEffect(() => {
        if (employee) {
            form.setValues({
                id: employee.id,
                name: employee.name,
                email: employee.email,
                phoneNumber: employee.phoneNumber,
            });
        }
    }, [employee]);

    const handleSubmit = async (values: Employee) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/staff`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const updatedEmployee: Employee = {
                    id: form.getValues().id,
                    name: form.getValues().name,
                    email: form.getValues().email,
                    phoneNumber: form.getValues().phoneNumber,
                };
                onSave(updatedEmployee);
                showNotification({
                    title: "Thành công",
                    message: "Cập nhật tài khoản nhân viên thành công!",
                    color: "green",
                    position: "bottom-right",
                });
                onClose();
            } else {
                showNotification({
                    title: "Cảnh báo",
                    message: "Vui lòng thay đổi thông tin cần cập nhật!",
                    color: "yellow",
                    position: "bottom-right",
                });
            }
        } catch (err) {
            showNotification({
                title: "Lỗi",
                message: "Đã xảy ra lỗi kết nối với máy chủ!",
                color: "red",
                position: "bottom-right",
            });
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Chỉnh sửa thông tin nhân viên" centered>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <TextInput
                    label="Tên nhân viên"
                    placeholder="Nhập tên"
                    {...form.getInputProps("name")}
                    required
                />
                <TextInput
                    label="Email"
                    placeholder="Nhập email"
                    mt="md"
                    {...form.getInputProps("email")}
                    required
                />
                <TextInput
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    mt="md"
                    {...form.getInputProps("phoneNumber")}
                    required
                />

                <Group mt="xl">
                    <Button variant="outline" color="gray" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button type="submit" color="blue">
                        Lưu
                    </Button>
                </Group>
            </form>
        </Modal>
    );
};

export default EditEmployeeModal;
