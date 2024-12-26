import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Transfer } from "../types";

interface TransferState {
    currentTransferId: string | null;
    currentTransfer: Transfer | null;
}

const initialState: TransferState = {
    currentTransferId: null,
    currentTransfer: null,
};

export const transferSlice = createSlice({
    name: "transfer",
    initialState,
    reducers: {
        setCurrentTransferId: (state, action: PayloadAction<string>) => {
            state.currentTransferId = action.payload;
        },
        setCurrentTransfer: (state, action: PayloadAction<Transfer>) => {
            state.currentTransfer = action.payload;
        },
        resetTransfer: (state) => {
            state.currentTransferId = null;
            state.currentTransfer = null;
        },
    },
});

export const { setCurrentTransferId, setCurrentTransfer, resetTransfer } = transferSlice.actions;
export const transferReducer = transferSlice.reducer;
