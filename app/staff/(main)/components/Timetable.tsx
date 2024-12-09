import { Divider, Flex, Title, Box, Text } from "@mantine/core";

const timeTableData = [
    {
        date: "08/12/2024",
        tasks: [
            { time: "09:15 AM", content: "Code giao diện WNC" },
            { time: "10:30 AM", content: "Họp nhóm phát triển dự án" },
        ],
    },
    {
        date: "07/12/2024",
        tasks: [
            { time: "01:00 PM", content: "Review tài liệu thiết kế" },
            { time: "03:45 PM", content: "Gửi etasks cho khách hàng" },
        ],
    },
    {
        date: "06/12/2024",
        tasks: [
            { time: "08:00 AM", content: "Họp team về chiến lược marketing" },
            { time: "11:15 AM", content: "Thảo luận về yêu cầu dự án mới" },
        ],
    },
    {
        date: "05/12/2024",
        tasks: [{ time: "09:30 AM", content: "Chuẩn bị tài liệu cho buổi họp đối tác" }],
    },
];

const Timetable: React.FC = () => {
    // Hàm để kiểm tra xem ngày có phải là hôm nay không
    const getDateLabel = (date: string): string => {
        const today = new Date().toLocaleDateString("en-GB");
        return date === today ? "Hôm nay" : date;
    };

    return (
        <Box p={24}>
            {timeTableData.map((group, index) => (
                <Box key={index}>
                    <Title order={4} mb={15}>
                        {getDateLabel(group.date)}
                    </Title>

                    {/* Danh sách mail trong ngày */}
                    {group.tasks.map((task, index) => (
                        <>
                            <Flex key={index} gap="md" align="center" my={5}>
                                <Text c="gray">{task.time}</Text>
                                <Text>{task.content}</Text>
                            </Flex>
                            <Divider size="xs" my={10} />
                        </>
                    ))}
                </Box>
            ))}
        </Box>
    );
};
export default Timetable;
