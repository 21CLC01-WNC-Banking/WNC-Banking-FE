import { Modal, Tooltip, ActionIcon, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";

interface DeleteModalProps {
    handleDelete?: () => void;
}

const DeleteReceiverModal: React.FC<DeleteModalProps> = ({ handleDelete }) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title="Xóa người nhận"
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
                Bạn có chắc muốn xóa người nhận này?
                <Group mt="lg" justify="flex-end">
                    <Button onClick={close} variant="default">
                        Quay lại
                    </Button>

                    <Button onClick={close} variant="filled" color="red">
                        Xóa
                    </Button>
                </Group>
            </Modal>

            <Tooltip label="Xóa">
                <ActionIcon variant="subtle" color="red" onClick={open}>
                    <IconTrash size={20} />
                </ActionIcon>
            </Tooltip>
        </>
    );
};

export default DeleteReceiverModal;
