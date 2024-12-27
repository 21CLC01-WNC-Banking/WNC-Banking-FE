import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAccount } from "../types/customer";

interface AuthState {
    isLoggedIn: boolean | null;
    customerAccount: UserAccount | null;
}

const initialState: AuthState = {
    isLoggedIn: null,
    customerAccount: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state) => {
            state.isLoggedIn = true;
        },
        setCustomerAccount: (state, action: PayloadAction<UserAccount>) => {
            state.customerAccount = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
        },
    },
});

export const { login, setCustomerAccount, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
