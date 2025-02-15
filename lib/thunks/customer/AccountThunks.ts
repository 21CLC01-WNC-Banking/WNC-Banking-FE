import { createAppAsyncThunk } from "@/lib/hooks/withTypes";
import { logout } from "@/lib/slices/AuthSlice";
import { setCustomerAccount } from "@/lib/slices/customer/AccountSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getUserAccountThunk = createAppAsyncThunk(
    "account/user-info",
    async (_, { dispatch }) => {
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
    }
);

export const getInternalAccountOwnerThunk = createAppAsyncThunk(
    "account/get-internal-name",
    async (data: { accountNumber: string }) => {
        const deformatted = data.accountNumber.split(" ").join("");

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/account/customer-name?accountNumber=${deformatted}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }
        );

        if (!response.ok) {
            const responseData = await response.json();
            let message = responseData.errors[0].message;

            if (message.includes("no rows")) {
                message = "Không tìm thấy người nhận. Vui lòng kiểm tra lại số tài khoản.";
            }

            throw new Error(message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();
        return responseData.data.name;
    }
);

export const getExternalAccountOwnerThunk = createAppAsyncThunk(
    "account/get-external-name",
    async (data: { accountNumber: string; bankId: number }) => {
        const deformatted = data.accountNumber.split(" ").join("");

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/account/get-external-account-name`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ accountNumber: deformatted, bankId: data.bankId }),
            }
        );

        if (!response.ok) {
            const responseData = await response.json();
            let message = responseData.errors[0].message;

            if (message.includes("no rows")) {
                message = "Không tìm thấy người nhận. Vui lòng kiểm tra lại số tài khoản.";
            }

            throw new Error(message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();
        return responseData.data;
    }
);

// the two thunks below are supposed to be in AuthThunks.ts, but since that slice's being used for all roles
// putting it here keeps the separation between customer and staff features a little more concrete
export const changePasswordThunk = createAppAsyncThunk(
    "account/change-password",
    async (data: { password: string; newPassword: string }, { dispatch }) => {
        const response = await fetch(`${apiUrl}/auth/change-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        dispatch(logout());
    }
);

export const closeAccountThunk = createAppAsyncThunk("account/close", async (_, { dispatch }) => {
    const response = await fetch(`${apiUrl}/auth/close`, {
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
