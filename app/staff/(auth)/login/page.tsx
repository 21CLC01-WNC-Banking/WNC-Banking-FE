"use client";

import { useRouter } from "next/navigation";

import {
    Anchor,
    Button,
    Center,
    Container,
    Paper,
    PasswordInput,
    TextInput,
    Title,
    Notification
} from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
    const router = useRouter();
    const [error, setError] = useState("");

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnChange: true,
        initialValues: { email: "", password: "" },

        validate: {
            email: isEmail("Email không hợp lệ"),
            password: isNotEmpty("Vui lòng nhập mật khẩu"),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setError("");
        try {
            const payload = {
                email: values.email,
                password: values.password,
                recaptchaToken: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            };

            const response = await fetch("http://localhost:3001/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("email", data.data.email);
                router.push("/staff");
            }
            else {
                const data = await response.json();
                throw new Error(data.message || "Đăng nhập thất bại");
            }
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            //setLoading(false);
        }
    };

    return (
        <Center style={{ height: "100vh" }}>
            <Container size={420} my={40}>
                <Title ta="center">Cổng nhân viên WNC Banking</Title>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput
                            label="Địa chỉ email"
                            placeholder="you@wnc.bank"
                            key={form.key("email")}
                            {...form.getInputProps("email")}
                        />

                        <PasswordInput
                            label="Mật khẩu"
                            placeholder="Mật khẩu"
                            mt="md"
                            key={form.key("password")}
                            {...form.getInputProps("password")}
                        />

                        {error && (
                            <Notification color="red" onClose={() => setError("")}>
                                {error}
                            </Notification>
                        )}


                        <Button fullWidth type="submit" mt="xl">
                            Đăng nhập
                        </Button>
                    </form>
                </Paper>

                <Center>
                    <Link href="/customer/login" passHref style={{ textDecoration: "none" }}>
                        <Anchor component="button" mt="lg">
                            Chuyển sang portal khách hàng
                        </Anchor>
                    </Link>
                </Center>
            </Container>
        </Center>
    );
};

export default Login;
