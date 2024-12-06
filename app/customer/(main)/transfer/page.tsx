"use client";

import Steppy from "@/components/Steppy";
import TransferForm from "./TransferForm";
import ConfirmationForm from "./ConfirmationForm";
import CompletionScreen from "./CompletionScreen";

const Transfer = () => {
    const steps = [
        {
            label: "Nhập thông tin",
            component: (props: { handleNextStep?: () => void }) => <TransferForm {...props} />,
        },
        {
            label: "Xác nhận",
            component: (props: { handleNextStep?: () => void }) => <ConfirmationForm {...props} />,
        },
        {
            label: "Hoàn tất",
            component: (props: { handleNextStep?: () => void }) => <CompletionScreen {...props} />,
        },
    ];

    return <Steppy steps={steps} />;
};

export default Transfer;
