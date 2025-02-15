import { TransferRequest } from "@/lib/types/customer";
import { createAppAsyncThunk } from "../../hooks/withTypes";
import { setCurrentTransferId } from "../../slices/customer/TransferSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const transferFeeThunk = createAppAsyncThunk(
    "transfer/transfer-fee",
    async (data: { amount: number }) => {
        const response = await fetch(`${apiUrl}/core/estimate-transfer-fee?amount=${data.amount}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();

        return responseData.data;
    }
);

export const internalPreTransferThunk = createAppAsyncThunk(
    "transfer/internal-pre-transfer",
    async (data: TransferRequest, { dispatch }) => {
        const response = await fetch(`${apiUrl}/transaction/pre-internal-transfer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();

        dispatch(setCurrentTransferId(responseData.data));
    }
);

export const preDebtTransferThunk = createAppAsyncThunk(
    "transfer/pre-debt-transfer",
    async (data: { transactionId: string }) => {
        const response = await fetch(`${apiUrl}/transaction/pre-debt-transfer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }
    }
);

export const internalTransferThunk = createAppAsyncThunk(
    "transfer/internal-transfer",
    async (data: { transactionId: string; otp: string }) => {
        const response = await fetch(`${apiUrl}/transaction/internal-transfer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }
    }
);

export const externalPreTransferThunk = createAppAsyncThunk(
    "transfer/external-pre-transfer",
    async (data: TransferRequest, { dispatch }) => {
        const response = await fetch(`${apiUrl}/transaction/pre-external-transfer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();

        dispatch(setCurrentTransferId(responseData.data));
    }
);

export const externalTransferThunk = createAppAsyncThunk(
    "transfer/external-transfer",
    async (data: { transactionId: string; otp: string }) => {
        const response = await fetch(`${apiUrl}/transaction/external-transfer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }
    }
);
