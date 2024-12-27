"use client";
import { IconSearch, IconEye } from "@tabler/icons-react";
import {
    Paper,
    Table,
    Text,
    Pagination,
    Center,
    TextInput,
    Group,
    SegmentedControl,
    Button,
    Modal,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Transaction } from "@/lib/types/staff";
import TransactionDetail from "./TransactionDetail";
import { useForm } from "@mantine/form";
import classes from "./AccountCard.module.css";
import { format, parseISO } from "date-fns";

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
    const [error, setError] = useState<string>("");

    // State for statistics data
    const [accountInfo, setAccountInfo] = useState<{ title: string; stats: string }[]>([
        { title: "Chủ tài khoản", stats: "" },
        { title: "Số tài khoản", stats: "" },
        { title: "Tổng số giao dịch", stats: "0" },
    ]);
    const form = useForm({
        initialValues: {
            accountNumber: "",
        },
        validate: {
            accountNumber: (value) =>
                value.trim() === ""
                    ? "Số tài khoản không được để trống"
                    : value.length !== 12
                    ? "Số tài khoản không hợp lệ"
                    : null,
        },
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const handleSubmit = async (values: typeof form.values) => {
        try {
            const response = await fetch(
                `${apiUrl}/staff/transactions-by-account?accountNumber=${values.accountNumber}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            if (response.ok) {
                const data = await response.json();
                setAccountInfo([
                    { title: "Chủ tài khoản", stats: "Hồ Hữu Tâm" }, // Thay bằng `data.owner`
                    { title: "Số tài khoản", stats: values.accountNumber },
                    { title: "Tổng số giao dịch", stats: `${data.data.length}` },
                ]);
                setTransactions(data.data);
                setError("");
            } else {
                setError("Số tài khoản không tồn tại!");
                setTransactions([]);
            }
        } catch (error) {
            console.log("Đã xảy ra lỗi kết nối với máy chủ");
            setTransactions([]);
        }
    };

    // State for filters and pagination
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("Tất cả");
    const [timeFilter, setTimeFilter] = useState<string>("Mới nhất");
    const [activePage, setActivePage] = useState<number>(1);

    // State for selected transaction
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
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

    const formatDateTime = (isoString: string): string => {
        const date = parseISO(isoString);
        return format(date, "HH:mm dd/MM/yyyy");
    };

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

    // Create account info
    const stats = accountInfo.map((stat) => (
        <div key={stat.title} className={classes.stat}>
            <Text className={classes.title}>{stat.title}</Text>
            <Text className={classes.count}>{stat.stats}</Text>
        </div>
    ));

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
            <Table.Td>{formatDateTime(transaction.createdAt)}</Table.Td>
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
        <Paper radius="md" mt="lg" p="lg">
            <div className={classes.root}>{stats}</div>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                {/* Search Bar */}
                <TextInput
                    size="md"
                    radius="md"
                    required
                    mt="lg"
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
                                backgroundColor: "transparent",
                            }}
                        >
                            <IconSearch size={24} />
                        </Button>
                    }
                />
            </form>

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
            {filteredTransactions.length === 0 ? (
                <Center mt="xl">
                    <Text size="sm" c="dimmed">
                        {error ? error : "Chưa có lịch sử giao dịch nào!"}
                    </Text>
                </Center>
            ) : (
                <>
                    <Table verticalSpacing="sm" mt="xl">
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
                }}
            >
                <TransactionDetail transaction={selectedTransaction} />
            </Modal>
        </Paper>
    );
};

export default TransactionHistoryTable;
