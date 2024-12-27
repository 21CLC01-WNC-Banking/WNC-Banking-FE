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
    Group,
    rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import Link from "next/link";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import useCaptcha from "@/app/staff/lib/hooks/useCaptcha";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useAppDispatch } from "../../lib/hooks/withTypes";
import { loginThunk } from "../../lib/slices/AuthSlice";

const Login = () => {
    const { captchaToken, captchaRef, handleCaptcha } = useCaptcha();
    const router = useRouter();
    const [error, setError] = useState("");
    const dispatch = useAppDispatch();

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
        try {
            await dispatch(loginThunk({ ...values, recaptchaToken: captchaToken })).unwrap();
            notifications.show({
                withBorder: true,
                radius: "md",
                icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
                color: "teal",
                title: "Đăng nhập thành công",
                message: "Chào mừng bạn quay trở lại với WNC Banking App.",
                position: "bottom-right",
            });

            router.push("/staff/create-account");
        } catch (error) {
            notifications.show({
                withBorder: true,
                radius: "md",
                icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
                color: "red",
                title: "Đăng nhập thất bại",
                message: (error as Error).message || "Đã xảy ra lỗi kết nối với máy chủ.",
                position: "bottom-right",
            });
        }
    };

    return (
        <Center
            style={{
                height: "100vh",
                backgroundImage:
                    "linear-gradient(-60deg, var(--mantine-color-blue-4) 0%, var(--mantine-color-blue-7) 100%)",
            }}
        >
            <Container size={420} my={40}>
                <Title ta="center" style={{ color: "white" }}>
                    Cổng nhân viên
                </Title>
                <Title ta="center" style={{ color: "white" }}>
                    WNC Bank
                </Title>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput
                            radius="md"
                            size="md"
                            label="Địa chỉ email"
                            placeholder="you@wnc.bank"
                            withAsterisk
                            key={form.key("email")}
                            {...form.getInputProps("email")}
                        />

                        <PasswordInput
                            radius="md"
                            size="md"
                            label="Mật khẩu"
                            placeholder="Mật khẩu"
                            mt="md"
                            mb="lg"
                            withAsterisk
                            key={form.key("password")}
                            {...form.getInputProps("password")}
                        />

                        <ReCAPTCHA
                            ref={captchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                            onChange={handleCaptcha}
                        />

                        <Group justify="center">
                            <Button
                                fullWidth
                                disabled={!captchaToken || Object.keys(form.errors).length > 0}
                                type="submit"
                                mt="xl"
                                radius="md"
                            >
                                Đăng nhập
                            </Button>

                            <Link
                                href="/customer/forgot-password"
                                passHref
                                style={{ textDecoration: "none" }}
                            >
                                <Anchor component="button">Quên mật khẩu</Anchor>
                            </Link>
                        </Group>
                    </form>
                </Paper>
            </Container>
        </Center>
    );
};

export default Login;
