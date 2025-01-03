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
        setFilteredReceivers: (state, action: PayloadAction<number>) => {
            if (action.payload === 0) {
                state.filteredReceivers = state.receivers.filter((receiver: ReceiverAccount) => {
                    return receiver.bankId === null;
                });
            } else {
                state.filteredReceivers = state.receivers.filter((receiver: ReceiverAccount) => {
                    return receiver.bankId === action.payload;
                });
            }
        },
        resetFilter: (state) => {
            state.filteredReceivers = state.receivers;
        },
        resetReceivers: (state) => {
            state.receivers = { ...initialState.receivers };
            state.filteredReceivers = { ...initialState.filteredReceivers };
        },
    },
});

export const { setReceivers, setFilteredReceivers, resetFilter, resetReceivers } =
    receiversSlice.actions;
export const receiversReducer = receiversSlice.reducer;
