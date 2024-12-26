import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAccount } from "../types";

interface AuthState {
    isLoggedIn: boolean | null;
    account: UserAccount | null;
}

const initialState: AuthState = {
    isLoggedIn: null,
    account: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state) => {
            state.isLoggedIn = true;
        },
        setAuthUser: (state, action: PayloadAction<UserAccount>) => {
            state.account = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
        },
    },
});

export const { login, setAuthUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
