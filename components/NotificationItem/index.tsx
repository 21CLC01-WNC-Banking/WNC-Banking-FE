"use client";

import { useState, useRef } from "react";

import {
    formatDateString,
    formatCurrency,
    mapColor,
    mapTransactionType,
    formatAccountNumber,
    makeToast,
} from "@/lib/utils/customer";
import { useAppDispatch } from "@/lib/hooks/withTypes";
import { getTransactionThunk } from "@/lib/thunks/customer/TransactionsThunk";
import { AppDispatch } from "@/lib/store";
import { Transaction } from "@/lib/types/customer";
import {
    setSeenNotificationThunk,
    getNotificationsThunk,
} from "@/lib/thunks/customer/NotificationsThunk";

import { Text, Group, Paper } from "@mantine/core";

import InfoModal from "@/components/InfoModal";

import classes from "./NotificationItem.module.css";

const fetchTransaction = async (transactionId: number, dispatch: AppDispatch) => {
    try {
        const transaction = await dispatch(
            getTransactionThunk({ transactionId: transactionId })
        ).unwrap();

        return transaction;
    } catch (error) {
        makeToast("error", "Truy vấn thông tin giao dịch thất bại", (error as Error).message);
    }
};

const makeNotificationDetailModalContent = (transaction: Transaction) => {
    return {
        title: "Chi tiết thông báo",
        content: [
            { label: "Mã giao dịch", value: transaction.id },
            { label: "Thời gian", value: formatDateString(transaction.createdAt) },
            {
                label: "Loại giao dịch",
                value: mapTransactionType(transaction.type, transaction.amount),
                color: mapColor(transaction.type),
            },
            {
                label: "Tài khoản nguồn",
                value: formatAccountNumber(transaction.sourceAccountNumber),
            },
            {
                label: "Tài khoản thụ hưởng",
                value: formatAccountNumber(transaction.targetAccountNumber),
            },
            { label: "Số tiền giao dịch", value: formatCurrency(transaction.amount) },
            { label: "Nội dung", value: transaction.description },
            { label: "Số dư sau giao dịch", value: formatCurrency(transaction.balance) },
        ],
    };
};

interface Notification {
    id: number;
    title: string;
    content: string;
    time: string;
    read: boolean;
    transactionId: number;
}

const NotificationItem: React.FC<Notification> = ({
    id,
    title,
    content,
    time,
    read,
    transactionId,
}) => {
    const dispatch = useAppDispatch();
    const [transaction, setTransaction] = useState<Transaction | null>();
    const dummyInfoModalContent = { title: "", content: [] };
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleClick = async () => {
        if (!read) {
            // mark the notification as read
            try {
                await dispatch(setSeenNotificationThunk({ id: id })).unwrap();
                await dispatch(getNotificationsThunk()).unwrap();
            } catch (error) {
                makeToast(
                    "error",
                    "Truy vấn chi tiết thông báo thất bại",
                    (error as Error).message
                );
            }
        }

        // fetch the transaction to inject into the info modal
        if (!transaction) {
            const data = await fetchTransaction(transactionId, dispatch);
            setTransaction(data);
        }

        // trigger the info modal
        triggerRef.current?.click();
    };

    return (
        <Paper my={8} className={read ? classes.notifRead : classes.notif} onClick={handleClick}>
            <div style={{ width: "100%" }}>
                <Text fw={500} mb={7} lh={1}>
                    {title}
                </Text>

                <Group grow justify="space-between" preventGrowOverflow={false}>
                    <Text fz="sm">{content}</Text>

                    {transaction ? (
                        <InfoModal
                            {...makeNotificationDetailModalContent(transaction)}
                            triggerRef={triggerRef}
                        />
                    ) : (
                        <InfoModal {...dummyInfoModalContent} triggerRef={triggerRef} />
                    )}
                </Group>

                <Group justify="flex-end">
                    <Text fz="xs" c="dimmed">
                        {time}
                    </Text>
                </Group>
            </div>
        </Paper>
    );
};

export default NotificationItem;
