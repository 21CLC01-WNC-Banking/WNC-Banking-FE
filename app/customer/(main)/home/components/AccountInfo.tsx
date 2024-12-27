"use client";

import { useState, useEffect } from "react";

import {
    Paper,
    Table,
    Text,
    Pagination,
    Center,
    TextInput,
    Group,
    SegmentedControl,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { Transaction } from "@/lib/types/customer";
import { chunk } from "@/lib/utils";
import data from "@/app/customer/lib/mock_data/transactions.json";
import AccountCard from "./AccountCard";

const AccountInfo: React.FC = () => {
    const transactions = data as Transaction[];

    const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("Tất cả");
    const [timeFilter, setTimeFilter] = useState<string>("Mới nhất");
    const [activePage, setActivePage] = useState<number>(1);

    // sort transactions by time
    const sortByTime = (elements: Transaction[], filter: string) => {
        return elements.sort((a, b) => {
            const dateA = new Date(a.dateTime);
            const dateB = new Date(b.dateTime);
            return filter === "Mới nhất"
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
        });
    };

    // filter transactions based on selected filters
    const filteredTransactions = sortByTime(
        transactions.filter((transaction) => {
            if (transactionTypeFilter === "Tất cả") return true;
            return transaction.transactionType === transactionTypeFilter;
        }),
        timeFilter
    );

    // chunk the filtered transactions into pages
    const paginatedTransactions = chunk(filteredTransactions, 6);

    const totalPages = paginatedTransactions.length;

    useEffect(() => {
        if (activePage > totalPages && totalPages > 0) {
            setActivePage(totalPages); // adjust to the last page
        } else if (activePage === 0 && totalPages > 0) {
            setActivePage(1); // reset to the first page
        }
    }, [filteredTransactions, activePage, totalPages]);

    // get current page transactions
    const currentPageTransactions = paginatedTransactions[activePage - 1] || [];

    // create table rows for current page
    const rows = currentPageTransactions.map((transaction, index) => (
        <Table.Tr
            key={index}
            bg={
                transaction.transactionType === "Chuyển khoản"
                    ? "yellow.1"
                    : transaction.transactionType === "Nhận tiền"
                    ? "green.1"
                    : "red.2"
            }
        >
            <Table.Td>{transaction.dateTime}</Table.Td>
            <Table.Td>{transaction.accountType}</Table.Td>
            <Table.Td>{transaction.amount}</Table.Td>
            <Table.Td>{transaction.transactionType}</Table.Td>
            <Table.Td>{transaction.balance}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Paper radius="md" my="lg" px="lg">
            <AccountCard />

            <TextInput
                leftSection={<IconSearch size={20} />}
                placeholder="Tìm kiếm"
                radius="md"
                size="md"
                mt="lg"
            />

            {/* Filter Section */}
            <Group justify="space-between" align="center" mb="md" mt="lg">
                <Group justify="flex-start" gap="md">
                    <Text>Thời gian:</Text>

                    <SegmentedControl
                        color="blue"
                        value={timeFilter}
                        onChange={setTimeFilter}
                        data={["Mới nhất", "Cũ nhất"]}
                    />
                </Group>

                <Group justify="flex-end" gap="md">
                    <Text>Loại giao dịch:</Text>

                    <SegmentedControl
                        color="blue"
                        value={transactionTypeFilter}
                        onChange={setTransactionTypeFilter}
                        data={["Tất cả", "Thanh toán", "Nhận tiền", "Chuyển khoản"]}
                    />
                </Group>
            </Group>

            {/* Table */}
            <Table verticalSpacing="sm" mt="xl">
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
                    mt="xl"
                />
            </Center>
        </Paper>
    );
};

export default AccountInfo;
