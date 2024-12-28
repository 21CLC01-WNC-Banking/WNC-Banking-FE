"use client";

import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { PaymentRequest } from "@/lib/types/customer";
import {
    chunk,
    formatCurrency,
    formatDateString,
    makeToast,
    mapRequestStatus,
} from "@/lib/utils/customer";
import { getReceivedRequestsThunk } from "@/lib/thunks/customer/TransactionsThunk";

import {
    Table,
    Text,
    Pagination,
    Center,
    TextInput,
    Group,
    SegmentedControl,
    ActionIcon,
    Tooltip,
} from "@mantine/core";
import { IconCreditCardPay, IconSearch } from "@tabler/icons-react";

import CancelModal from "./CancelModal";
import InfoModal from "@/components/InfoModal";

const makeRequestInfoModalContent = (request: PaymentRequest) => {
    return {
        title: "Thông tin nhắc nợ",
        content: [
            { label: "Mã nhắc nợ", value: request.debtReminder.id },
            { label: "Thời gian", value: formatDateString(request.debtReminder.createdAt) },
            {
                label: "Người nhắc nợ",
                value: request.sender,
            },
            { label: "Số tiền nợ", value: formatCurrency(request.debtReminder.amount) },
            { label: "Nội dung", value: request.debtReminder.description },
            { label: "Trạng thái", value: mapRequestStatus(request.debtReminder.status) },
        ],
    };
};

const ReceivedRequests: React.FC = () => {
    const dispatch = useAppDispatch();
    const requests = useAppSelector((state) => state.transactions.receivedRequests);

    const [requestStatusFilter, setRequestStatusFilter] = useState<string>("all");
    const [timeFilter, setTimeFilter] = useState<string>("Mới nhất");
    const [activePage, setActivePage] = useState<number>(1);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                await dispatch(getReceivedRequestsThunk()).unwrap();
            } catch (error) {
                makeToast("error", "Truy vấn danh sách nhắc nợ thất bại", (error as Error).message);
            }
        };

        fetchRequests();
    }, [dispatch]);

    // sort requests by time
    const sortByTime = (elements: PaymentRequest[], filter: string) => {
        return elements.sort((a, b) => {
            const dateA = new Date(a.debtReminder.createdAt);
            const dateB = new Date(b.debtReminder.createdAt);
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
            <Table.Td>{request.sender}</Table.Td>
            <Table.Td>{formatCurrency(request.debtReminder.amount)}</Table.Td>
            <Table.Td
                fw={600}
                c={
                    request.debtReminder.status === "pending"
                        ? "yellow.7"
                        : request.debtReminder.status === "success"
                        ? "green.7"
                        : "red.7"
                }
            >
                {mapRequestStatus(request.debtReminder.status)}
            </Table.Td>
            <Table.Td>
                <Group gap="md" justify="flex-end">
                    {request.debtReminder.status === "pending" && (
                        <Tooltip label="Thanh toán">
                            <ActionIcon variant="subtle" color="green">
                                <IconCreditCardPay size={20} />
                            </ActionIcon>
                        </Tooltip>
                    )}

                    {request.debtReminder.status === "pending" && <CancelModal />}

                    <InfoModal {...makeRequestInfoModalContent(request)} />
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <TextInput
                leftSection={<IconSearch size={20} />}
                placeholder="Tìm kiếm"
                radius="md"
                size="md"
            />

            {/* Filter Section */}
            <Group justify="space-between" align="center" mb="md" mt="xl">
                <Group justify="flex-start" gap="md">
                    <Text>Thời gian gửi nhắc nợ:</Text>

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
            <Table verticalSpacing="sm" mt="xl">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Thời gian nhắc</Table.Th>
                        <Table.Th>Người nhắc</Table.Th>
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
                    total={paginatedRequests.length}
                    value={activePage}
                    onChange={setActivePage}
                    mt="xl"
                />
            </Center>
        </>
    );
};

export default ReceivedRequests;
