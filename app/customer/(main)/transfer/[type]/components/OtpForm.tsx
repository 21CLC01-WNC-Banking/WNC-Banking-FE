"use client";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { resetTransfer } from "@/lib/slices/TransferSlice";

import { Button, Center, Text, Title, Stack, PinInput, Fieldset } from "@mantine/core";
import { useForm } from "@mantine/form";

interface OtpFormProps {
    handleNextStep?: () => void;
}

const OtpForm: React.FC<OtpFormProps> = ({ handleNextStep }) => {
    const dispatch = useAppDispatch();

    const transfer = useAppSelector((state) => state.transfer.currentTransfer);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            otp: "",
        },
        validate: {
            otp: (value) =>
                value.trim().length < 1
                    ? "Vui lòng nhập mã OTP"
                    : value.trim().length !== 6
                    ? "Mã OTP không hợp lệ"
                    : null,
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        // send the otp and await response

        // if good, call the transfer API
        console.log(transfer);

        // finally, reset the transfer state
        dispatch(resetTransfer());

        if (handleNextStep) {
            handleNextStep();
        }
    };

    return (
        <Stack mt="xl" align="center">
            <Center mt="xl">
                <Title order={2}>Nhập mã OTP để xác nhận chuyển khoản</Title>
            </Center>

            <Fieldset radius="md" p={30} mt="xl">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <PinInput
                        size="xl"
                        mt={40}
                        radius="md"
                        length={6}
                        type={/^[0-9]*$/}
                        inputType="tel"
                        inputMode="text"
                        oneTimeCode
                        key={form.key("otp")}
                        {...form.getInputProps("otp")}
                    />

                    {form.errors.otp && (
                        <Center mt={10}>
                            <Text c="red">{form.errors.otp}</Text>
                        </Center>
                    )}

                    <Button fullWidth type="submit" mt={60} radius="md">
                        Tiếp tục
                    </Button>
                </form>
            </Fieldset>
        </Stack>
    );
};

export default OtpForm;
