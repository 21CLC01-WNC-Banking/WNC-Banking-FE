"use client";

import { Employee } from "@/lib/types/staff";
import { Button, Fieldset, TextInput, Modal, Title, Center } from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

interface EmployeeFormProps {
    opened: boolean;
    onClose: () => void;
    onSave: (newEmployee: Employee) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ opened, onClose, onSave }) => {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            phone: "",
            email: "",
            password: "",
        },
        validate: {
            name: isNotEmpty("Vui lòng nhập họ tên"),
            email: isEmail("Vui lòng nhập email hợp lệ"),
            phone: (value) =>
                /^(?:\+84|0)(?:\d){9}$/.test(value) ? null : "Vui lòng nhập số điện thoại hợp lệ",
            password: (value) => (value.length >= 8 ? null : "Mật khẩu phải có tối thiểu 8 ký tự"),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            const payload = {
                email: values.email,
                name: values.name,
                phoneNumber: values.phone,
                password: values.password,
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/staff`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                showNotification({
                    title: "Thành công",
                    message: "Tạo tài khoản nhân viên thành công!",
                    color: "green",
                    position: "bottom-right",
                });
                const data = await response.json();
                const newEmployee = {
                    id: data.data.id,
                    name: payload.name,
                    email: payload.email,
                    phoneNumber: payload.phoneNumber,
                };
                onSave(newEmployee);
                form.reset();
                onClose();
            } else {
                showNotification({
                    title: "Lỗi",
                    message: "Email đã được sử dụng",
                    color: "red",
                    position: "bottom-right",
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            showNotification({
                title: "Lỗi",
                message: "Xảy ra lỗi kết nối với máy chủ, vui lòng thử lại sau!",
                color: "red",
                position: "bottom-right",
            });
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} size="lg">
            <Center>
                <Title>Thêm mới nhân viên</Title>
            </Center>
            <Fieldset radius="md" p={30} mt="lg" style={{ border: "none" }}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        size="md"
                        radius="md"
                        label="Họ tên"
                        required
                        placeholder="Nguyễn Văn A"
                        key={form.key("name")}
                        {...form.getInputProps("name")}
                    />

                    <TextInput
                        size="md"
                        radius="md"
                        label="Địa chỉ email"
                        required
                        placeholder="you@wnc.bank"
                        mt="lg"
                        key={form.key("email")}
                        {...form.getInputProps("email")}
                    />

                    <TextInput
                        size="md"
                        radius="md"
                        label="Số điện thoại"
                        required
                        placeholder="0123456789"
                        mt="lg"
                        key={form.key("phone")}
                        {...form.getInputProps("phone")}
                    />

                    <TextInput
                        size="md"
                        radius="md"
                        label="Mật khẩu"
                        required
                        placeholder="vana123"
                        mt="lg"
                        key={form.key("password")}
                        {...form.getInputProps("password")}
                    />

                    <Button fullWidth type="submit" radius="md" mt={40}>
                        Tạo tài khoản
                    </Button>
                </form>
            </Fieldset>
        </Modal>
    );
};

export default EmployeeForm;
