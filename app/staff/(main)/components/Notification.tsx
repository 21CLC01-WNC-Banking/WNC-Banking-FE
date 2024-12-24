import { Stack, Divider, Box, Text } from "@mantine/core";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const notifications = [
    { dateTime: "12/08/2024 20:05", content: "Push code mới nhanh lên" },
    { dateTime: "12/08/2024 11:05", content: "Push code mới nhanh lên" },
    { dateTime: "12/08/2024 11:05", content: "Push code mới nhanh lên" },
    { dateTime: "12/08/2024 11:05", content: "Push code mới nhanh lên" },
];

const getElapsedTime = (dateTime: string): string => {
    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) {
        return "Thời gian không hợp lệ";
    }

    return formatDistanceToNow(parsedDate, { addSuffix: true, locale: vi });
};

const Notification: React.FC = () => {
    return (
        <Box p={24}>
            {notifications.map((noti, index) => (
                <>
                    <Stack key={index}>
                        <Text lineClamp={2}>{noti.content}</Text>
                        <Text size="sm" c="gray">
                            {getElapsedTime(noti.dateTime)}
                        </Text>
                    </Stack>
                    <Divider size="xs" my={10} />
                </>
            ))}
        </Box>
    );
};
export default Notification;
