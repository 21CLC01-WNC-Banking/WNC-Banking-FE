import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ForgotPasswordState {
    email: string | null;
    otp: string | null;
}

const initialState: ForgotPasswordState = {
    email: null,
    otp: null,
};

export const forgotPasswordSlice = createSlice({
    name: "forgotPassword",
    initialState,
    reducers: {
        setForgotPasswordEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setForgotPasswordOtp: (state, action: PayloadAction<string>) => {
            state.otp = action.payload;
        },
        resetForgotPassword: (state) => {
            state.email = null;
            state.otp = null;
        },
    },
});

export const { setForgotPasswordEmail, setForgotPasswordOtp, resetForgotPassword } =
    forgotPasswordSlice.actions;
export const forgotPasswordReducer = forgotPasswordSlice.reducer;
