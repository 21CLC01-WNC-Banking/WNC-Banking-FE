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
        console.log(data);

        const response = await fetch(`${apiUrl}/transaction/pre-internal-transfer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();

        console.log(responseData.data);
        dispatch(setCurrentTransferId(responseData.data));
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
