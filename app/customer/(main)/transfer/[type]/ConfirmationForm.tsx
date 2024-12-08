"use client";

import { Button, Center, TextInput, Title, Stack } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";

interface ConfirmationFormProps {
    handleNextStep?: () => void;
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ handleNextStep }) => {
    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            otp: "",
        },
        validate: {
            otp: isNotEmpty("Vui lòng nhập mã OTP"),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        console.log(values);

        if (handleNextStep) {
            handleNextStep();
        }
    };

    return (
        <Stack mt="xl">
            <Center mt="xl">
                <Title order={2}>Xác nhận chuyển khoản</Title>
            </Center>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    size="md"
                    radius="md"
                    mt="lg"
                    label="Mã xác thực OTP"
                    withAsterisk
                    placeholder="Mã gồm 6 chữ số"
                    key={form.key("otp")}
                    {...form.getInputProps("otp")}
                />

                <Button fullWidth type="submit" mt={40} radius="md">
                    Tiếp tục
                </Button>
            </form>
        </Stack>
    );
};

export default ConfirmationForm;
