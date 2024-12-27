import { createAppAsyncThunk } from "../../hooks/withTypes";
import { setCustomerAccount } from "../../slices/AuthSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

    dispatch(setCustomerAccount(account));
});
