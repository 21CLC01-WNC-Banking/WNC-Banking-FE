import { Flex, Center, Title } from "@mantine/core";
import TransferHistoryTable from "../components/TransferHistoryTable";

const TransferHistory: React.FC = () => {
    return (
        <Flex direction="column">
            <Center>
                <Title my={10}>Lịch sử giao dịch</Title>
            </Center>
            <TransferHistoryTable />
        </Flex>
    );
}
export default TransferHistory;