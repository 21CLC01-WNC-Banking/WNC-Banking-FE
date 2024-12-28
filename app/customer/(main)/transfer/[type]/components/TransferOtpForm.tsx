"use client";

import { useAppSelector, useAppDispatch } from "@/lib/hooks/withTypes";
import { internalTransferThunk } from "@/lib/thunks/customer/TransferThunks";
import { makeToast } from "@/lib/utils/customer";

import { Button, Center, Text, Title, Stack, PinInput, Fieldset } from "@mantine/core";
import { useForm } from "@mantine/form";

interface OtpFormProps {
    handleNextStep: () => void;
}

const TransferOtpForm: React.FC<OtpFormProps> = ({ handleNextStep }) => {
    const dispatch = useAppDispatch();
    const transferId = useAppSelector((state) => state.transfer.currentTransferId);

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

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await dispatch(
                internalTransferThunk({
                    transactionId: transferId ? transferId : "",
                    otp: values.otp,
                })
            ).unwrap();

            handleNextStep();
        } catch (error) {
            makeToast("error", "Gửi mã OTP thất bại", (error as Error).message);
        }
    };

    return (
        <Stack mt="xl" align="center">
            <Fieldset radius="md" p={30} mt="xl">
                <Center mb="xl">
                    <Title order={2}>Nhập mã OTP để xác nhận chuyển khoản</Title>
                </Center>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack align="center">
                        <PinInput
                            size="xl"
                            mt="xl"
                            radius="md"
                            length={6}
                            type={/^[0-9]*$/}
                            inputType="tel"
                            inputMode="text"
                            oneTimeCode
                            key={form.key("otp")}
                            {...form.getInputProps("otp")}
                        />

                        {form.errors.otp && <Text c="red">{form.errors.otp}</Text>}
                    </Stack>

                    <Button fullWidth type="submit" mt={60} radius="md">
                        Tiếp tục
                    </Button>
                </form>
            </Fieldset>
        </Stack>
    );
};

export default TransferOtpForm;
