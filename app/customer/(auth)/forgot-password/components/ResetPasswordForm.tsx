"use client";

import Link from "next/link";

import { Fieldset, Center, Title, Group, Button, PasswordInput, Anchor } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

const ResetPasswordForm = () => {
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
    });

    const handleSubmit = async (values: typeof form.values) => {
        console.log(values);
        form.reset();
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
