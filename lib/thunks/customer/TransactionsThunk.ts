import { TransferRequest } from "@/lib/types/customer";
import { createAppAsyncThunk } from "../../hooks/withTypes";
import {
    setReceivedRequests,
    setSentRequests,
    setTransactionHistory,
} from "../../slices/customer/TransactionsSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getTransactionHistoryThunk = createAppAsyncThunk(
    "transactions/get-transaction-history",
    async (_, { dispatch }) => {
        const response = await fetch(`${apiUrl}/customer/transaction`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();

        dispatch(setTransactionHistory(responseData.data));
    }
);

export const getSentRequestsThunk = createAppAsyncThunk(
    "transactions/get-sent-requests",
    async (_, { dispatch }) => {
        const response = await fetch(`${apiUrl}/transaction/sent-debt-reminder`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();

        dispatch(setSentRequests(responseData.data || []));
    }
);

export const getReceivedRequestsThunk = createAppAsyncThunk(
    "transactions/get-received-requests",
    async (_, { dispatch }) => {
        const response = await fetch(`${apiUrl}/transaction/received-debt-reminder`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();

        dispatch(setReceivedRequests(responseData.data || []));
    }
);

export const createRequestThunk = createAppAsyncThunk(
    "transactions/create-request",
    async (data: TransferRequest) => {
        const response = await fetch(`${apiUrl}/transaction/debt-reminder`, {
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

export const cancelRequestThunk = createAppAsyncThunk(
    "transactions/cancel-request",
    async (data: { requestId: string; content: string }) => {
        const response = await fetch(
            `${apiUrl}/transaction/cancel-debt-reminder/${data.requestId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content: data.content }),
            }
        );

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }
    }
);
