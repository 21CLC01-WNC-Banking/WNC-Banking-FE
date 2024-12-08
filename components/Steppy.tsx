"use client";

import { useState } from "react";

import { Stepper, Stack } from "@mantine/core";

interface SteppyProps {
    steps: {
        label: string;
        component: (props: { handleNextStep?: () => void }) => JSX.Element;
    }[];
}

const Steppy: React.FC<SteppyProps> = ({ steps }) => {
    const [active, setActive] = useState(0);

    const handleNextStep = () => {
        if (active >= steps.length) {
            return;
        }

        setActive(active + 1);
    };

    return (
        <Stack gap="xl" justify="flex-start" my={40} mx={120}>
            <Stepper active={active} onStepClick={setActive} radius="md">
                {steps.map((step, index) => (
                    <Stepper.Step key={index} label={step.label} allowStepSelect={false}>
                        {index < steps.length - 1 ? (
                            <step.component handleNextStep={handleNextStep} />
                        ) : (
                            <step.component />
                        )}
                    </Stepper.Step>
                ))}
            </Stepper>
        </Stack>
    );
};

export default Steppy;
