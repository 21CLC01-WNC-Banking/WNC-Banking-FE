import { Paper } from "@mantine/core";

import TabHeader from "@/components/TabHeader";
import ReceiversTable from "./components/ReceiversTable";

const tabs = [
    { label: "Tài khoản & Giao dịch", content: <div>Not yet</div> },
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
    return <TabHeader mt="md" tabs={tabs} />;
};

export default Home;
