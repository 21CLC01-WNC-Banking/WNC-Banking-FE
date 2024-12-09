"use client";

import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button, Group, Flex, Avatar, Text } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import StaffPortal from "./StaffPortal";

const StaffPortalShortcut: React.FC = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Group>
            <Flex
                align="center"
                justify="space-between"
                gap="xl"
                bg="white"
                px={20}
                py={10}
                style={{ borderRadius: "var(--mantine-radius-md)" }}
            >
                <Group gap="xs">
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
                <Button variant="subtle" p={5} radius="xl" onClick={open}>
                    <IconMenu2 size={25} color="black" />
                </Button>
            </Flex>
            <Drawer
                offset={8}
                radius="md"
                opened={opened}
                onClose={close}
                withCloseButton={false}
                position="right"
                padding={0}
            >
                <StaffPortal />
            </Drawer>
        </Group>
    );
};
export default StaffPortalShortcut;
