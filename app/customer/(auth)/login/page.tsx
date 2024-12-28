"use client";

import { useRouter } from "nextjs-toploader/app";
import Link from "next/link";

import ReCAPTCHA from "react-google-recaptcha";
import useCaptcha from "@/lib/hooks/useCaptcha";

import { useAppDispatch } from "@/lib/hooks/withTypes";
import { loginThunk } from "@/lib/thunks/AuthThunks";

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
} from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import { makeToast } from "@/lib/utils/customer";

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

                <Center>
                    <Link href="/staff/login" passHref style={{ textDecoration: "none" }}>
                        <Anchor component="button" mt="lg">
                            Chuyển sang portal nhân viên
                        </Anchor>
                    </Link>
                </Center>
            </Container>
        </Center>
    );
};

export default Login;
