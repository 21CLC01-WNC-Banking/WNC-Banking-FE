"use client";

import { useParams } from "next/navigation";

import Steppy from "@/components/Steppy";

import TransferForm from "./TransferForm";
import OtpForm from "./OtpForm";
import CompletionScreen from "./CompletionScreen";

const Transfer = () => {
    const params = useParams();

    const steps = [
        {
            label: "Nhập thông tin",
            component: (props: { handleNextStep?: () => void }) => (
                <TransferForm
                    {...props}
                    type={Array.isArray(params.type) ? params.type[0] : params.type}
                />
            ),
        },
        {
            label: "Xác nhận",
            component: (props: { handleNextStep?: () => void }) => <OtpForm {...props} />,
        },
        {
            label: "Hoàn tất",
            component: (props: { handleNextStep?: () => void }) => <CompletionScreen {...props} />,
        },
    ];

    return <Steppy steps={steps} />;
};

export default Transfer;
