"use client";

import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, Group, Flex, Avatar, Text } from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react';
import EmployeePortal from './EmployeePortal';


const EmployeePortalShortcut: React.FC = () => {

    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Group>
            <Flex align="center" justify="space-between" gap="xl" bg="white" px={20} py={10} style={{ borderRadius: '50px' }}>
                <Group gap="xs">
                    <Avatar src="/employee_avatar.jpg" alt='Employee avatar' size="lg" />
                    <Flex direction="column">
                        <Text><strong>Kim Mẫn Đình</strong></Text>
                        <Text>Mã số: <strong>2001</strong></Text>
                    </Flex>
                </Group>
                <Button variant='subtle' p={5} radius="xl" onClick={open}>
                    <IconMenu2 size={25} color='black' />
                </Button>
            </Flex>
            <Drawer opened={opened} onClose={close} withCloseButton={false} position="right" padding={0}>
                <EmployeePortal />
            </Drawer>
        </Group>
    );
}
export default EmployeePortalShortcut;