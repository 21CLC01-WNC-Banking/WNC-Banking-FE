"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

import { useAppSelector, useAppDispatch } from "@/lib/hooks/withTypes";
import { forgotPasswordThunk } from "@/lib/thunks/customer/ForgotPasswordThunks";
import { makeToast } from "@/lib/utils/customer";

import { Fieldset, Center, Title, Group, Button, PasswordInput, Anchor } from "@mantine/core";
import { useForm } from "@mantine/form";

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
            password: (value) => (value.length < 8 ? "Mật khẩu phải gồm ít nhất 8 ký tự" : null),
            confirmPassword: (value: string): string | null =>
                value.length === 0
                    ? "Vui lòng nhập lại mật khẩu mới"
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

            makeToast("success", "Đặt lại mật khẩu thành công", "Vui lòng đăng nhập để tiếp tục.");

            router.push("/customer/login");
        } catch (error) {
            makeToast("error", "Đặt lại mật khẩu thất bại", (error as Error).message);
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
