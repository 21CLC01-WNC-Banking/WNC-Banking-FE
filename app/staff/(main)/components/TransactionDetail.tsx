import { Transaction } from "@/app/staff/lib/types";
import { Title, Text, Container, Flex, Center } from "@mantine/core";

interface TransactionDetailProps {
    transaction: Transaction | null;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction }) => {
    if (!transaction) {
        return <div>Không có giao dịch nào được chọn</div>;
    }

    return (
        <Container size="sm" p="md">
            {/* Tiêu đề căn giữa */}
            <Center>
                <Title order={3} mb="lg">
                    Chi tiết giao dịch
                </Title>
            </Center>

            {/* Nội dung chi tiết giao dịch */}
            <Flex direction="column">
                <Flex justify="space-between" align="flex-start" mb="sm">
                    <Text>Ngày thực hiện</Text>
                    <Text fw={700}>{transaction.createdAt}</Text>
                </Flex>

                <Flex justify="space-between" align="flex-start" mb="sm">
                    <Text>Số giao dịch</Text>
                    <Text fw={700}>{transaction.id}</Text>
                </Flex>

                <Flex justify="space-between" align="flex-start" mb="sm">
                    <Text>Số tiền</Text>
                    <Text fw={700}>{transaction.amount}</Text>
                </Flex>

                <Flex justify="space-between" align="flex-start" mb="sm">
                    <Text>Từ</Text>
                    <Text fw={700}>{transaction.sender_account_number}</Text>
                </Flex>

                <Flex justify="space-between" align="flex-start" mb="sm">
                    <Text>Đến</Text>
                    <Text fw={700}>{transaction.receiver_account_number}</Text>
                </Flex>

                <Flex justify="space-between" align="flex-start" mb="sm">
                    <Text>Nội dung</Text>
                    <Text fw={700}>{transaction.message || "Không có nội dung"}</Text>
                </Flex>
            </Flex>
        </Container>
    );
};

export default TransactionDetail;
