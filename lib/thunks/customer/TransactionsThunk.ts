import { Transaction, TransferRequest } from "@/lib/types/customer";
import { createAppAsyncThunk } from "../../hooks/withTypes";
import {
    setReceivedRequests,
    setSentRequests,
    setTransactionHistory,
} from "../../slices/customer/TransactionsSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getTransactionHistoryThunk = createAppAsyncThunk(
    "transactions/get-history",
    async (_, { dispatch }) => {
        // calculate date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

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

        // only keep transactions that are created within 30 days
        const filteredTransactions = responseData.data.filter((transaction: Transaction) => {
            const transactionDate = new Date(transaction.createdAt);
            return transactionDate >= thirtyDaysAgo;
        });

        dispatch(setTransactionHistory(filteredTransactions));
    }
);

export const getTransactionThunk = createAppAsyncThunk(
    "transactions/get-transaction",
    async (data: { transactionId: number }) => {
        const response = await fetch(`${apiUrl}/customer/transaction/${data.transactionId}`, {
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
