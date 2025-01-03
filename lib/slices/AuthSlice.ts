import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAccount } from "../types/customer";

interface AuthState {
    customerAccount: UserAccount | null;
}

const initialState: AuthState = {
    customerAccount: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserAccount>) => {
            state.customerAccount = action.payload;
        },
        logout: (state) => {
            state.customerAccount = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
