import { Text, UnstyledButton, Group } from "@mantine/core";

import classes from "./NotificationItem.module.css";

interface Notification {
    title?: string;
    content?: string;
    time?: string;
    read: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const NotificationItem: React.FC<Notification> = ({ title, content, time, read, onClick }) => {
    return (
        <UnstyledButton
            my={8}
            className={read ? classes.notifRead : classes.notif}
            onClick={onClick}
        >
            <div style={{ width: "100%" }}>
                <Text fw={500} mb={7} lh={1}>
                    {title}
                </Text>

                <Text fz="sm">{content}</Text>

                <Group justify="flex-end">
                    <Text fz="xs" c="dimmed">
                        {time}
                    </Text>
                </Group>
            </div>
        </UnstyledButton>
    );
};

export default NotificationItem;
