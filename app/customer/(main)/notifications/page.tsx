"use client";

import { mapNotification } from "@/lib/utils/customer";
import { Notification } from "@/lib/types/customer";
import { useAppSelector } from "@/lib/hooks/withTypes";

import { Paper, Center, Title } from "@mantine/core";

import NotificationItem from "@/components/NotificationItem";

const Notifications = () => {
    const notifications = useAppSelector((state) => state.notifications.notifications);

    return (
        <Paper withBorder mx={120} radius="md" p={30} my={50}>
            <Center mb="xl">
                <Title order={2}>Thông báo</Title>
            </Center>

            {notifications.map((notif: Notification) => (
                <NotificationItem key={notif.id} {...mapNotification(notif)} />
            ))}
        </Paper>
    );
};

export default Notifications;
