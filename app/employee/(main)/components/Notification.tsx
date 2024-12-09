import { Flex, Center, Title, Divider, Box, Text } from "@mantine/core";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const notifications = [
    { dateTime: "12/08/2024 20:05", content: "Push code mới nhanh lên" },
    { dateTime: "12/08/2024 11:05", content: "Push code mới nhanh lên" },
    { dateTime: "12/08/2024 11:05", content: "Push code mới nhanh lên" },
    { dateTime: "12/08/2024 11:05", content: "Push code mới nhanh lên" },
]

const getElapsedTime = (dateTime: string): string => {
    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) {
        return "Thời gian không hợp lệ";
    }

    return formatDistanceToNow(parsedDate, { addSuffix: true, locale: vi });
};

const Notification: React.FC = () => {
    return (
        <Flex direction="column">
            <Center>
                <Title order={2} p={10}>
                    Thông báo
                </Title>
            </Center>
            <Divider size={5} color="blue.2" />
            <Box px={20} py={10}>
                {notifications.map((noti, index) => (
                    <>
                        <Flex key={index} direction="column">
                            <Text lineClamp={2}>{noti.content}</Text>
                            <Text size="sm" c="gray">
                                {getElapsedTime(noti.dateTime)}
                            </Text>
                        </Flex>
                        <Divider size="xs" my={10} />
                    </>

                ))}
            </Box>
        </Flex>
    );
}
export default Notification;