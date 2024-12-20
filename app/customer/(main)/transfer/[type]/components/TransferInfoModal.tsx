import { useAppSelector } from "@/lib/hooks";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";

interface TransferInfoModal {
    isOpen: boolean;
    onClose: () => void;
}

const TransferInfoModal: React.FC<TransferInfoModal> = ({ isOpen, onClose }) => {
    const transfer = useAppSelector((state) => state.transfer.currentTransfer);

    const formatWithThousandSeparator = (x: number) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            radius="md"
            title="Kiểm tra thông tin chuyển khoản"
            centered
            styles={{
                title: {
                    fontWeight: 700,
                    fontSize: "var(--mantine-font-size-lg)",
                },
                content: {
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 10,
                },
            }}
        >
            <Stack my={20} gap="md">
                <Group grow justify="between">
                    <Text variant="text">Tài khoản nguồn</Text>
                    <Text fw={700}>Mặc định</Text>
                </Group>

                <Group grow justify="between">
                    <Text variant="text">Nguời nhận</Text>
                    <Text fw={700}>{transfer.receiverAccount} </Text>
                </Group>

                <Group grow justify="between">
                    <Text variant="text">Số tiền</Text>
                    <Text fw={700}>{formatWithThousandSeparator(transfer.amount)} VND </Text>
                </Group>

                <Group grow justify="between">
                    <Text variant="text">Diễn giải</Text>
                    <Text fw={700}>{transfer.message} </Text>
                </Group>

                <Group grow justify="between">
                    <Text variant="text">Phí giao dịch</Text>
                    <Text fw={700}>0 VND </Text>
                </Group>

                <Group grow justify="between">
                    <Text fw={600}>Tổng số tiền</Text>
                    <Text fw={700} c="blue">
                        {formatWithThousandSeparator(transfer.amount)} VND{" "}
                    </Text>
                </Group>

                <Button
                    fullWidth
                    onClick={() => {
                        const submitButton = document.getElementById("submit-form");

                        submitButton?.click();
                        onClose();
                    }}
                    mt="md"
                    radius="md"
                >
                    Xác nhận
                </Button>
            </Stack>
        </Modal>
    );
};

export default TransferInfoModal;
