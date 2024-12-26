"use client";

import { useState, useEffect } from "react";

import { Table, Text, Pagination, Center, TextInput, Group, SegmentedControl } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { PaymentRequest } from "@/app/customer/lib/types";
import { chunk } from "@/app/customer/lib/utils";
import data from "@/app/customer/lib/mock_data/requests_sent.json";
import CancelModal from "./CancelModal";
import InfoModal from "./InfoModal";
import CreateRequestModal from "@/components/CreateRequestModal";

const SentRequests: React.FC = () => {
    const requests: PaymentRequest[] = data.map((request) => ({
        ...request,
        status: request.status as "Đã thanh toán" | "Chưa thanh toán" | "Đã hủy",
    }));

    const [requestStatusFilter, setRequestStatusFilter] = useState<string>("Tất cả");
    const [timeFilter, setTimeFilter] = useState<string>("Mới nhất");
    const [activePage, setActivePage] = useState<number>(1);

    // sort requests by time
    const sortByTime = (elements: PaymentRequest[], filter: string) => {
        return elements.sort((a, b) => {
            const dateA = new Date(a.requestTime);
            const dateB = new Date(b.requestTime);
            return filter === "Mới nhất"
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
        });
    };

    // filter requests based on selected filters
    const filteredRequests = sortByTime(
        requests.filter((request) => {
            if (requestStatusFilter === "Tất cả") return true;
            return request.status === requestStatusFilter;
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
        <Table.Tr
            key={index}
            bg={
                request.status === "Đã hủy"
                    ? "yellow.1"
                    : request.status === "Đã thanh toán"
                    ? "green.1"
                    : "red.2"
            }
        >
            <Table.Td>{request.requestTime}</Table.Td>
            <Table.Td>{request.target}</Table.Td>
            <Table.Td>{request.amount}</Table.Td>
            <Table.Td>{request.status}</Table.Td>
            <Table.Td>
                <Group gap="md" justify="flex-end">
                    {request.status === "Chưa thanh toán" && <CancelModal />}

                    <InfoModal />
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Group mb="md" grow justify="space-between" align="center">
                <TextInput
                    placeholder="Tìm kiếm"
                    radius="md"
                    size="md"
                    leftSection={<IconSearch size={20} />}
                />

                <CreateRequestModal isFromReceiversList={false} />
            </Group>

            {/* Filter Section */}
            <Group justify="space-between" align="center" mb="md" mt="xl">
                <Group justify="flex-start" gap="md">
                    <Text>Thời gian gửi nhắc nợ:</Text>

                    <SegmentedControl
                        color="blue"
                        value={timeFilter}
                        onChange={setTimeFilter}
                        data={["Mới nhất", "Cũ nhất"]}
                    />
                </Group>

                <Group justify="flex-end" gap="md">
                    <Text>Trạng thái:</Text>

                    <SegmentedControl
                        color="blue"
                        value={requestStatusFilter}
                        onChange={setRequestStatusFilter}
                        data={["Tất cả", "Đã thanh toán", "Chưa thanh toán", "Đã hủy"]}
                    />
                </Group>
            </Group>

            {/* Table */}
            <Table verticalSpacing="sm" mt="xl">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Thời gian nhắc</Table.Th>
                        <Table.Th>Đối tượng nợ</Table.Th>
                        <Table.Th>Số tiền nợ</Table.Th>
                        <Table.Th>Trạng thái</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
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

export default SentRequests;
