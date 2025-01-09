"use client";

import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { Transaction } from "@/lib/types/customer";
import { getTransactionHistoryThunk } from "@/lib/thunks/customer/TransactionsThunk";
import {
    chunk,
    formatAccountNumber,
    formatCurrency,
    formatDateString,
    mapColor,
    mapTransactionType,
} from "@/lib/utils/customer";
import { makeToast } from "@/lib/utils/customer";

import { Paper, Table, Text, Pagination, Center, Group, SegmentedControl } from "@mantine/core";

import InfoModal, { InfoModalProps } from "@/components/InfoModal";
import AccountCard from "./AccountCard";

const makeTransactionInfoModalContent = (transaction: Transaction): InfoModalProps => {
    return {
        title: "Thông tin giao dịch",
        content: [
            { label: "Mã giao dịch", values: [transaction.id] },
            { label: "Thời gian", values: [formatDateString(transaction.createdAt)] },
            {
                label: "Loại giao dịch",
                values: [mapTransactionType(transaction.type, transaction.amount)],
                color: mapColor(transaction.type),
            },
            {
                label: "Tài khoản nguồn",
                values: [formatAccountNumber(transaction.sourceAccountNumber)],
            },
            {
                label: "Tài khoản thụ hưởng",
                values: [formatAccountNumber(transaction.targetAccountNumber)],
            },
            { label: "Số tiền giao dịch", values: [formatCurrency(transaction.amount)] },
            { label: "Nội dung", values: [transaction.description] },
            { label: "Số dư sau giao dịch", values: [formatCurrency(transaction.balance)] },
        ],
    };
};

const AccountInfo: React.FC = () => {
    const dispatch = useAppDispatch();
    const transactions = useAppSelector((state) => state.transactions.transactionHistory);

    const [transactionScopeFilter, setTransactionScopeFilter] = useState<string>("all");
    const [transactionDirectionFilter, setTransactionDirectionFilter] = useState<string>("all");
    const [activePage, setActivePage] = useState<number>(1);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                await dispatch(getTransactionHistoryThunk()).unwrap();
            } catch (error) {
                makeToast(
                    "error",
                    "Truy vấn danh sách người nhận thất bại",
                    (error as Error).message
                );
            }
        };

        fetchTransactions();
    }, [dispatch]);

    // filter transactions based on selected filters
    const filteredTransactions = transactions.filter((transaction) => {
        if (transactionScopeFilter === "all" && transactionDirectionFilter === "all") return true;

        let direction = transaction.amount > 0 ? "in" : "out";

        if (transaction.type === "debt_payment") {
            direction = "debt";
        }

        if (transactionScopeFilter === "all") {
            return direction === transactionDirectionFilter;
        }

        if (transactionDirectionFilter === "all" && transactionScopeFilter !== "debt") {
            return transaction.type === transactionScopeFilter;
        }

        switch (transactionDirectionFilter) {
            case "in":
                return (
                    transaction.amount > 0 &&
                    transaction.type === transactionScopeFilter &&
                    transaction.type !== "debt_payment"
                );
            case "out":
                return (
                    transaction.amount < 0 &&
                    transaction.type === transactionScopeFilter &&
                    transaction.type !== "debt_payment"
                );
            case "debt":
                return transaction.type === "debt_payment" && transactionScopeFilter !== "external";
        }

        return (
            transaction.type === transactionScopeFilter && direction === transactionDirectionFilter
        );
    });

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
        <Table.Tr key={index}>
            <Table.Td>{formatDateString(transaction.createdAt)}</Table.Td>
            <Table.Td>{formatCurrency(transaction.amount)}</Table.Td>
            <Table.Td c={mapColor(transaction.type)} fw={600}>
                {mapTransactionType(transaction.type, transaction.amount)}
            </Table.Td>
            <Table.Td>{formatCurrency(transaction.balance)}</Table.Td>
            <Table.Td>
                <Group justify="flex-end" grow>
                    <InfoModal {...makeTransactionInfoModalContent(transaction)} />
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Paper radius="md" my="lg" px="lg">
            <AccountCard />

            {/* Filter Section */}
            <Group justify="space-between" align="center" mb="md" mt="xl">
                <Group justify="flex-end" gap="md">
                    <Text>Giao dịch:</Text>

                    <SegmentedControl
                        radius="md"
                        color="blue"
                        value={transactionDirectionFilter}
                        onChange={setTransactionDirectionFilter}
                        data={[
                            { label: "Tất cả", value: "all" },
                            { label: "Nhận tiền", value: "in" },
                            { label: "Chuyển tiền", value: "out" },
                            { label: "Thanh toán nợ", value: "debt" },
                        ]}
                    />
                </Group>

                <Group justify="flex-end" gap="md">
                    <Text>Phạm vi:</Text>

                    <SegmentedControl
                        radius="md"
                        color="blue"
                        value={transactionScopeFilter}
                        onChange={setTransactionScopeFilter}
                        data={[
                            { label: "Tất cả", value: "all" },
                            { label: "Nội bộ", value: "internal" },
                            { label: "Liên ngân hàng", value: "external" },
                        ]}
                    />
                </Group>
            </Group>

            <Text ta="center" c="dimmed" fs="italic">
                Chỉ các giao dịch trong vòng 30 ngày trước được hiển thị ở đây.
            </Text>

            {/* Table */}
            <Table verticalSpacing="sm" mt="xl" highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Thời gian</Table.Th>
                        <Table.Th>Giao dịch</Table.Th>
                        <Table.Th>Loại giao dịch</Table.Th>
                        <Table.Th>Số dư sau giao dịch</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={5}>
                                <Text ta="center">Chưa có giao dịch nào</Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        rows
                    )}
                </Table.Tbody>
            </Table>

            {/* Pagination */}
            <Center>
                <Pagination
                    radius="md"
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
