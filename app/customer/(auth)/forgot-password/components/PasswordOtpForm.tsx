"use client";

import Link from "next/link";

import {
    Button,
    Center,
    Text,
    Title,
    Stack,
    PinInput,
    Fieldset,
    Anchor,
    Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { forgotPasswordOtpThunk } from "@/lib/thunks/customer/ForgotPasswordThunks";
import { makeToast } from "@/lib/utils/customer";

interface OtpFormProps {
    handleNextStep?: () => void;
}

const PasswordOtpForm: React.FC<OtpFormProps> = ({ handleNextStep }) => {
    const dispatch = useAppDispatch();

    const email = useAppSelector((state) => state.forgotPassword.email);

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
        transformValues: (values) => ({ ...values, email: email }),
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await dispatch(forgotPasswordOtpThunk(values)).unwrap();

            if (handleNextStep) {
                handleNextStep();
            }
        } catch (error) {
            makeToast("error", "Gửi mã OTP thất bại", (error as Error).message);
        }
    };

    return (
        <Stack mt="xl" align="center">
            <Fieldset radius="md" p={30} mt="xl">
                <Center mb="xl">
                    <Title order={2}>Nhập mã OTP đã được gửi đến địa chỉ email</Title>
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

                    <Group justify="center">
                        <Button fullWidth type="submit" mt="xl" radius="md">
                            Tiếp tục
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

export default PasswordOtpForm;
