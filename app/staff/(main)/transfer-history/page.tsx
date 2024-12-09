import { Stack, Center, Title } from "@mantine/core";
import TransferHistoryTable from "../components/TransferHistoryTable";

const TransferHistory: React.FC = () => {
    return (
        <Stack mx={120}>
            <Center>
                <Title order={2}>Lịch sử giao dịch</Title>
            </Center>
            <TransferHistoryTable />
        </Stack>
    );
};
export default TransferHistory;
