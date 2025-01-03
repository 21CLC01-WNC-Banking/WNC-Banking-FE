import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "@/lib/types/common";

interface AuthState {
    authUser: AuthUser | null;
}

const initialState: AuthState = {
    authUser: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthUser>) => {
            state.authUser = action.payload;
        },
        logout: (state) => {
            state.authUser = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
