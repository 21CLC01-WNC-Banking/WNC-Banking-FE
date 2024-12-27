import Link from "next/link";

import {
    Fieldset,
    Center,
    Title,
    Group,
    TextInput,
    Button,
    Anchor,
    Stack,
    rem,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

import { useAppDispatch } from "@/lib/hooks/withTypes";
import { forgotPasswordEmailThunk } from "@/lib/thunks/customer/ForgotPasswordThunks";

interface EmailFormProps {
    handleNextStep?: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ handleNextStep }) => {
    const dispatch = useAppDispatch();

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: { email: "" },
        validate: {
            email: isEmail("Email không hợp lệ"),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await dispatch(forgotPasswordEmailThunk(values)).unwrap();

            if (handleNextStep) {
                handleNextStep();
            }
        } catch (error) {
            notifications.show({
                withBorder: true,
                radius: "md",
                icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
                color: "red",
                title: "Gửi email thất bại",
                message: (error as Error).message || "Đã xảy ra lỗi kết nối với máy chủ.",
                position: "bottom-right",
            });
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
