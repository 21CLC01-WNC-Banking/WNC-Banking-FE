"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { Stepper, Stack } from "@mantine/core";

import TransferForm from "./components/TransferForm";
import TransferOtpForm from "./components/TransferOtpForm";
import CompletionScreen from "./components/CompletionScreen";

import classes from "./Transfer.module.css";

const Transfer = () => {
    const params = useParams();
    const type = Array.isArray(params.type) ? params.type[0] : params.type;

    const [active, setActive] = useState(0);

    const handleNextStep = () => {
        if (active >= 3) {
            return;
        }

        setActive(active + 1);
    };

    return (
        <Stack gap="xl" justify="flex-start" my={40} mx={120}>
            <Stepper
                active={active}
                onStepClick={setActive}
                radius="md"
                classNames={{
                    separator: classes.separator,
                    stepIcon: classes.stepIcon,
                }}
            >
                <Stepper.Step label="Nhập thông tin" allowStepSelect={false}>
                    <TransferForm handleNextStep={handleNextStep} type={type} />
                </Stepper.Step>

                <Stepper.Step label="Xác thực OTP" allowStepSelect={false}>
                    <TransferOtpForm handleNextStep={handleNextStep} type={type} />
                </Stepper.Step>

                <Stepper.Step label="Hoàn tất" allowStepSelect={false}>
                    <CompletionScreen />
                </Stepper.Step>
            </Stepper>
        </Stack>
    );
};

export default Transfer;
