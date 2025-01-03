import { createAppAsyncThunk } from "../hooks/withTypes";
import { login } from "../slices/AuthSlice";
import { UserAccount } from "../types/customer";

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
    const newUserAccount: UserAccount = {
        name: responseData.data.name,
        role: responseData.data.role,
        userId: responseData.data.userId
    }
    dispatch(login(newUserAccount));
});
