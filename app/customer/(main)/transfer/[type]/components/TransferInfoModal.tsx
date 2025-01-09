"use client";

import { useSearchParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { formatCurrency, formatTransferRequest, makeToast } from "@/lib/utils/customer";
import {
    externalPreTransferThunk,
    internalPreTransferThunk,
    preDebtTransferThunk,
} from "@/lib/thunks/customer/TransferThunks";
import { setCurrentTransferId } from "@/lib/slices/customer/TransferSlice";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";

interface TransferInfoModal {
    isOpen: boolean;
    onClose: () => void;
    handleNextStep: () => void;
    confirmToggle: () => void;
    type: string;
}

const TransferInfoModal: React.FC<TransferInfoModal> = ({
    isOpen,
    onClose,
    handleNextStep,
    confirmToggle,
    type,
}) => {
    const searchParams = useSearchParams();
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

            switch (type) {
                case "internal":
                    await dispatch(
                        internalPreTransferThunk(formatTransferRequest(transfer, type))
                    ).unwrap();
                    break;
                case "external":
                    await dispatch(
                        externalPreTransferThunk(formatTransferRequest(transfer, type))
                    ).unwrap();
                    break;
                case "debt-payment":
                    const transactionId = searchParams.get("id") || "";
                    dispatch(setCurrentTransferId(transactionId));

                    await dispatch(preDebtTransferThunk({ transactionId: transactionId })).unwrap();
            }

            handleNextStep();
        } catch (error) {
            confirmToggle();
            makeToast("error", "Xác nhận chuyển khoản thất bại", (error as Error).message);
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

                <Group mt="lg" justify="flex-end">
                    <Button radius="md" onClick={handleClose} variant="default">
                        Quay lại
                    </Button>

                    <Button onClick={handleTransferSubmit} mt="md" radius="md">
                        Xác nhận
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default TransferInfoModal;
