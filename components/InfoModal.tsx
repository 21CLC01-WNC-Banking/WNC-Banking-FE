import { Modal, Tooltip, ActionIcon, Group, Stack, Text, Divider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import React from "react";

interface InfoModalProps {
    title?: string;
    content?: {
        label: string;
        value?: string;
        color?: string;
    }[];
    triggerRef?: React.RefObject<HTMLButtonElement>;
}

const InfoModal: React.FC<InfoModalProps> = ({ title, content, triggerRef }) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={title}
                size="lg"
                radius="md"
                centered
                styles={{
                    title: {
                        fontWeight: 700,
                        fontSize: "var(--mantine-font-size-lg)",
                    },
                    content: {
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                    },
                }}
            >
                <Stack my={20} gap="md">
                    {content &&
                        content.map((item) =>
                            item.label === "divider" ? (
                                <Divider key={item.label} my="md" />
                            ) : (
                                <Group key={item.label} grow justify="between" align="flex-start">
                                    <Text variant="text">{item.label}</Text>

                                    <Text ta="right" fw={700} c={item.color}>
                                        {item.value}
                                    </Text>
                                </Group>
                            )
                        )}
                </Stack>
            </Modal>

            <Tooltip label="Chi tiết" disabled={triggerRef ? true : false}>
                <ActionIcon
                    maw="md"
                    size={triggerRef ? 0 : "md"}
                    radius="md"
                    variant="subtle"
                    color="blue"
                    id="info-modal-trigger"
                    onClick={open}
                    ref={opened ? undefined : triggerRef}
                >
                    {triggerRef ? null : <IconInfoCircle size={20} />}
                </ActionIcon>
            </Tooltip>
        </>
    );
};

export default InfoModal;
