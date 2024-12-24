import { Modal, Tooltip, ActionIcon, Button, Group, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconPencil } from "@tabler/icons-react";

interface EditModalProps {
    handleEdit?: () => void;
}

const EditReceiverModal: React.FC<EditModalProps> = ({ handleEdit }) => {
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
