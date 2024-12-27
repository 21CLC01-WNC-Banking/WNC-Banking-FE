"use client";

import { Button, Group, Modal, Stack, Text, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { formatCurrency, formatTransferRequest } from "@/lib/utils/customer";
import { internalPreTransferThunk } from "@/lib/thunks/customer/TransferThunks";

interface TransferInfoModal {
    isOpen: boolean;
    onClose: () => void;
    handleNextStep: () => void;
    confirmToggle: () => void;
}

const TransferInfoModal: React.FC<TransferInfoModal> = ({
    isOpen,
    onClose,
    handleNextStep,
    confirmToggle,
}) => {
    const dispatch = useAppDispatch();
    const transfer = useAppSelector((state) => state.transfer.currentTransfer);

    const content = [
        { label: "Tài khoản nguồn", value: [transfer?.senderAccount, transfer?.senderName] },
        { label: "Nguời nhận", value: [transfer?.receiverAccount, transfer?.receiverName] },
        { label: "Số tiền", value: [formatCurrency(transfer ? transfer.amount : 0)] },
        { label: "Diễn giải", value: [transfer?.message] },
        {
            label: "Phí giao dịch",
            value: [
                formatCurrency(transfer ? transfer.transferFee : 0),
                transfer?.senderHandlesFee ? "" : "(người nhận trả phí)",
            ],
        },
    ];

    const handleTransferSubmit = async () => {
        try {
            onClose();
            await dispatch(internalPreTransferThunk(formatTransferRequest(transfer))).unwrap();

            handleNextStep();
        } catch (error) {
            notifications.show({
                withBorder: true,
                radius: "md",
                icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
                color: "red",
                title: "Xác nhận chuyển khoản thất bại",
                message: (error as Error).message || "Đã xảy ra lỗi kết nối với máy chủ.",
                position: "bottom-right",
            });
        }

        const submitButton = document.getElementById("submit-form");

        submitButton?.click();
        onClose();
    };

    const handleClose = () => {
        confirmToggle();
        onClose();
    };

    return (
        <Modal
            opened={isOpen}
            onClose={handleClose}
            radius="md"
            size="lg"
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
                {content.map((item) => (
                    <Group
                        key={item.label}
                        grow
                        preventGrowOverflow={false}
                        justify="between"
                        align="flex-start"
                    >
                        <Text variant="text">{item.label}</Text>

                        <Stack gap={0}>
                            {" "}
                            {item.value.map((value, index) => (
                                <Text key={index} ta="right" fw={700}>
                                    {value}
                                </Text>
                            ))}
                        </Stack>
                    </Group>
                ))}

                <Group grow preventGrowOverflow={false} justify="between" align="flex-start">
                    <Text fw={600}>Tổng số tiền</Text>
                    <Text ta="right" fw={700} fz="h3" c="blue">
                        {transfer?.senderHandlesFee
                            ? formatCurrency(transfer ? transfer.amount + transfer.transferFee : 0)
                            : formatCurrency(transfer ? transfer.amount : 0)}
                    </Text>
                </Group>

                <Button fullWidth onClick={handleTransferSubmit} mt="md" radius="md">
                    Xác nhận
                </Button>
            </Stack>
        </Modal>
    );
};

export default TransferInfoModal;
