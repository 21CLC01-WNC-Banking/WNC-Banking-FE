import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ReceiverAccount } from "@/lib/types/customer";

import accounts from "@/lib/mock_data/accounts.json";

interface ReceiversState {
    receivers: ReceiverAccount[];
    filteredReceivers: ReceiverAccount[];
}

const initialState: ReceiversState = {
    receivers: accounts,
    filteredReceivers: [],
};

export const receiversSlice = createSlice({
    name: "receivers",
    initialState,
    reducers: {
        setFilteredReceivers: (state, action: PayloadAction<string>) => {
            state.filteredReceivers = state.receivers.filter((receiver: ReceiverAccount) => {
                return receiver.bank.toLowerCase().includes(action.payload.toLowerCase());
            });
        },
        resetReceivers: (state) => {
            state.receivers = { ...initialState.receivers };
        },
    },
});

export const { setFilteredReceivers, resetReceivers } = receiversSlice.actions;
export const receiversReducer = receiversSlice.reducer;
