"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import ReCAPTCHA from "react-google-recaptcha";

import useCaptcha from "@/lib/hooks/useCaptcha";
import { useAppDispatch } from "@/lib/hooks/withTypes";
import { loginThunk } from "@/lib/thunks/AuthThunks";
import { makeToast } from "@/lib/utils/customer";

import {
    Anchor,
    Button,
    Center,
    Container,
    Group,
    Paper,
    PasswordInput,
    TextInput,
    Title,
    Text,
} from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";

const Login = () => {
    const { captchaToken, captchaRef, handleCaptcha, refreshCaptcha } = useCaptcha();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: { email: "", password: "" },
        validate: {
            email: isEmail("Email không hợp lệ"),
            password: (value) => {
                if (!isNotEmpty(value)) return "Mật khẩu không được để trống";
                if (value.length < 10) return "Mật khẩu phải gồm ít nhất 10 ký tự";
                return null;
            },
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await dispatch(loginThunk({ ...values, recaptchaToken: captchaToken })).unwrap();

            makeToast(
                "success",
                "Đăng nhập thành công",
                "Chào mừng bạn quay trở lại với WNC Banking App."
            );

            router.push("/customer");
        } catch (error) {
            makeToast("error", "Đăng nhập thất bại", (error as Error).message);

            refreshCaptcha();
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
                    WNC Banking App
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

                        <Group justify="space-between" mt="md">
                            <Group gap={3}>
                                <Text component="label" htmlFor="password" size="md" fw={500}>
                                    Mật khẩu
                                </Text>

                                <Text
                                    component="label"
                                    htmlFor="password"
                                    size="md"
                                    c="red"
                                    fw={500}
                                >
                                    *
                                </Text>
                            </Group>

                            <Link
                                href="/customer/forgot-password"
                                passHref
                                style={{ textDecoration: "none" }}
                            >
                                <Anchor fw={500} fz="xs" component="button">
                                    Quên mật khẩu
                                </Anchor>
                            </Link>
                        </Group>

                        <PasswordInput
                            radius="md"
                            size="md"
                            placeholder="Mật khẩu"
                            id="password"
                            mb="lg"
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
                        </Group>
                    </form>

                    <Center>
                        <Link href="/staff/login" passHref style={{ textDecoration: "none" }}>
                            <Anchor component="button" mt="lg">
                                Chuyển sang portal nhân viên
                            </Anchor>
                        </Link>
                    </Center>
                </Paper>
            </Container>
        </Center>
    );
};

export default Login;
