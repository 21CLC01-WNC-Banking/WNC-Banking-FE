"use client";

import { Paper, Center, Title } from "@mantine/core";
import NotificationItem from "@/components/NotificationItem";

const Notifications = () => {
    return (
        <Paper withBorder mx={120} radius="md" p={30} my={50}>
            <Center mb="xl">
                <Title order={2}>Thông báo</Title>
            </Center>

            <NotificationItem
                title="Nhận tiền chuyển khoản"
                content="Nội dung thông báo"
                time="12:00 01/01/2022"
                read={false}
            />

            <NotificationItem
                title="Nhận tiền chuyển khoản"
                content="Nội dung thông báo"
                time="12:00 01/01/2022"
                read={false}
            />

            <NotificationItem
                title="Nợ chưa thanh toán"
                content="Nội dung thông báo"
                time="10:00 01/01/2022"
                read={true}
            />

            <NotificationItem
                title="Nợ chưa thanh toán"
                content="Nội dung thông báo"
                time="10:00 01/01/2022"
                read={true}
            />

            <NotificationItem
                title="Nợ chưa thanh toán"
                content="Nội dung thông báo"
                time="10:00 01/01/2022"
                read={true}
            />

            <NotificationItem
                title="Nợ chưa thanh toán"
                content="Nội dung thông báo"
                time="10:00 01/01/2022"
                read={true}
            />

            <NotificationItem
                title="Nợ chưa thanh toán"
                content="Nội dung thông báo"
                time="10:00 01/01/2022"
                read={true}
            />

            <NotificationItem
                title="Nợ chưa thanh toán"
                content="Nội dung thông báo"
                time="10:00 01/01/2022"
                read={true}
            />

            <NotificationItem
                title="Nợ chưa thanh toán"
                content="Nội dung thông báo"
                time="10:00 01/01/2022"
                read={true}
            />

            <NotificationItem
                title="Nợ chưa thanh toán"
                content="Nội dung thông báo"
                time="10:00 01/01/2022"
                read={true}
            />
        </Paper>
    );
};

export default Notifications;
