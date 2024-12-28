import React from "react";

import { rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import { Transfer, TransferRequest } from "../types/customer";

// helper function to chunk data into pages
export function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) {
        return [];
    }

    const head = array.slice(0, size);
    const tail = array.slice(size);

    return [head, ...chunk(tail, size)];
}

// helper function to format currency
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

// helper function to format date
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

// helper function to format account number
export function formatAccountNumber(accountNumber: string): string {
    return accountNumber.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

// helper function to convert Transfer object to a valid backend request
export function formatTransferRequest(transfer: Transfer | null): TransferRequest {
    return {
        amount: transfer?.amount || 0,
        description: transfer?.message || "",
        isSourceFee: transfer?.senderHandlesFee || false,
        sourceAccountNumber: transfer?.senderAccount.split(" ").join("") || "",
        targetAccountNumber: transfer?.receiverAccount.split(" ").join("") || "",
        type: "internal",
    };
}

// helper function to toast
export function makeToast(type: "success" | "error", title: string, message: string) {
    if (type === "success") {
        notifications.show({
            withBorder: true,
            radius: "md",
            icon: React.createElement(IconCheck, { style: { width: rem(20), height: rem(20) } }),
            color: "teal",
            title: title,
            message: message,
            position: "bottom-right",
        });
    } else {
        notifications.show({
            withBorder: true,
            radius: "md",
            icon: React.createElement(IconX, { style: { width: rem(20), height: rem(20) } }),
            color: "red",
            title: title,
            message: message || "Đã xảy ra lỗi kết nối với máy chủ.",
            position: "bottom-right",
        });
    }

    return null;
}
