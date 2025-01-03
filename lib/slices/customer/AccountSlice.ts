import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerAccount } from "@/lib/types/customer";

interface AccountState {
    customerAccount: CustomerAccount | null;
}

const initialState: AccountState = {
    customerAccount: null,
};

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setCustomerAccount: (state, action: PayloadAction<CustomerAccount>) => {
            state.customerAccount = action.payload;
        },
        resetCustomerAccount: (state) => {
            state.customerAccount = null;
        },
    },
});

export const { setCustomerAccount, resetCustomerAccount } = accountSlice.actions;
export const accountReducer = accountSlice.reducer;
