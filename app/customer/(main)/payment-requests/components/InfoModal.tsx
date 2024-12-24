import { Modal, Tooltip, ActionIcon, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";

const InfoModal = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title="Chi tiết nhắc nợ"
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
                Not yet
                <Group mt="lg" justify="flex-end">
                    <Button onClick={close} variant="default">
                        Quay lại
                    </Button>
                </Group>
            </Modal>

            <Tooltip label="Chi tiết">
                <ActionIcon variant="subtle" color="blue" onClick={open}>
                    <IconInfoCircle size={20} />
                </ActionIcon>
            </Tooltip>
        </>
    );
};

export default InfoModal;
