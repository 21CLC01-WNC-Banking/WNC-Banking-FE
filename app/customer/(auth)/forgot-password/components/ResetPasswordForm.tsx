"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

import { Fieldset, Center, Title, Group, Button, PasswordInput, Anchor, rem } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import { useAppSelector, useAppDispatch } from "@/app/customer/lib/hooks/withTypes";
import { forgotPasswordThunk } from "@/app/customer/lib/thunks/ForgotPasswordThunks";

const ResetPasswordForm = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const email = useAppSelector((state) => state.forgotPassword.email) || "";
    const otp = useAppSelector((state) => state.forgotPassword.otp) || "";

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: { password: "", confirmPassword: "" },
        validate: {
            password: isNotEmpty("Vui lòng nhập mật khẩu"),
            confirmPassword: (value: string): string | null =>
                value.length === 0
                    ? "Vui lòng nhập lại mật khẩu"
                    : form.getValues().password !== value
                    ? "Mật khẩu không trùng khớp"
                    : null,
        },
        transformValues: (values) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...rest } = values;
            return { ...rest, email: email, otp: otp };
        },
    });

    const handleSubmit = async (values: { otp: string; email: string; password: string }) => {
        try {
            await dispatch(forgotPasswordThunk(values)).unwrap();

            notifications.show({
                withBorder: true,
                radius: "md",
                icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
                color: "teal",
                title: "Đặt lại mật khẩu thành công",
                message: "Vui lòng đăng nhập để tiếp tục.",
                position: "bottom-right",
            });

            router.push("/customer/login");
        } catch (error) {
            notifications.show({
                withBorder: true,
                radius: "md",
                icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
                color: "red",
                title: "Gửi mã OTP thất bại",
                message: (error as Error).message || "Đã xảy ra lỗi kết nối với máy chủ.",
                position: "bottom-right",
            });
        }
    };

    return (
        <Fieldset radius="md" p={30} mt="xl">
            <Center>
                <Title order={2}>Nhập mật khẩu mới</Title>
            </Center>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <PasswordInput
                    size="md"
                    radius="md"
                    mt="md"
                    label="Mật khẩu mới"
                    withAsterisk
                    placeholder="Mật khẩu mới"
                    key={form.key("password")}
                    {...form.getInputProps("password")}
                />
                <PasswordInput
                    size="md"
                    radius="md"
                    mt="md"
                    mb="lg"
                    label="Nhập lại mật khẩu"
                    withAsterisk
                    placeholder="Nhập lại mật khẩu"
                    key={form.key("confirmPassword")}
                    {...form.getInputProps("confirmPassword")}
                />

                <Group justify="center">
                    <Button fullWidth type="submit" mt="xl" radius="md">
                        Xác nhận
                    </Button>

                    <Link href="/customer/login" passHref style={{ textDecoration: "none" }}>
                        <Anchor component="button">Quay về cổng đăng nhập</Anchor>
                    </Link>
                </Group>
            </form>
        </Fieldset>
    );
};

export default ResetPasswordForm;
