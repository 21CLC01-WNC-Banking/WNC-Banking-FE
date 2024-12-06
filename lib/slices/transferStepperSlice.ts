import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TransferStepperState {
    currentStep: number;
}

const initialState: TransferStepperState = {
    currentStep: 0,
};

export const transferStepperSlice = createSlice({
    name: "transferStepper",
    initialState,
    reducers: {
        setCurrentStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
    },
});

export const { setCurrentStep } = transferStepperSlice.actions;
export const transferStepperReducer = transferStepperSlice.reducer;
