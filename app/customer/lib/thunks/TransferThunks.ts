import { createAppAsyncThunk } from "../hooks/withTypes";
import { resetTransfer, setCurrentTransfer } from "../slices/TransferSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const internalPreTransferThunk = createAppAsyncThunk(
    "transfer/internal-pre-transfer",
    async (data: { email: string }, { dispatch }) => {
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

        console.log(responseData);

        dispatch(setCurrentTransfer(responseData.data.id));
    }
);

export const internalTransferThunk = createAppAsyncThunk(
    "transfer/internal-transfer",
    async (data: { otp: string }, { dispatch }) => {
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

        dispatch(resetTransfer());
    }
);
