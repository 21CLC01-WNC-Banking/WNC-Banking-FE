"use client";
import { useState } from "react";

import { changePasswordThunk } from "@/lib/thunks/customer/AccountThunks";
import { makeToast } from "@/lib/utils/customer";
import { useAppDispatch } from "@/lib/hooks/withTypes";

import { Stack, Center, Title, PasswordInput, Button } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

const ChangePasswordForm = () => {
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
        validate: {
            oldPassword: isNotEmpty("Mật khẩu hiện tại không được để trống"),
            newPassword: (value) =>
                value.length < 8 ? "Mật khẩu mới phải gồm ít nhất 8 ký tự" : null,
            confirmPassword: (value: string): string | null =>
                value.length === 0
                    ? "Vui lòng nhập lại mật khẩu mới"
                    : form.getValues().newPassword !== value
                    ? "Mật khẩu mới không trùng khớp"
                    : null,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);

        try {
            await dispatch(
                changePasswordThunk({
                    password: values.oldPassword,
                    newPassword: values.newPassword,
                })
            ).unwrap();

            makeToast("success", "Đổi mật khẩu thành công", "Vui lòng đăng nhập lại để tiếp tục.");

            form.reset();
        } catch (error) {
            if ((error as Error).message === "invalid password") {
                makeToast("error", "Đổi mật khẩu thất bại", "Mật khẩu hiện tại không đúng.");
            } else {
                makeToast("error", "Đổi mật khẩu thất bại", (error as Error).message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack gap="xl" style={{ width: "50%" }}>
            <Center>
                <Title order={2}>Đổi mật khẩu</Title>
            </Center>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <PasswordInput
                    size="md"
                    radius="md"
                    label="Mật khẩu hiện tại"
                    withAsterisk
                    placeholder="Mật khẩu hiện tại"
                    key={form.key("oldPassword")}
                    {...form.getInputProps("oldPassword")}
                />

                <PasswordInput
                    size="md"
                    radius="md"
                    mt="md"
                    label="Mật khẩu mới"
                    withAsterisk
                    placeholder="Mật khẩu mới"
                    key={form.key("newPassword")}
                    {...form.getInputProps("newPassword")}
                />

                <PasswordInput
                    size="md"
                    radius="md"
                    mt="md"
                    mb="lg"
                    label="Nhập lại mật khẩu mới"
                    withAsterisk
                    placeholder="Nhập lại mật khẩu mới"
                    key={form.key("confirmPassword")}
                    {...form.getInputProps("confirmPassword")}
                />

                <Button
                    fullWidth
                    type="submit"
                    mt="xl"
                    radius="md"
                    loading={loading}
                    disabled={loading}
                >
                    Xác nhận
                </Button>
            </form>
        </Stack>
    );
};

export default ChangePasswordForm;
