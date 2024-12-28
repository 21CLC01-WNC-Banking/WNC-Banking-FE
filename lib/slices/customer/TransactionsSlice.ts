import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { Transaction, PaymentRequest } from "@/lib/types/customer";

interface TransactionsState {
    transactionHistory: Transaction[];
    receivedRequests: PaymentRequest[];
    sentRequests: PaymentRequest[];
}

const initialState: TransactionsState = {
    transactionHistory: [],
    receivedRequests: [],
    sentRequests: [],
};

export const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        setTransactionHistory: (state, action: PayloadAction<Transaction[]>) => {
            state.transactionHistory = action.payload;
        },
        setSentRequests: (state, action: PayloadAction<PaymentRequest[]>) => {
            state.sentRequests = action.payload;
        },
        setReceivedRequests: (state, action: PayloadAction<PaymentRequest[]>) => {
            state.receivedRequests = action.payload;
        },
        resetTransactionHistory: (state) => {
            state.transactionHistory = { ...initialState.transactionHistory };
        },
        resetSentRequests: (state) => {
            state.sentRequests = { ...initialState.sentRequests };
        },
        resetReceivedRequests: (state) => {
            state.receivedRequests = { ...initialState.receivedRequests };
        },
    },
});

export const {
    setTransactionHistory,
    resetTransactionHistory,
    setSentRequests,
    resetSentRequests,
    setReceivedRequests,
    resetReceivedRequests,
} = transactionsSlice.actions;
export const transactionsReducer = transactionsSlice.reducer;
