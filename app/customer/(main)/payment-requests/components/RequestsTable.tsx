"use client";

import { useState, useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";

import { PaymentRequest } from "@/lib/types/customer";
import {
    chunk,
    formatDateString,
    formatCurrency,
    makeToast,
    mapRequestStatus,
    mapColor,
} from "@/lib/utils/customer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import {
    getReceivedRequestsThunk,
    getSentRequestsThunk,
} from "@/lib/thunks/customer/TransactionsThunk";

import {
    Table,
    Text,
    Pagination,
    Center,
    Group,
    SegmentedControl,
    ActionIcon,
    Tooltip,
} from "@mantine/core";
import { IconCreditCardPay } from "@tabler/icons-react";

import InfoModal, { InfoModalProps } from "@/components/InfoModal";
import CreateRequestModal from "@/components/CreateRequestModal";
import CancelModal from "./CancelModal";

const makeRequestInfoModalContent = (
    request: PaymentRequest,
    type: "received" | "sent"
): InfoModalProps => {
    return {
        title: "Thông tin nhắc nợ",
        content: [
            { label: "Mã nhắc nợ", values: [request.debtReminder.id] },
            { label: "Thời gian nhắc", values: [formatDateString(request.debtReminder.createdAt)] },
            {
                label: type === "received" ? "Người nhắc nợ" : "Người nợ",
                values: type === "received" ? [request.sender] : [request.receiver],
            },
            { label: "Số tiền nợ", values: [formatCurrency(request.debtReminder.amount)] },
            { label: "Nội dung", values: [request.debtReminder.description] },
            {
                label: "Trạng thái",
                values: [mapRequestStatus(request.debtReminder.status)],
                color: mapColor(request.debtReminder.status),
            },
            ...(request.reply
                ? [
                      { label: "divider" },
                      { label: "Người hủy", values: [request.reply.userReplyName] },
                      { label: "Nội dung hủy", values: [request.reply.content] },
                      {
                          label: "Thời gian hủy",
                          values: [formatDateString(request.reply.updatedAt)],
                      },
                  ]
                : []),
            ...(request.debtReminder.status === "success"
                ? [
                      { label: "divider" },
                      { label: "Thời gian thanh toán", values: [request.debtReminder.updatedAt] },
                  ]
                : []),
        ],
    };
};

interface RequestsTableProps {
    type: "received" | "sent";
}

const RequestsTable: React.FC<RequestsTableProps> = ({ type }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const requests = useAppSelector((state) =>
        type === "received" ? state.transactions.receivedRequests : state.transactions.sentRequests
    );

    const [requestStatusFilter, setRequestStatusFilter] = useState<string>("all");
    const [timeFilter, setTimeFilter] = useState<string>("Mới nhất");
    const [activePage, setActivePage] = useState<number>(1);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                await dispatch(
                    type === "received" ? getReceivedRequestsThunk() : getSentRequestsThunk()
                ).unwrap();
            } catch (error) {
                makeToast("error", "Truy vấn danh sách nhắc nợ thất bại", (error as Error).message);
            }
        };

        fetchRequests();
    }, [dispatch, type]);

    const handleTransferAction = (row: PaymentRequest) => {
        router.push(
            `/customer/transfer/debt-payment?id=${
                row.debtReminder.id
            }&to=${row.debtReminder.targetAccountNumber.trim()}&amount=${row.debtReminder.amount}`
        );
    };

    // sort requests by time
    const sortByTime = (elements: PaymentRequest[], filter: string) => {
        return elements.sort((a, b) => {
            const dateA = new Date(a.debtReminder.updatedAt);
            const dateB = new Date(b.debtReminder.updatedAt);
            return filter === "Mới nhất"
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
        });
    };

    // filter requests based on selected filters
    const filteredRequests = sortByTime(
        requests.filter((request) => {
            if (requestStatusFilter === "all") return true;
            return request.debtReminder.status === requestStatusFilter;
        }),
        timeFilter
    );

    // chunk the filtered requests into pages
    const paginatedRequests = chunk(filteredRequests, 6);

    const totalPages = paginatedRequests.length;

    useEffect(() => {
        if (activePage > totalPages && totalPages > 0) {
            setActivePage(totalPages); // adjust to the last page
        } else if (activePage === 0 && totalPages > 0) {
            setActivePage(1); // reset to the first page
        }
    }, [filteredRequests, activePage, totalPages]);

    // get current page requests
    const currentPageRequests = paginatedRequests[activePage - 1] || [];

    // create table rows for current page
    const rows = currentPageRequests.map((request, index) => (
        <Table.Tr key={index}>
            <Table.Td>{formatDateString(request.debtReminder.createdAt)}</Table.Td>
            <Table.Td>{type === "received" ? request.sender : request.receiver}</Table.Td>
            <Table.Td>{formatCurrency(request.debtReminder.amount)}</Table.Td>
            <Table.Td fw={600} c={mapColor(request.debtReminder.status)}>
                {mapRequestStatus(request.debtReminder.status)}
            </Table.Td>
            <Table.Td>
                <Group gap="md" justify="flex-end">
                    {type === "received" && request.debtReminder.status === "pending" && (
                        <Tooltip label="Thanh toán">
                            <ActionIcon
                                maw="md"
                                radius="md"
                                variant="subtle"
                                color="green"
                                onClick={() => handleTransferAction(request)}
                            >
                                <IconCreditCardPay size={20} />
                            </ActionIcon>
                        </Tooltip>
                    )}

                    {request.debtReminder.status === "pending" && (
                        <CancelModal requestId={request.debtReminder.id} type={type} />
                    )}

                    <InfoModal {...makeRequestInfoModalContent(request, type)} />
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            {type === "sent" && (
                <Group mb="md" grow justify="flex-end" align="center">
                    <CreateRequestModal isFromReceiversList={false} />
                </Group>
            )}

            {/* Filter Section */}
            <Group justify="space-between" align="center" mb="md" mt="xl">
                <Group justify="flex-start" gap="md">
                    <Text>Thời gian nhắc:</Text>

                    <SegmentedControl
                        radius="md"
                        color="blue"
                        value={timeFilter}
                        onChange={setTimeFilter}
                        data={["Mới nhất", "Cũ nhất"]}
                    />
                </Group>

                <Group justify="flex-end" gap="md">
                    <Text>Trạng thái:</Text>

                    <SegmentedControl
                        radius="md"
                        color="blue"
                        value={requestStatusFilter}
                        onChange={setRequestStatusFilter}
                        data={[
                            { label: "Tất cả", value: "all" },
                            { label: "Đã thanh toán", value: "success" },
                            { label: "Chưa thanh toán", value: "pending" },
                            { label: "Đã hủy", value: "failed" },
                        ]}
                    />
                </Group>
            </Group>

            {/* Table */}
            <Table verticalSpacing="sm" mt="xl" highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Thời gian nhắc</Table.Th>
                        <Table.Th>
                            {type === "received" ? "Người nhắc nợ" : "Đối tượng nợ"}
                        </Table.Th>
                        <Table.Th>Số tiền nợ</Table.Th>
                        <Table.Th>Trạng thái</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={5}>
                                <Text ta="center">Không có nhắc nợ nào</Text>
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
                    total={paginatedRequests.length}
                    value={activePage}
                    onChange={setActivePage}
                    mt="xl"
                />
            </Center>
        </>
    );
};

export default RequestsTable;
