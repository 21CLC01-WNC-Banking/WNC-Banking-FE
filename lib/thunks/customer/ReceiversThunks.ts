import { createAppAsyncThunk } from "../../hooks/withTypes";
import { resetFilter, setReceivers } from "../../slices/customer/ReceiversSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getReceiversThunk = createAppAsyncThunk(
    "receivers/get-all",
    async (_, { dispatch }) => {
        const response = await fetch(`${apiUrl}/customer/saved-receiver/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();

        dispatch(setReceivers(responseData.data || []));
        resetFilter();
    }
);

export const addReceiverThunk = createAppAsyncThunk(
    "transfer/add-receiver",
    async (data: { receiverAccountNumber: string; receiverNickname: string; bankId: number }) => {
        const response = await fetch(`${apiUrl}/customer/saved-receiver/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ ...data, bankId: data.bankId === 0 ? null : data.bankId }),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }
    }
);

export const renameReceiverThunk = createAppAsyncThunk(
    "transfer/add-internal-receiver",
    async (data: { id: number; newNickname: string }) => {
        const response = await fetch(`${apiUrl}/customer/saved-receiver/${data.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ newNickname: data.newNickname }),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }
    }
);

export const deleteReceiverThunk = createAppAsyncThunk(
    "transfer/add-internal-receiver",
    async (data: { id: number }) => {
        const response = await fetch(`${apiUrl}/customer/saved-receiver/${data.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }
    }
);
