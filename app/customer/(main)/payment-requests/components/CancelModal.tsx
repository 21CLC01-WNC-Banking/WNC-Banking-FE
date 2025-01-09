import { useAppDispatch } from "@/lib/hooks/withTypes";
import {
    cancelRequestThunk,
    getReceivedRequestsThunk,
    getSentRequestsThunk,
} from "@/lib/thunks/customer/TransactionsThunk";
import { makeToast } from "@/lib/utils/customer";

import { Modal, Tooltip, ActionIcon, Button, Group, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCancel } from "@tabler/icons-react";

interface CancelModalProps {
    requestId: string;
    type: "received" | "sent";
}

const CancelModal: React.FC<CancelModalProps> = ({ requestId, type }) => {
    const dispatch = useAppDispatch();

    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            message: "",
        },
        validate: {
            message: (value) =>
                value.trim().length < 1 ? "Vui lòng nhập nội dung hủy nhắc nợ" : null,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await dispatch(
                cancelRequestThunk({ requestId: requestId, content: values.message })
            ).unwrap();
            await dispatch(
                type === "received" ? getReceivedRequestsThunk() : getSentRequestsThunk()
            ).unwrap();

            makeToast(
                "error",
                "Hủy nhắc nợ thành công",
                "Bạn có thể xem chi tiết tại trang Nhắc nợ."
            );
            handleCloseModal();
        } catch (error) {
            makeToast("error", "Hủy nhắc nợ thất bại", (error as Error).message);
        }
    };

    const handleCloseModal = () => {
        close();
        form.reset();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={handleCloseModal}
                title="Hủy nhắc nợ"
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
                    <Textarea
                        size="md"
                        radius="md"
                        label="Nội dung hủy"
                        withAsterisk
                        placeholder="Đã trả trực tiếp"
                        autosize
                        maxLength={100}
                        minRows={2}
                        maxRows={4}
                        key={form.key("message")}
                        {...form.getInputProps("message")}
                    />

                    <Group mt="lg" justify="flex-end">
                        <Button radius="md" onClick={handleCloseModal} variant="default">
                            Quay lại
                        </Button>

                        <Button radius="md" type="submit" variant="filled" color="red">
                            Xác nhận hủy
                        </Button>
                    </Group>
                </form>
            </Modal>

            <Tooltip label="Hủy">
                <ActionIcon maw="md" radius="md" variant="subtle" color="red" onClick={open}>
                    <IconCancel size={20} />
                </ActionIcon>
            </Tooltip>
        </>
    );
};

export default CancelModal;
