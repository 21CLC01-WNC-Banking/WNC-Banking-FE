"use client";
import { IconEye } from "@tabler/icons-react";
import { Paper, Table, Text, Pagination, Center, Group, SegmentedControl, Button, Modal } from "@mantine/core";
import { Input, InputBase, Combobox, useCombobox } from '@mantine/core';
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import ExternalTransactionDetail from "./ExternalTransactionDetail";
import classes from "../../employee/components/AccountCard.module.css";
import { chunk } from "../../../../lib/utils/staff";
import { formatDateString } from "@/lib/utils/customer";
import { ExternalTransaction } from "@/lib/types/staff";


const ExternalTransactionHistoryTable: React.FC = () => {
    // State for modal control
    const [opened, { open, close }] = useDisclosure(false);
    //const [transactions, setTransactions] = useState<Transaction[]>([]);

    const transactions: ExternalTransaction[] = [
        {
            id: 1,
            createdAt: "2024-12-28T09:15:23Z",
            sourceAccountNumber: "1234567890",
            amount: 500000,
            targetAccountNumber: "0987654321",
            bank: "ABC Bank",
            balance: 1000000,
            description: "Thanh toán hóa đơn điện nước",
        },
        {
            id: 2,
            createdAt: "2024-12-28T10:30:45Z",
            sourceAccountNumber: "2345678901",
            amount: 200000,
            targetAccountNumber: "1098765432",
            bank: "DEF Bank",
            balance: 800000,
            description: "Chuyển khoản mua hàng online",
        },
        {
            id: 3,
            createdAt: "2024-12-28T11:45:12Z",
            sourceAccountNumber: "3456789012",
            amount: 300000,
            targetAccountNumber: "2109876543",
            bank: "ABC Bank",
            balance: 1200000,
            description: "Chuyển khoản cá nhân",
        },
        {
            id: 4,
            createdAt: "2024-12-28T13:00:00Z",
            sourceAccountNumber: "4567890123",
            amount: 1000000,
            targetAccountNumber: "3210987654",
            bank: "DEF Bank",
            balance: 2000000,
            description: "Thanh toán khoản vay",
        },
        {
            id: 5,
            createdAt: "2024-12-28T14:15:30Z",
            sourceAccountNumber: "5678901234",
            amount: 750000,
            targetAccountNumber: "4321098765",
            bank: "ABC Bank",
            balance: 1500000,
            description: "Gửi tiền tiết kiệm",
        },
        {
            id: 6,
            createdAt: "2024-12-28T15:30:45Z",
            sourceAccountNumber: "6789012345",
            amount: 120000,
            targetAccountNumber: "5432109876",
            bank: "DEF Bank",
            balance: 180000,
            description: "Thanh toán hóa đơn internet",
        },
        {
            id: 7,
            createdAt: "2024-12-28T16:45:50Z",
            sourceAccountNumber: "7890123456",
            amount: 200000,
            targetAccountNumber: "6543210987",
            bank: "ABC Bank",
            balance: 950000,
            description: "Chuyển khoản bạn bè",
        },
        {
            id: 8,
            createdAt: "2024-12-28T17:00:00Z",
            sourceAccountNumber: "8901234567",
            amount: 50000,
            targetAccountNumber: "7654321098",
            bank: "DEF Bank",
            balance: 500000,
            description: "Mua thẻ cào điện thoại",
        },
        {
            id: 9,
            createdAt: "2024-12-28T18:30:15Z",
            sourceAccountNumber: "9012345678",
            amount: 450000,
            targetAccountNumber: "8765432109",
            bank: "ABC Bank",
            balance: 550000,
            description: "Chuyển tiền cho người thân",
        },
        {
            id: 10,
            createdAt: "2024-12-28T19:45:00Z",
            sourceAccountNumber: "0123456789",
            amount: 300000,
            targetAccountNumber: "9876543210",
            bank: "DEF Bank",
            balance: 1000000,
            description: "Thanh toán dịch vụ truyền hình",
        },
    ];

    const [error, setError] = useState<string>("");


    const [statsData, setStatsData] = useState<{ title: string; stats: string }[]>([
        { title: "Ngân hàng", stats: "WNC BANK" },
        { title: "Tổng số giao dịch", stats: "0" },
        { title: "Tổng số tiền", stats: "0" }
    ]);


    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // useEffect(() => {
    //     const fetchEmployees = async () => {
    //         try {
    //             const response = await fetch(`${apiUrl}/staff/transactions-by-account/accountNumber=${"220380009532"}`,
    //                 {
    //                     method: "GET",
    //                     headers: { "Content-Type": "application/json" },
    //                     credentials: "include",
    //                 }
    //             );
    //             if (response.ok) {
    //                 setError("");
    //                 const data = await response.json();
    //                 setTransactions(data.data);
    //             } else {
    //                 setTransactions([]);
    //             }
    //         } catch (error) {
    //             setError("Đã xảy ra lỗi kết nối với máy chủ");
    //             setTransactions([]);
    //         }
    //     };
    //     fetchEmployees();
    // }, []);

    // State for filters and pagination
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("Tất cả");
    const partner = ['Tất cả', 'ABC Bank', 'DEF Bank'];
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const options = partner.map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    ));
    const [timeFilter, setTimeFilter] = useState<string>("Mới nhất");
    const [activePage, setActivePage] = useState<number>(1);

    // State for selected transaction
    const [selectedTransaction, setSelectedTransaction] = useState<ExternalTransaction | null>(null);


    // Filter transactions based on selected filters
    const filteredTransactions =
        transactions.filter((transaction) => {
            if (transactionTypeFilter === "Tất cả") return true;
            return transaction.bank === transactionTypeFilter;
        });


    // Adjust data for stats based on selected filters
    const HandleBankChange = (bank: string) => {
        const filtered = bank === "Tất cả"
            ? transactions
            : transactions.filter((transaction) => transaction.bank === bank);

        const totalTransactions = filtered.length;
        const totalAmount = filtered.reduce((sum, transaction) => sum + transaction.amount, 0);

        setStatsData([
            { title: "Ngân hàng", stats: bank },
            { title: "Tổng số giao dịch", stats: totalTransactions.toString() },
            { title: "Tổng số tiền", stats: totalAmount.toLocaleString("vi-VN") },
        ]);
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

    // Create stats
    const stats = statsData.map((stat) => (
        <div key={stat.title} className={classes.stat}>
            <Text className={classes.title}>{stat.title}</Text>
            <Text className={classes.count}>{stat.stats}</Text>
        </div>
    ));

    // Create table rows for current page
    const rows = currentPageTransactions.map((transaction, index) => (
        <Table.Tr key={index}>
            <Table.Td>{formatDateString(transaction.createdAt)}</Table.Td>
            <Table.Td>{transaction.amount.toLocaleString("vi-VN")}</Table.Td>
            <Table.Td>{transaction.bank}</Table.Td>
            <Table.Td>{transaction.balance.toLocaleString("vi-VN")}</Table.Td>
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

            {/* Filter Section */}
            <Group align="center" mb="md" mt="lg">
                <Group justify="flex-start" gap="md">
                    <Text>Từ:</Text>

                    <SegmentedControl
                        color="blue"
                        value={timeFilter}
                        onChange={setTimeFilter}
                        data={["Mới nhất", "Cũ nhất"]}
                    />
                </Group>

                <Group justify="flex-start" gap="md">

                    <Text>Ngân hàng:</Text>

                    <Combobox
                        store={combobox}
                        onOptionSubmit={(val) => {
                            setTransactionTypeFilter(val);
                            HandleBankChange(val);
                            combobox.closeDropdown();
                        }}
                        style={{ width: "200px" }}
                    >
                        <Combobox.Target>
                            <InputBase
                                component="button"
                                type="button"
                                pointer
                                rightSection={<Combobox.Chevron />}
                                rightSectionPointerEvents="none"
                                onClick={() => combobox.toggleDropdown()}
                            >
                                {transactionTypeFilter || <Input.Placeholder>Chọn ngân hàng</Input.Placeholder>}
                            </InputBase>
                        </Combobox.Target>

                        <Combobox.Dropdown>
                            <Combobox.Options>{options}</Combobox.Options>
                        </Combobox.Dropdown>
                    </Combobox>
                </Group>
            </Group>

            {/* Table */}
            {filteredTransactions.length === 0 ? (
                <Center mt="xl" bg="red.3">
                    <Text size="sm">
                        {error ? error : "Chưa có lịch sử giao dịch nào!"}
                    </Text>
                </Center>
            ) : (
                <>
                    <Table verticalSpacing="sm" mt="xl" striped>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Thời gian</Table.Th>
                                <Table.Th>Giao dịch</Table.Th>
                                <Table.Th>Ngân hàng</Table.Th>
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
                <ExternalTransactionDetail transaction={selectedTransaction} />
            </Modal>
        </Paper>
    );
};

export default ExternalTransactionHistoryTable;
