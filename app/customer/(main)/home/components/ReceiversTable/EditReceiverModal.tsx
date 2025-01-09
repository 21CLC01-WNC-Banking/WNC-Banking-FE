import { useAppDispatch } from "@/lib/hooks/withTypes";
import { renameReceiverThunk, getReceiversThunk } from "@/lib/thunks/customer/ReceiversThunks";
import { makeToast } from "@/lib/utils/customer";

import { Modal, Tooltip, ActionIcon, Button, Group, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconPencil } from "@tabler/icons-react";

interface EditModalProps {
    receiverId: number;
    receiverNickname: string;
}

const EditReceiverModal: React.FC<EditModalProps> = ({ receiverId, receiverNickname }) => {
    const dispatch = useAppDispatch();
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            nickname: receiverNickname,
        },
        validate: {
            nickname: (value) => (value.trim().length < 1 ? "Vui lòng nhập tên gợi nhớ" : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await dispatch(
                renameReceiverThunk({ id: receiverId, newNickname: values.nickname })
            ).unwrap();

            await dispatch(getReceiversThunk()).unwrap();

            makeToast(
                "success",
                "Chỉnh sửa thông tin người nhận thành công",
                "Bạn có thể kiểm tra lại danh sách người nhận đã lưu tại Trang chủ."
            );
        } catch (error) {
            makeToast("error", "Chỉnh sửa thông tin người nhận thất bại", (error as Error).message);
        }

        handleModalClose();
    };

    const handleModalClose = () => {
        close();
        form.reset();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={handleModalClose}
                title="Chỉnh sửa thông tin người nhận"
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
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        size="md"
                        radius="md"
                        label="Tên gợi nhớ"
                        placeholder="Tên gợi nhớ"
                        withAsterisk
                        maxLength={100}
                        key={form.key("nickname")}
                        {...form.getInputProps("nickname")}
                    />
                    <Group mt="lg" justify="flex-end">
                        <Button radius="md" onClick={handleModalClose} variant="default">
                            Hủy
                        </Button>

                        <Button radius="md" type="submit" variant="filled">
                            Lưu
                        </Button>
                    </Group>
                </form>
            </Modal>

            <Tooltip label="Chỉnh sửa" onClick={open}>
                <ActionIcon maw="md" radius="md" variant="subtle" color="gray">
                    <IconPencil size={20} />
                </ActionIcon>
            </Tooltip>
        </>
    );
};

export default EditReceiverModal;
