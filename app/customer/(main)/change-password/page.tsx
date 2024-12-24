"use client";

import { Fieldset, Center, Title, Button, PasswordInput, Stack } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

const ChangePasswordForm = () => {
    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
        validate: {
            oldPassword: isNotEmpty("Vui lòng nhập mật khẩu hiện tại"),
            newPassword: isNotEmpty("Vui lòng nhập mật khẩu mới"),
            confirmPassword: (value: string): string | null =>
                value.length === 0
                    ? "Vui lòng nhập lại mật khẩu mới"
                    : form.getValues().newPassword !== value
                    ? "Mật khẩu không trùng khớp"
                    : null,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        console.log(values);
        form.reset();
    };

    return (
        <Stack gap="xl" justify="center" my={40} mx={120}>
            <Fieldset radius="md" p={30}>
                <Center>
                    <Title order={2}>Đổi mật khẩu</Title>
                </Center>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <PasswordInput
                        size="md"
                        radius="md"
                        mt="md"
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

                    <Button fullWidth type="submit" mt="xl" radius="md">
                        Xác nhận
                    </Button>
                </form>
            </Fieldset>
        </Stack>
    );
};

export default ChangePasswordForm;
