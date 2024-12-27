import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ReceiverAccount } from "@/lib/types/customer";

interface ReceiversState {
    receivers: ReceiverAccount[];
    filteredReceivers: ReceiverAccount[];
}

const initialState: ReceiversState = {
    receivers: [],
    filteredReceivers: [],
};

export const receiversSlice = createSlice({
    name: "receivers",
    initialState,
    reducers: {
        setReceivers: (state, action: PayloadAction<ReceiverAccount[]>) => {
            state.receivers = action.payload;
        },
        setFilteredReceivers: (state, action: PayloadAction<string>) => {
            // state.filteredReceivers = state.receivers.filter((receiver: ReceiverAccount) => {
            //     return receiver.bank.toLowerCase().includes(action.payload.toLowerCase());
            // });
        },
        resetReceivers: (state) => {
            state.receivers = { ...initialState.receivers };
            state.filteredReceivers = { ...initialState.filteredReceivers };
        },
    },
});

export const { setReceivers, setFilteredReceivers, resetReceivers } = receiversSlice.actions;
export const receiversReducer = receiversSlice.reducer;
