"use client";

import { Flex, Group, Avatar, Text, Button, Paper, Box } from "@mantine/core";
import { IconBell, IconCalendar } from "@tabler/icons-react";
import Timetable from "./Timetable";
import Notification from "./Notification";
import { useState } from "react";

const EmployeePortal: React.FC = () => {

    const [chosenTab, setChosenTab] = useState<string>("notification");

    return (
        <>
            <Paper shadow="xl" p={10}>
                <Flex justify="space-between">
                    <Group gap="md">
                        <Avatar src="/employee_avatar.jpg" alt='Employee avatar' size="lg" />
                        <Flex direction="column">
                            <Text><strong>Kim Mẫn Đình</strong></Text>
                            <Text>Mã số: <strong>2001</strong></Text>
                        </Flex>
                    </Group>
                    <Group>
                        <Button variant='subtle' p={5} radius="xl" onClick={() => setChosenTab("notification")}>
                            <IconBell size={25} color='black' />
                        </Button>
                        <Button variant='subtle' p={5} radius="xl" onClick={() => setChosenTab("timetable")}>
                            <IconCalendar size={25} color='black' />
                        </Button>
                    </Group>
                </Flex>
            </Paper>
            <Box>
                {chosenTab === "notification" ? <Notification /> : <Timetable />}
            </Box>
        </>

    );
}
export default EmployeePortal;