import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { Account } from "@/app/staff/lib/types";

import accounts from "@/lib/mock_data/accounts.json";

interface ReceiversState {
    receivers: Account[];
    filteredReceivers: Account[];
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
            state.filteredReceivers = state.receivers.filter((receiver: Account) => {
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
