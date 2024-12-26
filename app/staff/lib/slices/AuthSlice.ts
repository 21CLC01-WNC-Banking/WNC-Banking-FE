import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "../hooks/withTypes";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const loginThunk = createAppAsyncThunk("auth/login", async (data: object, { dispatch }) => {
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || "Login failed");
    }

    const responseData = await response.json();

    console.log(responseData);

    dispatch(
        setAuthUser({
            email: responseData.data.email,
        })
    );
});

interface AuthUser {
    email: string;
}

interface AuthState {
    currentUser: AuthUser | null;
}

const initialState: AuthState = {
    currentUser: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthUser: (state, action: PayloadAction<AuthUser>) => {
            state.currentUser = { ...action.payload };
        },
        logout: (state) => {
            state.currentUser = null;
        },
    },
});

export const { setAuthUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
