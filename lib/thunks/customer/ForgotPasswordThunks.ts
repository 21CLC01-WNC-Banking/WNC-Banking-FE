import { createAppAsyncThunk } from "../../hooks/withTypes";
import {
    setForgotPasswordEmail,
    setForgotPasswordOtp,
    resetForgotPassword,
} from "../../slices/customer/ForgotPasswordSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const forgotPasswordEmailThunk = createAppAsyncThunk(
    "auth/forgot-password-email",
    async (data: { email: string }, { dispatch }) => {
        const response = await fetch(`${apiUrl}/auth/forgot-password/otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        dispatch(setForgotPasswordEmail(data.email));
    }
);

export const forgotPasswordOtpThunk = createAppAsyncThunk(
    "auth/forgot-password-otp",
    async (data: { otp: string }, { dispatch }) => {
        const response = await fetch(`${apiUrl}/auth/forgot-password/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        dispatch(setForgotPasswordOtp(data.otp));
    }
);

export const forgotPasswordThunk = createAppAsyncThunk(
    "auth/forgot-password",
    async (data: object, { dispatch }) => {
        const response = await fetch(`${apiUrl}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        dispatch(resetForgotPassword());
    }
);
