"use client";

import { useState } from "react";

import { Stack, Stepper, Paper } from "@mantine/core";

import EmailForm from "./components/EmailForm";
import PasswordOtpForm from "./components/PasswordOtpForm";
import ResetPasswordForm from "./components/ResetPasswordForm";

import classes from "./ForgotPassword.module.css";

const ForgotPassword = () => {
    const [active, setActive] = useState(0);

    const handleNextStep = () => {
        if (active >= 3) {
            return;
        }

        setActive(active + 1);
    };

    return (
        <Stack
            gap="xl"
            justify="center"
            py={40}
            px={120}
            style={{
                height: "100vh",
                backgroundImage:
                    "linear-gradient(-60deg, var(--mantine-color-blue-4) 0%, var(--mantine-color-blue-7) 100%)",
            }}
        >
            <Paper withBorder shadow="md" p={60} mx={120} radius="md">
                <Stepper
                    active={active}
                    onStepClick={setActive}
                    radius="md"
                    classNames={{
                        separator: classes.separator,
                        stepIcon: classes.stepIcon,
                    }}
                >
                    <Stepper.Step label="Nhập địa chỉ email" allowStepSelect={false}>
                        <EmailForm handleNextStep={handleNextStep} />
                    </Stepper.Step>

                    <Stepper.Step label="Xác thực OTP" allowStepSelect={false}>
                        <PasswordOtpForm handleNextStep={handleNextStep} />
                    </Stepper.Step>

                    <Stepper.Step label="Đặt lại mật khẩu" allowStepSelect={false}>
                        <ResetPasswordForm />
                    </Stepper.Step>
                </Stepper>
            </Paper>
        </Stack>
    );
};

export default ForgotPassword;
