import { createAppAsyncThunk } from "@/lib/hooks/withTypes";
import { setPartnerBanks } from "@/lib/slices/customer/PartnerBanksSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getPartnerBanksThunk = createAppAsyncThunk(
    "partner-banks/get",
    async (_, { dispatch }) => {
        const response = await fetch(`${apiUrl}/partner-bank/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.errors[0].message || "Đã xảy ra lỗi kết nối với máy chủ.");
        }

        const responseData = await response.json();

        dispatch(setPartnerBanks(responseData.data || []));
    }
);

export const geThunk = createAppAsyncThunk(
    "partnerBanks/set-as-seen",
    async (data: { id: number }) => {
        const response = await fetch(`${apiUrl}/customer/partnerBank/${data.id}`, {
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
