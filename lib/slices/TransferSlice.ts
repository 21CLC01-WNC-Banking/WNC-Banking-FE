import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { Transfer } from "@/lib/types";

interface TransferState {
    currentTransfer: Transfer;
}

const initialState: TransferState = {
    currentTransfer: {
        senderAccount: "",
        receiverAccount: "",
        amount: 0,
        message: "",
    },
};

export const transferSlice = createSlice({
    name: "transfer",
    initialState,
    reducers: {
        setTransfer: (state, action: PayloadAction<Transfer>) => {
            state.currentTransfer = action.payload;
        },
        resetTransfer: (state) => {
            state.currentTransfer = { ...initialState.currentTransfer };
        },
    },
});

export const { setTransfer, resetTransfer } = transferSlice.actions;
export const transferReducer = transferSlice.reducer;
