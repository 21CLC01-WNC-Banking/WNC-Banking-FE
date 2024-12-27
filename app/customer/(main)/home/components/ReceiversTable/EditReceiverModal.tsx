import { useAppDispatch } from "@/lib/hooks/withTypes";
import { renameReceiverThunk, getReceiversThunk } from "@/lib/thunks/customer/ReceiversThunks";

import { Modal, Tooltip, ActionIcon, Button, Group, TextInput, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPencil, IconX, IconCheck } from "@tabler/icons-react";

interface EditModalProps {
    receiverId: number;
}

const EditReceiverModal: React.FC<EditModalProps> = ({ receiverId }) => {
    const dispatch = useAppDispatch();
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            nickname: "",
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

            notifications.show({
                withBorder: true,
                radius: "md",
                icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
                color: "teal",
                title: "Chỉnh sửa thông tin người nhận thành công",
                message: "Bạn có thể kiểm tra lại danh sách người nhận đã lưu tại Trang chủ.",
                position: "bottom-right",
            });
        } catch (error) {
            notifications.show({
                withBorder: true,
                radius: "md",
                icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
                color: "red",
                title: "Chỉnh sửa thông tin người nhận thất bại",
                message: (error as Error).message || "Đã xảy ra lỗi kết nối với máy chủ.",
                position: "bottom-right",
            });
        }

        close();

        form.reset();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
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
                        key={form.key("nickname")}
                        {...form.getInputProps("nickname")}
                    />
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={close} variant="default">
                            Hủy
                        </Button>

                        <Button type="submit" variant="filled">
                            Lưu
                        </Button>
                    </Group>
                </form>
            </Modal>

            <Tooltip label="Chỉnh sửa" onClick={open}>
                <ActionIcon variant="subtle" color="gray">
                    <IconPencil size={20} />
                </ActionIcon>
            </Tooltip>
        </>
    );
};

export default EditReceiverModal;
