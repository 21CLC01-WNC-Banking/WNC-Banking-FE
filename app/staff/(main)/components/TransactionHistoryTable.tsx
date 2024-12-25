"use client";
import { IconSearch, IconEye } from "@tabler/icons-react";
import { Paper, Table, Text, Pagination, Center, TextInput, Group, Chip, Button, Modal } from "@mantine/core";
import { useState, useEffect } from "react";
import { useDisclosure } from '@mantine/hooks';
import { Transaction } from "@/lib/types";
import TransactionDetail from "./TransactionDetail";
import { useForm } from "@mantine/form";

// Hàm hỗ trợ phân trang
function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) return [];
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
}

const TransactionHistoryTable: React.FC = () => {

    // State for modal control
    const [opened, { open, close }] = useDisclosure(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accountInfo, setAccountInfo] = useState<{ owner: string; accountNumber: string }>({
        owner: "",
        accountNumber: "",
    });

    const form = useForm({
        initialValues: {
            accountNumber: "",
        },
        validate: {
            accountNumber: (value) =>
                value.trim() === "" ? "Số tài khoản không được để trống" :
                    value.length !== 12 ? "Số tài khoản không hợp lệ" : null,
        },
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const handleSubmit = async (values: typeof form.values) => {
        try {
            const response = await fetch(`${apiUrl}/staff/transactions-by-account?accountNumber=${values.accountNumber}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setAccountInfo({
                    owner: "Hồ Hữu Tâm",
                    accountNumber: values.accountNumber
                });
                setTransactions(data.data);
            } else {
                console.log("lỗi rồi");
                setTransactions([]);
            }
        } catch (error) {
            console.log("Đã xảy ra lỗi kết nối với máy chủ");
            setTransactions([]);
        }
    }

    // State for filters and pagination
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("Tất cả");
    const [timeFilter, setTimeFilter] = useState<string>("Mới nhất");
    const [activePage, setActivePage] = useState<number>(1);

    // State for selected transaction
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

    // Sample transaction data


    const handleAccountNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (/^\d*$/.test(input)) {
            form.setFieldValue("accountNumber", input);
        }
    };

    // Sort transactions by time
    const sortByTime = (elements: Transaction[], filter: string) => {
        return elements.sort((a, b) => {
            const dateA = new Date(a.dateTime);
            const dateB = new Date(b.dateTime);
            return filter === "Mới nhất"
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
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

    // Chunk the filtered transactions into pages (5 items per page)
    const paginatedTransactions = chunk(filteredTransactions, 5);

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
            bg={
                transaction.transactionType === "Chuyển khoản"
                    ? "yellow.1"
                    : transaction.transactionType === "Nhận tiền"
                        ? "green.1"
                        : "red.2"
            }
        >
            <Table.Td>{transaction.dateTime}</Table.Td>
            <Table.Td>{transaction.amount}</Table.Td>
            <Table.Td>{transaction.transactionType}</Table.Td>
            <Table.Td>{transaction.balance}</Table.Td>
            <Table.Td>
                <Button
                    variant="subtle"
                    c="black"
                    style={{
                        backgroundColor: "transparent",
                        "&:hover": {
                            backgroundColor: "transparent",
                        },
                    }}
                    onClick={() => {
                        setSelectedTransaction(transaction);
                        open();
                    }}
                >
                    <IconEye />
                </Button>
            </Table.Td>

        </Table.Tr>
    ));

    return (
        <Paper radius="md" mt="lg" p="xl">
            <Group align="center" justify="space-between" gap="md" pb={16}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    {/* Search Bar */}
                    <TextInput
                        size="md"
                        radius="md"
                        required
                        value={form.values.accountNumber}
                        onChange={handleAccountNumberChange}
                        placeholder="Nhập số tài khoản"
                        error={form.errors.accountNumber}
                        styles={{
                            input: { paddingLeft: "50px" },
                        }}
                        leftSection={
                            <Button
                                p={0}
                                type="submit"
                                variant="light"
                                size="xs"
                                style={{
                                    backgroundColor: "transparent"
                                }}
                            >
                                <IconSearch size={24} />
                            </Button>
                        }
                    />
                </form>

                {/* Account Info */}
                <Group justify="space-between">
                    <Text mt={5}>
                        Chủ tài khoản: <strong>{accountInfo.owner ? accountInfo.owner : ""}</strong>
                    </Text>
                    <Text mt={5}>
                        Số tài khoản: <strong>{accountInfo.accountNumber ? accountInfo.accountNumber : ""}</strong>
                    </Text>
                    <Text mt={5}>
                        Tổng số giao dịch: <strong>{filteredTransactions.length}</strong>
                    </Text>
                </Group>
            </Group>

            {/* Filter Section */}
            <Group justify="space-between" align="center">
                <Group justify="flex-start" gap="md">
                    <Text>Thời gian:</Text>
                    <Chip.Group multiple={false} value={timeFilter} onChange={setTimeFilter}>
                        <Group justify="center">
                            <Chip value="Mới nhất">Mới nhất</Chip>
                            <Chip value="Cũ nhất">Cũ nhất</Chip>
                        </Group>
                    </Chip.Group>
                </Group>

                <Group justify="flex-end" gap="md">
                    <Text>Loại giao dịch:</Text>
                    <Chip.Group
                        multiple={false}
                        value={transactionTypeFilter}
                        onChange={setTransactionTypeFilter}
                    >
                        <Group justify="center">
                            <Chip value="Tất cả">Tất cả</Chip>
                            <Chip value="Thanh toán" color="red">
                                Thanh toán
                            </Chip>
                            <Chip value="Nhận tiền" color="green">
                                Nhận tiền
                            </Chip>
                            <Chip value="Chuyển khoản" color="yellow">
                                Chuyển khoản
                            </Chip>
                        </Group>
                    </Chip.Group>
                </Group>
            </Group>

            {/* Table */}
            {/* Table */}
            {filteredTransactions.length === 0 ? (
                <Center mt="xl">
                    <Text size="sm" color="dimmed">Chưa có lịch sử giao dịch nào!</Text>
                </Center>
            ) : (
                <>
                    <Table verticalSpacing="sm" mt="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Thời gian</Table.Th>
                                <Table.Th>Giao dịch</Table.Th>
                                <Table.Th>Loại giao dịch</Table.Th>
                                <Table.Th>Số dư hiện tại</Table.Th>
                                <Table.Th>Xem chi tiết</Table.Th>
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
                </>
            )}


            <Modal
                opened={opened}
                onClose={close}
                withCloseButton={false}
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}>
                <TransactionDetail transaction={selectedTransaction} />
            </Modal>
        </Paper>
    );
};

export default TransactionHistoryTable;
