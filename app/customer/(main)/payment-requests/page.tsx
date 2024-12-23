import { Paper } from "@mantine/core";

import TabHeader from "@/components/TabHeader";
import ReceivedRequests from "./components/ReceivedRequests";
import SentRequests from "./components/SentRequests";

const tabs = [
    {
        label: "Nhắc nợ đã gửi",
        content: (
            <Paper withBorder mx={120} radius="md" p={40} mt={50}>
                <SentRequests />
            </Paper>
        ),
    },
    {
        label: "Nhắc nợ đã nhận",
        content: (
            <Paper withBorder mx={120} radius="md" p={40} mt={50}>
                <ReceivedRequests />
            </Paper>
        ),
    },
];

const PaymentRequests = () => {
    return <TabHeader mt="md" mb={40} tabs={tabs} />;
};

export default PaymentRequests;
