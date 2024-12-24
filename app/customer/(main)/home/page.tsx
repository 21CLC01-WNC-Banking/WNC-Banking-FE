import { Paper } from "@mantine/core";

import TabHeader from "@/components/TabHeader";
import AccountInfo from "./components/AccountInfo";
import ReceiversTable from "./components/ReceiversTable";

const tabs = [
    {
        label: "Tài khoản & Giao dịch",
        content: (
            <Paper withBorder mx={120} radius="md" p={30} mt={50}>
                <AccountInfo />
            </Paper>
        ),
    },
    {
        label: "Danh sách người nhận",
        content: (
            <Paper withBorder mx={120} radius="md" p={30} mt={50}>
                <ReceiversTable />
            </Paper>
        ),
    },
];

const Home = () => {
    return <TabHeader mt="md" mb={40} tabs={tabs} />;
};

export default Home;
