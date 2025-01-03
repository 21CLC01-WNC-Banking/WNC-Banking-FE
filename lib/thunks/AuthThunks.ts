import { createAppAsyncThunk } from "@/lib/hooks/withTypes";

import { login, logout } from "@/lib/slices/AuthSlice";
import { AuthUser } from "@/lib/types/common";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const loginThunk = createAppAsyncThunk("auth/login", async (data: object, { dispatch }) => {
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const responseData = await response.json();

        let message = responseData.errors[0].message;

        if (message === "invalid password" || message === "invalid request") {
            message = "Vui lòng kiểm tra lại thông tin đăng nhập.";
        }

        if (message === "Email not found") {
            message = "Địa chỉ email này chưa được đăng kí.";
        }

        throw new Error(message || "Đã xảy ra lỗi kết nối với máy chủ.");
    }
    const responseData = await response.json();

    const newUserAccount: AuthUser = {
        name: responseData.data.name,
        role: responseData.data.role,
        userId: responseData.data.userId,
    };

    dispatch(login(newUserAccount));
});

export const logoutThunk = createAppAsyncThunk("auth/logout", async (_, { dispatch }) => {
    const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    if (!response.ok) {
        const responseData = await response.json();

        throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
    }

    dispatch(logout());
});
