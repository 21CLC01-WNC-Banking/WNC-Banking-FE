import { Modal, Tooltip, ActionIcon, Group, Stack, Text, Divider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";

interface InfoModalProps {
    title: string;
    content: {
        label: string;
        value?: string;
        color?: string;
    }[];
}

const InfoModal: React.FC<InfoModalProps> = ({ title, content }) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={title}
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
                    {content.map((item) =>
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

            <Tooltip label="Chi tiết">
                <ActionIcon radius="md" variant="subtle" color="blue" onClick={open}>
                    <IconInfoCircle size={20} />
                </ActionIcon>
            </Tooltip>
        </>
    );
};

export default InfoModal;
