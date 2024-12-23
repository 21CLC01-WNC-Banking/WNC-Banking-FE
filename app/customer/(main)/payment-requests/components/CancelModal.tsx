import { Modal, Tooltip, ActionIcon, Button, Group, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCancel } from "@tabler/icons-react";

interface CancelModalProps {
    handleCancel?: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ handleCancel }) => {
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

    const handleSubmit = (values: typeof form.values) => {
        console.log(values);
        close();
        form.reset();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
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
                        minRows={2}
                        maxRows={4}
                        key={form.key("message")}
                        {...form.getInputProps("message")}
                    />

                    <Group mt="lg" justify="flex-end">
                        <Button onClick={close} variant="default">
                            Quay lại
                        </Button>

                        <Button type="submit" variant="filled" color="red">
                            Xác nhận hủy
                        </Button>
                    </Group>
                </form>
            </Modal>

            <Tooltip label="Hủy">
                <ActionIcon variant="subtle" color="red" onClick={open}>
                    <IconCancel size={20} />
                </ActionIcon>
            </Tooltip>
        </>
    );
};

export default CancelModal;
