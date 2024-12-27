import { createAppAsyncThunk } from "../../hooks/withTypes";
import { setReceivers } from "../../slices/customer/ReceiversSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getReceiversThunk = createAppAsyncThunk("receivers/get", async (_, { dispatch }) => {
    const response = await fetch(`${apiUrl}/saved-receiver/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
    }

    const responseData = await response.json();

    dispatch(setReceivers(responseData.data));
});

export const addInternalReceiverThunk = createAppAsyncThunk(
    "transfer/add-internal-receiver",
    async (data: { receiverAccountNumber: string; receiverNickname: string }) => {
        const response = await fetch(`${apiUrl}/saved-receiver/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ ...data, bankId: 0 }),
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
        const response = await fetch(`${apiUrl}/saved-receiver/${data.id}`, {
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
        const response = await fetch(`${apiUrl}/saved-receiver/${data.id}`, {
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
