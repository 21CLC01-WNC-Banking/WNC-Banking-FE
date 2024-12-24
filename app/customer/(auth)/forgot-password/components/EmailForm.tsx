import Link from "next/link";

import { Fieldset, Center, Title, Group, TextInput, Button, Anchor, Stack } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import React from "react";

interface EmailFormProps {
    handleNextStep?: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ handleNextStep }) => {
    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: { email: "" },
        validate: {
            email: isEmail("Email không hợp lệ"),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        console.log(values);

        if (handleNextStep) {
            handleNextStep();
        }
    };

    return (
        <Stack mt="xl" align="center">
            <Fieldset radius="md" p={30} mt="xl">
                <Center>
                    <Title order={2}>Nhập địa chỉ email đã đăng kí tài khoản</Title>
                </Center>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        radius="md"
                        size="md"
                        mt="md"
                        label="Địa chỉ email"
                        placeholder="you@wnc.bank"
                        withAsterisk
                        key={form.key("email")}
                        {...form.getInputProps("email")}
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
        </Stack>
    );
};

export default EmailForm;
