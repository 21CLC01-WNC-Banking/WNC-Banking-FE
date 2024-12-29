"use client";

import { useAppDispatch } from "@/lib/hooks/withTypes";
import { deleteReceiverThunk, getReceiversThunk } from "@/lib/thunks/customer/ReceiversThunks";

import { Modal, Tooltip, ActionIcon, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { makeToast } from "@/lib/utils/customer";

interface DeleteModalProps {
    receiverId: number;
}

const DeleteReceiverModal: React.FC<DeleteModalProps> = ({ receiverId }) => {
    const dispatch = useAppDispatch();
    const [opened, { open, close }] = useDisclosure(false);

    const handleDelete = async () => {
        try {
            await dispatch(deleteReceiverThunk({ id: receiverId })).unwrap();
            await dispatch(getReceiversThunk()).unwrap();

            makeToast(
                "success",
                "Xóa người nhận thành công",
                "Bạn có thể kiểm tra lại danh sách người nhận đã lưu tại Trang chủ."
            );
        } catch (error) {
            makeToast("error", "Xóa người nhận thất bại", (error as Error).message);
        }

        close();
    };

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
                    <Button radius="md" onClick={close} variant="default">
                        Quay lại
                    </Button>

                    <Button radius="md" onClick={handleDelete} variant="filled" color="red">
                        Xóa
                    </Button>
                </Group>
            </Modal>

            <Tooltip label="Xóa">
                <ActionIcon radius="md" variant="subtle" color="red" onClick={open}>
                    <IconTrash size={20} />
                </ActionIcon>
            </Tooltip>
        </>
    );
};

export default DeleteReceiverModal;
