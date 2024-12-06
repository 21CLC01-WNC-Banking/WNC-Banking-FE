"use client";
import { IconSearch } from "@tabler/icons-react";
import { Flex, Input, Paper, Table, Button, Text, Pagination, Center } from "@mantine/core";
import { useState, useEffect } from "react";

// Define transaction type
interface Transaction {
    dateTime: string;
    accountType: string;
    amount: string;
    transactionType: "Nhận tiền" | "Chuyển khoản" | "Thanh toán";
    balance: string;
}

// Helper function to chunk data into pages
function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) return [];
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
}

const TransferHistoryTable: React.FC = () => {
    // Sample transaction data
    const transactions: Transaction[] = [
        { dateTime: '05/12/2024 10:00', accountType: 'Thanh toán', amount: '+800,000 VND', transactionType: 'Nhận tiền', balance: '5,800,000 VND' },
        { dateTime: '05/12/2024 13:30', accountType: 'Thanh toán', amount: '-500,000 VND', transactionType: 'Thanh toán', balance: '5,300,000 VND' },
        { dateTime: '04/12/2024 15:15', accountType: 'Thanh toán', amount: '-1,000,000 VND', transactionType: 'Chuyển khoản', balance: '4,300,000 VND' },
        { dateTime: '04/12/2024 18:45', accountType: 'Thanh toán', amount: '+2,000,000 VND', transactionType: 'Nhận tiền', balance: '6,300,000 VND' },
        { dateTime: '03/12/2024 09:00', accountType: 'Thanh toán', amount: '-300,000 VND', transactionType: 'Thanh toán', balance: '6,000,000 VND' },
        { dateTime: '03/12/2024 11:20', accountType: 'Thanh toán', amount: '+1,500,000 VND', transactionType: 'Nhận tiền', balance: '7,500,000 VND' },
        { dateTime: '02/12/2024 20:45', accountType: 'Thanh toán', amount: '-2,000,000 VND', transactionType: 'Chuyển khoản', balance: '5,500,000 VND' },
        { dateTime: '02/12/2024 10:10', accountType: 'Thanh toán', amount: '+3,000,000 VND', transactionType: 'Nhận tiền', balance: '8,500,000 VND' },
        { dateTime: '01/12/2024 14:30', accountType: 'Thanh toán', amount: '-800,000 VND', transactionType: 'Thanh toán', balance: '7,700,000 VND' },
        { dateTime: '01/12/2024 18:50', accountType: 'Thanh toán', amount: '+5,000,000 VND', transactionType: 'Nhận tiền', balance: '12,700,000 VND' },
    ];

    // State for filters and pagination
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("Tất cả");
    const [timeFilter, setTimeFilter] = useState<string>("Mới nhất");
    const [activePage, setActivePage] = useState<number>(1);

    // Sort transactions by time
    const sortByTime = (elements: Transaction[], filter: string) => {
        return elements.sort((a, b) => {
            const dateA = new Date(a.dateTime);
            const dateB = new Date(b.dateTime);
            return filter === "Mới nhất" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
        });
    };

    // Filter transactions based on selected filters
    const filteredTransactions = sortByTime(
        transactions.filter((transaction) => {
            if (transactionTypeFilter === "Tất cả") return true;
            return transaction.transactionType === transactionTypeFilter;
        }),
        timeFilter
    );

    // Chunk the filtered transactions into pages (6 items per page)
    const paginatedTransactions = chunk(filteredTransactions, 6);

    const totalPages = paginatedTransactions.length;
    useEffect(() => {
        if (activePage > totalPages && totalPages > 0) {
            setActivePage(totalPages); // Adjust to the last page
        } else if (activePage === 0 && totalPages > 0) {
            setActivePage(1); // Reset to the first page
        }
    }, [filteredTransactions, activePage, totalPages]);

    // Get current page transactions
    const currentPageTransactions = paginatedTransactions[activePage - 1] || [];

    // Create table rows for current page
    const rows = currentPageTransactions.map((transaction, index) => (
        <Table.Tr
            key={index}
            bg={transaction.transactionType === "Chuyển khoản" ? "yellow.1" : transaction.transactionType === "Nhận tiền" ? "green.1" : "red.2"}
        >
            <Table.Td>{transaction.dateTime}</Table.Td>
            <Table.Td>{transaction.accountType}</Table.Td>
            <Table.Td>{transaction.amount}</Table.Td>
            <Table.Td>{transaction.transactionType}</Table.Td>
            <Table.Td>{transaction.balance}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Paper radius="md" p="md">
            <Flex align="flex-start" gap="md">
                {/* Search Bar */}
                <Flex
                    align="center"
                    w="fit-content"
                    px={10}
                    mb="md"
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "25px",
                    }}
                >
                    <Input placeholder="Tìm kiếm tài khoản" variant="unstyled" />
                    <IconSearch />
                </Flex>
                {/* Account Info */}
                <Text mt={5}>Chủ tài khoản: <strong>Hồ Hữu Tâm</strong></Text>
                <Text mt={5}>Số tài khoản: <strong>1098462947</strong></Text>
                <Text mt={5}>Tổng số giao dịch: <strong>{filteredTransactions.length}</strong></Text>
            </Flex>

            {/* Filter Section */}
            <Flex justify="flex-start" align="center" mb="md" gap="md">
                <Text>Thời gian: </Text>
                {["Mới nhất", "Cũ nhất"].map((timeOption, index) => (
                    <Button
                        key={index}
                        radius="xl"
                        variant={timeFilter === timeOption ? "filled" : "outline"}
                        onClick={() => setTimeFilter(timeOption)}
                        style={{ flex: 1 }}
                    >
                        {timeOption}
                    </Button>
                ))}
                <Text>Loại giao dịch: </Text>
                {["Tất cả", "Thanh toán", "Nhận tiền", "Chuyển khoản"].map((transactionType, index) => (
                    <Button
                        key={index}
                        radius="xl"
                        variant={transactionTypeFilter === transactionType ? "filled" : "outline"}
                        onClick={() => setTransactionTypeFilter(transactionType)}
                        style={{ flex: 1 }}
                        color={transactionType === "Tất cả" ? "blue" : transactionType === "Nhận tiền" ? "green" : transactionType === "Thanh toán" ? "red" : "yellow"}
                    >
                        {transactionType}
                    </Button>
                ))}
            </Flex>

            {/* Table */}
            <Table verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Thời gian</Table.Th>
                        <Table.Th>Tài khoản</Table.Th>
                        <Table.Th>Giao dịch</Table.Th>
                        <Table.Th>Loại giao dịch</Table.Th>
                        <Table.Th>Số dư hiện tại</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            {/* Pagination */}
            <Center>
                <Pagination
                    total={paginatedTransactions.length}
                    value={activePage}
                    onChange={setActivePage}
                    mt="sm"
                />
            </Center>
        </Paper>
    );
};

export default TransferHistoryTable;
