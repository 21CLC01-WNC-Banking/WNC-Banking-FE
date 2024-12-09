import { Flex, Group, Avatar, Text, Button, Paper, Box, Tooltip } from "@mantine/core";
import { IconBell, IconCalendar } from "@tabler/icons-react";
import Timetable from "./Timetable";
import Notification from "./Notification";
import { useState } from "react";

const StaffPortal: React.FC = () => {
    const [chosenTab, setChosenTab] = useState<string>("notification");

    return (
        <>
            <Paper withBorder radius={0} p={10}>
                <Flex justify="space-between">
                    <Group gap="md">
                        <Avatar src="/staff_avatar.jpg" alt="Staff avatar" size="lg" />
                        <Flex direction="column">
                            <Text>
                                <strong>Kim Mẫn Đình</strong>
                            </Text>
                            <Text>
                                Mã số: <strong>2001</strong>
                            </Text>
                        </Flex>
                    </Group>
                    <Group>
                        <Tooltip label="Thông báo">
                            <Button
                                variant="subtle"
                                p={5}
                                radius="xl"
                                onClick={() => setChosenTab("notification")}
                            >
                                <IconBell
                                    size={25}
                                    color={
                                        chosenTab === "notification"
                                            ? "var(--mantine-color-blue-filled)"
                                            : "black"
                                    }
                                />
                            </Button>
                        </Tooltip>

                        <Tooltip label="Lịch làm việc">
                            <Button
                                variant="subtle"
                                p={5}
                                radius="xl"
                                onClick={() => setChosenTab("timetable")}
                            >
                                <IconCalendar
                                    size={25}
                                    color={
                                        chosenTab === "timetable"
                                            ? "var(--mantine-color-blue-filled)"
                                            : "black"
                                    }
                                />
                            </Button>
                        </Tooltip>
                    </Group>
                </Flex>
            </Paper>
            <Box>{chosenTab === "notification" ? <Notification /> : <Timetable />}</Box>
        </>
    );
};
export default StaffPortal;
