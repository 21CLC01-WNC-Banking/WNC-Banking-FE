"use client";

import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";

import {
    ActionIcon,
    Button,
    Center,
    Group,
    keys,
    ScrollArea,
    Stack,
    Table,
    Text,
    TextInput,
    Tooltip,
    UnstyledButton,
} from "@mantine/core";
import {
    IconChevronDown,
    IconChevronUp,
    IconSearch,
    IconSelector,
    IconCreditCardPay,
} from "@tabler/icons-react";

import classes from "./ReceiversTable.module.css";

import accounts from "@/lib/mock_data/accounts.json";
import { ReceiverAccount } from "@/lib/types/customer";
import DeleteReceiverModal from "./DeleteReceiverModal";
import EditReceiverModal from "./EditReceiverModal";
import CreateRequestModal from "@/components/CreateRequestModal";

interface SortableTableHeaderProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort: () => void;
    className?: string;
}

const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
    children,
    reversed,
    sorted,
    onSort,
}) => {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;

    return (
        <Table.Th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon size={16} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
};

const filterData = (data: ReceiverAccount[], search: string) => {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
    );
};

const sortData = (
    data: ReceiverAccount[],
    payload: { sortBy: keyof ReceiverAccount | null; reversed: boolean; search: string }
) => {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => {
            if (payload.reversed) {
                return b[sortBy].localeCompare(a[sortBy]);
            }

            return a[sortBy].localeCompare(b[sortBy]);
        }),
        payload.search
    );
};

const data = accounts;

const ReceiversTable = () => {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState<keyof ReceiverAccount | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const setSorting = (field: keyof ReceiverAccount) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const handleTransferAction = (row: ReceiverAccount) => {
        if (row.bank === "WNC Bank") {
            router.push(`/customer/transfer/internal?to=${row.accountNumber.trim()}`);
        } else {
            router.push(
                `/customer/transfer/external?to=${row.accountNumber}&at=${row.bank.trim()}`
            );
        }
    };

    const rows = sortedData.map((row) => (
        <Table.Tr key={row.name.trim()}>
            <Table.Td>{row.nickname.trim()}</Table.Td>
            <Table.Td>{row.name.trim()}</Table.Td>
            <Table.Td>{row.bank.trim()}</Table.Td>
            <Table.Td>{row.accountNumber.replace(/(\d{4})/g, "$1 ").trim()}</Table.Td>

            <Table.Td>
                <Group gap="md" justify="flex-end">
                    {row.bank === "WNC Bank" && (
                        <CreateRequestModal
                            target={row.accountNumber.replace(/(\d{4})/g, "$1 ").trim()}
                            isFromReceiversList={true}
                        />
                    )}

                    <Tooltip label="Chuyển khoản">
                        <ActionIcon
                            variant="subtle"
                            color="green"
                            onClick={() => handleTransferAction(row)}
                        >
                            <IconCreditCardPay size={20} />
                        </ActionIcon>
                    </Tooltip>

                    <EditReceiverModal />

                    <DeleteReceiverModal />
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack>
            <Group mb="md" grow justify="space-between" align="center">
                <TextInput
                    placeholder="Tìm kiếm"
                    radius="md"
                    size="md"
                    leftSection={<IconSearch size={20} />}
                    value={search}
                    onChange={handleSearchChange}
                />

                <Button size="md" radius="md" maw={200}>
                    Thêm người nhận
                </Button>
            </Group>

            <ScrollArea h={450}>
                <Table horizontalSpacing="sm" verticalSpacing="xs" layout="auto" highlightOnHover>
                    <Table.Tbody>
                        <Table.Tr>
                            <SortableTableHeader
                                sorted={sortBy === "nickname"}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting("nickname")}
                            >
                                Tên gợi nhớ
                            </SortableTableHeader>

                            <SortableTableHeader
                                sorted={sortBy === "name"}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting("name")}
                            >
                                Người nhận
                            </SortableTableHeader>

                            <SortableTableHeader
                                sorted={sortBy === "bank"}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting("bank")}
                            >
                                Ngân hàng
                            </SortableTableHeader>

                            <Table.Th style={{ fontWeight: 600 }} className={classes.th}>
                                Số tài khoản
                            </Table.Th>

                            <Table.Th className={classes.th} />
                        </Table.Tr>
                    </Table.Tbody>

                    <Table.Tbody>
                        {rows.length > 0 ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={Object.keys(data[0]).length}>
                                    <Text fw={500} ta="center">
                                        Không tìm thấy người nhận
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </Stack>
    );
};

export default ReceiversTable;
