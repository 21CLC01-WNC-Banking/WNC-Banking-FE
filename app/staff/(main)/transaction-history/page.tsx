import { Stack, Center, Title } from "@mantine/core";
import TransactionHistoryTable from "../components/TransactionHistoryTable";

const TransferHistory: React.FC = () => {
    return (
        <Stack mx={120}>
            <Center>
                <Title order={2}>Lịch sử giao dịch</Title>
            </Center>
            <TransactionHistoryTable />
        </Stack>
    );
};
export default TransferHistory;
