"use client";
import { IconEye } from "@tabler/icons-react";
import { Paper, Table, Text, Pagination, Center, Group, Button, Modal } from "@mantine/core";
import { Input, InputBase, Combobox, useCombobox } from "@mantine/core";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import ExternalTransactionDetail from "./ExternalTransactionDetail";
import classes from "../../employee/components/AccountCard.module.css";
import { chunk } from "../../../../lib/utils/staff";
import { formatDateString } from "@/lib/utils/customer";
import { ExternalTransaction, PartnerBank } from "@/lib/types/staff";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { formatDate } from "@/lib/utils/staff";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

const ExternalTransactionHistoryTable: React.FC = () => {
    // State for modal control
    const [opened, { open, close }] = useDisclosure(false);
    const [transactions, setTransactions] = useState<ExternalTransaction[]>([]);

    // State for datepicker from and to
    const [from, setFrom] = useState<DateValue>(
        new Date(new Date().setMonth(new Date().getMonth() - 1))
    );
    const [to, setTo] = useState<DateValue>(new Date());

    const [error, setError] = useState<string>("");

    const [statsData, setStatsData] = useState<{ title: string; stats: string }[]>([
        { title: "Ngân hàng", stats: "Tất cả ngân hàng" },
        { title: "Tổng số giao dịch", stats: "0" },
        { title: "Tổng số tiền", stats: "0" },
    ]);

    const fetchExternalTransactions = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(
                `${apiUrl}/admin/external-transaction?fromDate=${formatDate(
                    from
                )}&toDate=${formatDate(to)}%2023:59:59`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            if (response.ok) {
                setError("");
                const data = await response.json();
                setTransactions(data.data);

                // Filter transactions based on transactionTypeFilter
                const filteredTransactions =
                    transactionTypeFilter === "Tất cả ngân hàng"
                        ? data.data
                        : data.data.filter(
                            (transaction: ExternalTransaction) =>
                                transaction.partnerBankShortName === transactionTypeFilter
                        );

                const totalTransactions = filteredTransactions.length;
                const totalAmount = filteredTransactions.reduce(
                    (sum: number, transaction: { amount: number }) => sum + transaction.amount,
                    0
                );

                setStatsData([
                    { title: "Ngân hàng", stats: transactionTypeFilter },
                    { title: "Tổng số giao dịch", stats: totalTransactions.toString() },
                    { title: "Tổng số tiền", stats: totalAmount.toLocaleString("vi-VN") },
                ]);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            setError("Đã xảy ra lỗi kết nối với máy chủ");
            setTransactions([]);
        }
    };


    useEffect(() => {
        fetchExternalTransactions();
    }, [from, to]);

    const fetchPartner = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(
                `${apiUrl}/partner-bank/`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    const shortNames = data.data.map((bank: PartnerBank) => bank.shortName);
                    setPartner((prevPartner) => ["Tất cả ngân hàng", ...shortNames]);
                } else {
                    setPartner(["Tất cả ngân hàng"]);
                }
            } else {
                setPartner(["Tất cả ngân hàng"]);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setPartner(["Tất cả ngân hàng"]);
        }
    };

    useEffect(() => {
        fetchPartner();
    }, []);

    // State for filters and pagination
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("Tất cả ngân hàng");
    const [partner, setPartner] = useState(["Tất cả ngân hàng"]);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const options = partner.map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    ));

    const [activePage, setActivePage] = useState<number>(1);

    // State for selected transaction
    const [selectedTransaction, setSelectedTransaction] = useState<ExternalTransaction | null>(null);

    // Filter transactions based on selected filters
    const filteredTransactions = transactions.filter((transaction) => {
        if (transactionTypeFilter === "Tất cả ngân hàng") return true;
        return transaction.partnerBankShortName === transactionTypeFilter;
    });

    // Adjust data for stats based on selected filters
    const HandleBankChange = (bank: string) => {
        const filtered =
            bank === "Tất cả ngân hàng"
                ? transactions
                : transactions.filter((transaction) => transaction.partnerBankShortName === bank);

        const totalTransactions = filtered.length;
        const totalAmount = filtered.reduce((sum, transaction) => sum + transaction.amount, 0);

        setStatsData([
            { title: "Ngân hàng", stats: bank.includes("J97") ? "J97 Bank" : bank },
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
            <Table.Td>{formatDateString(transaction.updatedAt)}</Table.Td>
            <Table.Td>{transaction.amount.toLocaleString("vi-VN")}</Table.Td>
            <Table.Td>{transaction.partnerBankShortName}</Table.Td>
            <Table.Td>{transaction.partnerBankCode}</Table.Td>
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

                    <DatePickerInput
                        placeholder="Từ ngày"
                        value={from}
                        onChange={setFrom}
                        locale="vi"
                    />
                </Group>

                <Group justify="flex-start" gap="md">
                    <Text>Đến:</Text>

                    <DatePickerInput
                        placeholder="Từ ngày"
                        value={to}
                        onChange={setTo}
                        locale="vi"
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
                        width="max-content"
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
                                {transactionTypeFilter || (
                                    <Input.Placeholder>Chọn ngân hàng</Input.Placeholder>
                                )}
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
                    <Text size="sm">{error ? error : "Chưa có lịch sử giao dịch nào!"}</Text>
                </Center>
            ) : (
                <>
                    <Table verticalSpacing="sm" mt="xl" striped>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Thời Gian</Table.Th>
                                <Table.Th>Giao Dịch</Table.Th>
                                <Table.Th>Ngân Hàng</Table.Th>
                                <Table.Th>Mã Ngân Hàng</Table.Th>
                                <Table.Th>Xem Chi Tiết</Table.Th>
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
