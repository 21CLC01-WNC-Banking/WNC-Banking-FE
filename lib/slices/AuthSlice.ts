import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAccount } from "../types/customer";

interface AuthState {
    userAccount: UserAccount | null;
}

const initialState: AuthState = {
    userAccount: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserAccount>) => {
            state.userAccount = action.payload;
        },
        logout: (state) => {
            state.userAccount = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
