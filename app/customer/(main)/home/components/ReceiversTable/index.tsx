"use client";

import { useState, useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { getReceiversThunk } from "@/lib/thunks/customer/ReceiversThunks";
import { ReceiverAccount } from "@/lib/types/customer";
import { formatAccountNumber, makeToast } from "@/lib/utils/customer";

import {
    ActionIcon,
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

import DeleteReceiverModal from "./DeleteReceiverModal";
import EditReceiverModal from "./EditReceiverModal";
import CreateRequestModal from "@/components/CreateRequestModal";

import classes from "./ReceiversTable.module.css";

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
        keys(data[0]).some(
            (key) => typeof item[key] === "string" && item[key].toLowerCase().includes(query)
        )
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
                return String(b[sortBy]).localeCompare(String(a[sortBy]));
            }

            return String(a[sortBy]).localeCompare(String(b[sortBy]));
        }),
        payload.search
    );
};

const ReceiversTable = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const receivers = useAppSelector((state) => state.receivers.receivers);

    const [search, setSearch] = useState("");
    const [sortedData, setSortedData] = useState<ReceiverAccount[]>([]);
    const [sortBy, setSortBy] = useState<keyof ReceiverAccount | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const setSorting = (field: keyof ReceiverAccount) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(receivers, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(
            sortData(receivers, { sortBy, reversed: reverseSortDirection, search: value })
        );
    };

    const handleTransferAction = (row: ReceiverAccount) => {
        if (row.bankId === null) {
            router.push(`/customer/transfer/internal?to=${row.receiverAccountNumber.trim()}`);
        } else {
            router.push(
                `/customer/transfer/external?to=${row.receiverAccountNumber}&bankId=${row.bankId}`
            );
        }
    };

    const rows = sortedData.map((row) => (
        <Table.Tr key={row.receiverAccountNumber.trim()}>
            <Table.Td pl="md">{row.receiverNickname.trim()}</Table.Td>
            <Table.Td pl="md">
                {row.bankShortName === "" ? "WNC Bank" : row.bankShortName.trim()}
            </Table.Td>
            <Table.Td pl="md">{formatAccountNumber(row.receiverAccountNumber)}</Table.Td>

            <Table.Td>
                <Group gap="md" justify="flex-end">
                    {row.bankId === null && (
                        <CreateRequestModal
                            targetAccountNumber={formatAccountNumber(row.receiverAccountNumber)}
                            isFromReceiversList={true}
                        />
                    )}

                    <Tooltip label="Chuyển khoản">
                        <ActionIcon
                            radius="md"
                            variant="subtle"
                            color="green"
                            onClick={() => handleTransferAction(row)}
                        >
                            <IconCreditCardPay size={20} />
                        </ActionIcon>
                    </Tooltip>

                    <EditReceiverModal
                        receiverId={row.id}
                        receiverNickname={row.receiverNickname}
                    />

                    <DeleteReceiverModal receiverId={row.id} />
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    useEffect(() => {
        const fetchReceivers = async () => {
            try {
                await dispatch(getReceiversThunk()).unwrap();
            } catch (error) {
                makeToast(
                    "error",
                    "Truy vấn danh sách người nhận thất bại",
                    (error as Error).message
                );
            }
        };

        fetchReceivers();
    }, [dispatch]);

    useEffect(() => {
        setSortedData(receivers);
    }, [receivers]);

    return (
        <Stack>
            <TextInput
                placeholder="Tìm kiếm"
                radius="md"
                size="md"
                leftSection={<IconSearch size={20} />}
                value={search}
                onChange={handleSearchChange}
            />

            <ScrollArea h={450}>
                <Table horizontalSpacing="sm" verticalSpacing="xs" layout="auto" highlightOnHover>
                    <Table.Tbody>
                        <Table.Tr>
                            <SortableTableHeader
                                sorted={sortBy === "receiverNickname"}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting("receiverNickname")}
                            >
                                Tên gợi nhớ
                            </SortableTableHeader>

                            <SortableTableHeader
                                sorted={sortBy === "bankShortName"}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting("bankShortName")}
                            >
                                Ngân hàng
                            </SortableTableHeader>

                            <Table.Th style={{ fontWeight: 600 }} className={classes.th} pl="md">
                                Số tài khoản
                            </Table.Th>

                            <Table.Th className={classes.th} />
                        </Table.Tr>
                    </Table.Tbody>

                    <Table.Tbody>
                        {receivers.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={3}>
                                    <Text ta="center">Bạn chưa lưu người nhận nào</Text>
                                </Table.Td>
                            </Table.Tr>
                        ) : rows.length > 0 ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={3}>
                                    <Text ta="center">Không tìm thấy người nhận</Text>
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
