import { Paper, Center, Title, Stack } from "@mantine/core";
import TransactionHistoryTable from "../components/TransactionHistoryTable";

const TransferHistory: React.FC = () => {
    return (
        <Stack>
            <Center>
                <Title order={2}>Lịch sử giao dịch</Title>
            </Center>
            <Paper withBorder mx={40} radius="md" p={30} mt={30}>
                <TransactionHistoryTable />
            </Paper>
        </Stack>

    );
};
export default TransferHistory;
