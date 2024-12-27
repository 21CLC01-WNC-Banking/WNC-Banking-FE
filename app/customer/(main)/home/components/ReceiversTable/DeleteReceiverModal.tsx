"use client";

import { useAppDispatch } from "@/lib/hooks/withTypes";
import { deleteReceiverThunk, getReceiversThunk } from "@/lib/thunks/customer/ReceiversThunks";

import { Modal, Tooltip, ActionIcon, Button, Group, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash, IconX, IconCheck } from "@tabler/icons-react";

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

            notifications.show({
                withBorder: true,
                radius: "md",
                icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
                color: "teal",
                title: "Xóa người nhận thành công",
                message: "Bạn có thể kiểm tra lại danh sách người nhận đã lưu tại Trang chủ.",
                position: "bottom-right",
            });
        } catch (error) {
            notifications.show({
                withBorder: true,
                radius: "md",
                icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
                color: "red",
                title: "Xóa người nhận thất bại",
                message: (error as Error).message || "Đã xảy ra lỗi kết nối với máy chủ.",
                position: "bottom-right",
            });
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
                    <Button onClick={close} variant="default">
                        Quay lại
                    </Button>

                    <Button onClick={handleDelete} variant="filled" color="red">
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
