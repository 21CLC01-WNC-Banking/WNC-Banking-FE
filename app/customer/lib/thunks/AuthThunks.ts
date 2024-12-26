import { createAppAsyncThunk } from "../hooks/withTypes";
import { login, setAuthUser } from "../slices/AuthSlice";

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

    dispatch(login());
});

export const getAccountThunk = createAppAsyncThunk("auth/account", async (_, { dispatch }) => {
    const response = await fetch(`${apiUrl}/account/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
    }

    const data = await response.json();

    const account = {
        name: data.data.name,
        accountNumber: data.data.account.number,
        balance: data.data.account.balance,
    };

    dispatch(setAuthUser(account));
});
