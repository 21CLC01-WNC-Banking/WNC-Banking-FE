"use client";

import Link from "next/link";

import { Modal, Tooltip, ActionIcon, Group, Stack, Text, Divider, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import React from "react";

export interface InfoModalProps {
    title?: string;
    content?: {
        label: string;
        values?: string[];
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
                <Stack mt={20} gap="md">
                    {content &&
                        content.map((item) =>
                            item.label === "divider" ? (
                                <Divider key={item.label} my="md" />
                            ) : item.label !== "action" ? (
                                <Group key={item.label} grow justify="between" align="flex-start">
                                    <Text variant="text">{item.label}</Text>

                                    {item.values &&
                                        item.values.map((value) => (
                                            <Text key={value} ta="right" fw={700} c={item.color}>
                                                {value}
                                            </Text>
                                        ))}
                                </Group>
                            ) : null
                        )}

                    {(() => {
                        const actionItem = content?.find((item) => item.label === "action");
                        return (
                            actionItem && (
                                <Group mt="lg" justify="flex-end">
                                    <Button radius="md" onClick={close} variant="default">
                                        Quay lại
                                    </Button>

                                    <Button
                                        radius="md"
                                        component={Link}
                                        href={actionItem.values?.[1] ?? "#"}
                                    >
                                        {actionItem.values?.[0] ?? "Xem chi tiết"}
                                    </Button>
                                </Group>
                            )
                        );
                    })()}
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
