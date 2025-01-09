"use client";

import { useState, useRef } from "react";

import {
    formatDateString,
    formatCurrency,
    mapColor,
    mapTransactionType,
    formatAccountNumber,
    makeToast,
    mapNotificationType,
} from "@/lib/utils/customer";
import { useAppDispatch } from "@/lib/hooks/withTypes";
import {
    getPaymentRequestReplyThunk,
    getTransactionThunk,
} from "@/lib/thunks/customer/TransactionsThunk";
import { AppDispatch } from "@/lib/store";
import { DebtCancelReply, Transaction } from "@/lib/types/customer";
import {
    setSeenNotificationThunk,
    getNotificationsThunk,
} from "@/lib/thunks/customer/NotificationsThunk";

import { Text, Group, Paper } from "@mantine/core";

import InfoModal, { InfoModalProps } from "@/components/InfoModal";

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

const fetchDebtCancelReply = async (transactionId: number, dispatch: AppDispatch) => {
    try {
        const reply = await dispatch(
            getPaymentRequestReplyThunk({ debtReminderId: transactionId })
        ).unwrap();

        return reply;
    } catch (error) {
        makeToast("error", "Truy vấn thông tin giao dịch thất bại", (error as Error).message);
    }
};

const makeNotificationDetailModalContent = (
    transaction: Transaction,
    type: string,
    reply?: DebtCancelReply | null
): InfoModalProps => {
    const actionUrl =
        type === "debt_reminder"
            ? "/customer/payment-requests?tab=received"
            : type === "debt_cancel"
            ? "/customer/payment-requests"
            : "/customer/home?tab=account";
    const actionLabel = type.includes("debt") ? "Đến trang Nhắc nợ" : "Đến trang Giao dịch";

    return {
        title: `Thông báo ${mapNotificationType(type)}`,
        content: [
            { label: "Mã giao dịch", values: [transaction.id] },
            { label: "Thời gian", values: [formatDateString(transaction.createdAt)] },
            {
                label: "Loại giao dịch",
                values: [mapTransactionType(transaction.type, transaction.amount)],
                color: mapColor(transaction.type),
            },
            {
                label: "Tài khoản nguồn",
                values: [formatAccountNumber(transaction.sourceAccountNumber)],
            },
            {
                label: "Tài khoản thụ hưởng",
                values: [formatAccountNumber(transaction.targetAccountNumber)],
            },
            {
                label: `Số tiền ${
                    type === "debt_reminder" || type === "debt_cancel" ? "nợ" : "giao dịch"
                }`,
                values: [formatCurrency(transaction.amount)],
            },
            { label: "Nội dung", values: [transaction.description] },
            ...(type !== "debt_cancel" && type !== "debt_reminder"
                ? [
                      {
                          label: "Số dư sau giao dịch",
                          values: [formatCurrency(transaction.balance)],
                      },
                  ]
                : []),
            ...(reply
                ? [
                      { label: "divider" },
                      { label: "Người hủy", values: [reply.userReplyName] },
                      { label: "Nội dung hủy", values: [reply.content] },
                      { label: "Thời gian hủy", values: [formatDateString(reply.updatedAt)] },
                  ]
                : []),
            { label: "action", values: [actionLabel, actionUrl] },
        ],
    };
};

interface NotificationItemProps {
    id: number;
    title: string;
    content: string;
    time: string;
    type: string;
    read: boolean;
    transactionId: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    id,
    title,
    content,
    time,
    type,
    read,
    transactionId,
}) => {
    const dispatch = useAppDispatch();
    const [transaction, setTransaction] = useState<Transaction | null>();
    const [debtCancelReply, setDebtCancelReply] = useState(null);
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

        // if the notification is a debt cancel, fetch the reply to inject into the info modal
        if (type === "debt_cancel" && debtCancelReply === null) {
            const replyData = await fetchDebtCancelReply(transactionId, dispatch);
            setDebtCancelReply(replyData);
        } else if (type !== "debt_cancel") {
            setDebtCancelReply(null);
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
                            {...makeNotificationDetailModalContent(
                                transaction,
                                type,
                                debtCancelReply
                            )}
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
