import { Employee } from "@/lib/types/staff";
import { Button, Group, Text, Center, Modal } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const ConfirmDeleteDialog = ({
    onConfirm,
    onCancel,
    opened,
    employee,
}: {
    onConfirm: () => void;
    onCancel: () => void;
    opened: boolean;
    employee: Employee | null;
}) => {
    return (
        <Modal
            opened={opened}
            onClose={onCancel}
            size="lg"
            radius="md"
            withCloseButton={false}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Center mb="md">
                <IconAlertCircle size={40} color="red" />
            </Center>
            <Center>
                <Text size="lg" fw={500} c="red" mb="md">
                    Bạn có chắc chắn muốn xóa nhân viên &apos;{employee?.name}&apos; không?
                </Text>
            </Center>
            <Group justify="center">
                <Button color="red" onClick={onConfirm}>
                    Xóa
                </Button>
                <Button variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
            </Group>
        </Modal>
    );
};

export default ConfirmDeleteDialog;
