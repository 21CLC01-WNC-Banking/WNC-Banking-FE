"use client";

import { Button, Fieldset, TextInput, Notification } from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import { useState } from "react";

const UserForm: React.FC = () => {
    const [error, setError] = useState("");
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            phone: "",
            email: "",
        },
        validate: {
            name: isNotEmpty("Vui lòng nhập họ tên"),
            email: isEmail("Vui lòng nhập email hợp lệ"),
            phone: (value) =>
                /^(?:\+84|0)(?:\d){9}$/.test(value) ? null : "Vui lòng nhập số điện thoại hợp lệ",
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            const payload = {
                email: values.email,
                name: values.name,
                phoneNumber: values.phone,
                password: "khongnhopassword"
            };

            const response = await fetch("http://localhost:3001/api/v1/staff/register-customer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setError("");
                console.log("Tạo tài khoản thành công");
            }
            else {
                const data = await response.json();
                throw new Error(data.message || "Tạo tài khoản thất bại");
            }
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            //setLoading(false);
        }
    };

    return (
        <>
            <Fieldset radius="md" p={30} mt="lg">
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

                    {error && (
                        <Notification color="red" onClose={() => setError("")}>
                            {error}
                        </Notification>
                    )}

                    <Button fullWidth type="submit" radius="md" mt={40}>
                        Tạo tài khoản
                    </Button>
                </form>
            </Fieldset>
        </>
    );
};
export default UserForm;
