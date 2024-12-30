import React from "react";

import { rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import { Transfer, TransferRequest } from "../types/customer";

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
export const formatTransferRequest = (transfer: Transfer | null): TransferRequest => {
    return {
        amount: transfer?.amount || 0,
        description: transfer?.message || "",
        isSourceFee: transfer?.senderHandlesFee || false,
        sourceAccountNumber: transfer?.senderAccount.split(" ").join("") || "",
        targetAccountNumber: transfer?.receiverAccount.split(" ").join("") || "",
        type: "internal",
    };
};

// make toast
export const makeToast = (type: "success" | "error" | "info", title: string, message: string) => {
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
        case "info":
            notifications.show({
                withBorder: true,
                radius: "md",
                color: "blue",
                title: title,
                message: message,
                position: "bottom-right",
            });
    }

    return null;
};

// map transaction type from server
export const mapTransactionType = (type: string) => {
    switch (type) {
        case "internal":
            return "Chuyển khoản nội bộ";
        case "external":
            return "Chuyển khoản liên ngân hàng";
        case "debt_payment":
            return "Thanh toán nợ";
        default:
            return "Unknown";
    }
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
