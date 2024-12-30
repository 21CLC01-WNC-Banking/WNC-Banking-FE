import { Paper, Center, Title, Stack } from "@mantine/core";
import TransactionTable from "../components/TransactionTable";

const TransactionList: React.FC = () => {
    return (
        <Stack>
            <Center>
                <Title order={2}>Danh sách giao dịch</Title>
            </Center>
            <Paper withBorder mx={40} radius="md" px={30} mt={30}>
                <TransactionTable />
            </Paper>
        </Stack>
    );
}
export default TransactionList;