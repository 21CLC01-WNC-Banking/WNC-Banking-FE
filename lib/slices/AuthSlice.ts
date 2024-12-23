import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "../hooks/withTypes";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const loginThunk = createAppAsyncThunk("auth/login", async (data: object, { dispatch }) => {
    console.log(data);

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

    dispatch(
        setAuthUser({
            id: responseData.data.id,
            email: responseData.data.email,
            name: responseData.data.name,
            phoneNumber: responseData.data.phoneNumber,
        })
    );
});

interface AuthUser {
    id: number;
    email: string;
    name: string;
    phoneNumber: string;
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

export const { setAuthUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
