"use client";

import React from "react";

import { NotificationToast, Transfer, TransferRequest, Notification } from "@/lib/types/customer";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AppDispatch } from "@/lib/store";
import {
    getReceivedRequestsThunk,
    getSentRequestsThunk,
    getTransactionHistoryThunk,
} from "@/lib/thunks/customer/TransactionsThunk";
import { getUserAccountThunk } from "@/lib/thunks/customer/AccountThunks";
import { getNotificationsThunk } from "@/lib/thunks/customer/NotificationsThunk";

import { rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

// chunk data into pages for tables
export const chunk = <T>(array: T[], size: number): T[][] => {
    if (!array.length) {
        return [];
    }

    const head = array.slice(0, size);
    const tail = array.slice(size);

    return [head, ...chunk(tail, size)];
};

// format currency
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

// format date
export const formatDateString = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(date.getUTCDate()).padStart(2, "0");

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    const formattedDateTime = `${hours}:${minutes}, ${day}/${month}/${year}`;

    return formattedDateTime;
};

// format account number
export const formatAccountNumber = (accountNumber: string): string => {
    return accountNumber
        .replace(/\s/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .trim();
};

// convert Transfer object to a valid backend request
export const formatTransferRequest = (transfer: Transfer | null, type: string): TransferRequest => {
    return {
        amount: transfer?.amount || 0,
        description: transfer?.message || "",
        isSourceFee: transfer?.senderHandlesFee || false,
        partnerBankId: transfer?.receiverBankId || 0,
        sourceAccountNumber: transfer?.senderAccount.split(" ").join("") || "",
        targetAccountNumber: transfer?.receiverAccount.split(" ").join("") || "",
        type: type,
    };
};

// make toast
export const makeToast = (type: "success" | "error", title: string, message: string) => {
    switch (type) {
        case "success":
            notifications.show({
                withBorder: true,
                radius: "md",
                icon: React.createElement(IconCheck, {
                    style: { width: rem(20), height: rem(20) },
                }),
                color: "teal",
                title: title,
                message: message,
                position: "bottom-right",
            });

            break;
        case "error":
            notifications.show({
                withBorder: true,
                radius: "md",
                icon: React.createElement(IconX, { style: { width: rem(20), height: rem(20) } }),
                color: "red",
                title: title,
                message: message || "Đã xảy ra lỗi kết nối với máy chủ.",
                position: "bottom-right",
            });

            break;
    }

    return null;
};

// map transaction type from server
export const mapTransactionType = (type: string, amount: number) => {
    let transactionType = "";

    if (amount < 0) {
        transactionType = "↑ Chuyển tiền";
    } else {
        transactionType = "↓ Nhận tiền";
    }

    if (type === "internal") {
        transactionType += " nội bộ";
    } else if (type === "external") {
        transactionType += " liên ngân hàng";
    } else if (type === "debt_payment") {
        transactionType += " thanh toán nợ";
    }

    return transactionType;
};

// map payment request status from server
export const mapRequestStatus = (type: string) => {
    switch (type) {
        case "pending":
            return "Chưa thanh toán";
        case "success":
            return "Đã thanh toán";
        case "failed":
            return "Đã hủy";
        default:
            return "Unknown";
    }
};

// return corresponding color string for transaction type or request status
export const mapColor = (type: string) => {
    switch (type) {
        case "internal":
            return "green.7";
        case "success":
            return "green.7";
        case "external":
            return "yellow.7";
        case "pending":
            return "yellow.7";
        case "debt_payment":
            return "red.7";
        case "failed":
            return "red.7";
        default:
            return "";
    }
};

// handle object received from WebSocket server and make a toast notification
export const handleNotification = async (
    notif: NotificationToast,
    router?: AppRouterInstance,
    dispatch?: AppDispatch,
    currentPath?: string
) => {
    let title = "";
    let message = "";
    let route = "";

    switch (notif.Type) {
        case "incoming_transfer":
            title = `Đã nhận ${formatCurrency(notif.Amount)} từ ${notif.Name}`;
            message = `Bạn có thể xem chi tiết giao dịch tại Trang chủ.`;
            route = "/customer/home?tab=account";

            if (dispatch && currentPath?.includes("/customer/home")) {
                await dispatch(getUserAccountThunk());
                await dispatch(getTransactionHistoryThunk());
            }

            break;
        case "outgoing_transfer":
            title = `Đã chuyển ${formatCurrency(notif.Amount)} cho ${notif.Name}`;
            message = `Bạn có thể xem chi tiết giao dịch tại Trang chủ.`;
            break;
        case "debt_reminder":
            title = `Bạn nợ ${notif.Name} ${formatCurrency(notif.Amount)}`;
            message = `Bạn có thể xem chi tiết và thanh toán nợ tại trang Nhắc nợ.`;
            route = "/customer/payment-requests?tab=received";

            if (dispatch && currentPath?.includes("/customer/payment-requests?tab=received")) {
                await dispatch(getReceivedRequestsThunk());
            }

            break;
        case "debt_cancel":
            title = `${notif.Name} đã hủy nhắc nợ`;
            message = `Bạn có thể xem chi tiết tại trang Nhắc nợ.`;
            route = "/customer/payment-requests";

            if (dispatch && currentPath?.includes("/customer/payment-requests")) {
                await dispatch(getReceivedRequestsThunk());
                await dispatch(getSentRequestsThunk());
            }

            break;
    }

    if (dispatch) {
        await dispatch(getNotificationsThunk()).unwrap();
    }

    notifications.show({
        withBorder: true,
        radius: "md",
        color: "blue",
        title: title,
        message: message,
        position: "bottom-right",
        style: route !== "" ? { cursor: "pointer" } : {},
        onClick: router && route !== "" ? () => router.push(route) : undefined,
    });
};

// map notification entity from database to props for NotificationItem component
export const mapNotification = (notif: Notification) => {
    let title = "";
    const content = JSON.parse(notif.content);
    let message = `${content.transactionId} - `;

    switch (notif.type) {
        case "incoming_transfer":
            title = `Nhận tiền vào tài khoản`;
            message += `Bạn đã nhận ${formatCurrency(content.amount)} từ ${content.name}.`;

            break;
        case "outgoing_transfer":
            title = `Chuyển tiền đến tài khoản`;
            message += `Bạn đã chuyển ${formatCurrency(content.amount)} cho ${content.name}.`;
            break;
        case "debt_reminder":
            title = `Bạn có nợ cần thanh toán`;
            message += `Bạn nợ ${content.name} ${formatCurrency(content.amount)}.`;
            break;
        case "debt_cancel":
            title = `Nhắc nợ bị hủy`;
            message += ` ${content.name} đã hủy nhắc nợ ${formatCurrency(content.amount)} của bạn.`;

            break;
    }

    return {
        id: notif.id,
        title,
        content: message,
        type: notif.type,
        time: formatDateString(notif.createdAt),
        read: notif.isSeen,
        transactionId: content.transactionId,
    };
};

export const mapNotificationType = (type: string) => {
    switch (type) {
        case "incoming_transfer":
            return "NHẬN TIỀN";
        case "outgoing_transfer":
            return "CHUYỂN TIỀN";
        case "debt_reminder":
            return "NHẮC NỢ";
        case "debt_cancel":
            return "HỦY NHẮC NỢ";
        default:
            return "";
    }
};

export const getUnseenNotificationsCount = (notifications: Notification[]): number => {
    return notifications.filter((notif) => !notif.isSeen).length;
};
