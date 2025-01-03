import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { Notification } from "@/lib/types/customer";

interface NotificationsState {
    notifications: Notification[];
}

const initialState: NotificationsState = {
    notifications: [],
};

export const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<Notification[]>) => {
            state.notifications = action.payload;
        },
        resetNotifications: (state) => {
            state.notifications = { ...initialState.notifications };
        },
    },
});

export const { setNotifications, resetNotifications } = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
