import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    role: string | null
}

const initialState: AuthState = {
    role: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.role = action.payload;
        },
        logout: (state) => {
            state.role = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export const staffAuthReducer = authSlice.reducer;
