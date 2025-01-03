import Link from "next/link";

import { useAppDispatch } from "@/lib/hooks/withTypes";
import { forgotPasswordEmailThunk } from "@/lib/thunks/customer/ForgotPasswordThunks";
import { makeToast } from "@/lib/utils/customer";

import { Fieldset, Center, Title, Group, TextInput, Button, Anchor, Stack } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";

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
            if ((error as Error).message.includes("no rows")) {
                makeToast(
                    "error",
                    "Xác thực email thất bại",
                    "Không có tài khoản nào được đăng kí với địa chỉ email này."
                );
            } else {
                makeToast("error", "Xác thực email thất bại", (error as Error).message);
            }
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
