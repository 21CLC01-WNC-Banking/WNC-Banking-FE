import { createAppAsyncThunk } from "@/lib/hooks/withTypes";
import { setNotifications } from "@/lib/slices/customer/NotificationsSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getNotificationsThunk = createAppAsyncThunk(
    "notifications/get",
    async (_, { dispatch }) => {
        const response = await fetch(`${apiUrl}/customer/notification`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();

        dispatch(setNotifications(responseData.data || []));
    }
);

export const setSeenNotificationThunk = createAppAsyncThunk(
    "notifications/set-as-seen",
    async (data: { id: number }) => {
        const response = await fetch(`${apiUrl}/customer/notification/${data.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }
    }
);
