import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { PartnerBank } from "@/lib/types/customer";

interface PartnerBanksState {
    partnerBanks: PartnerBank[];
}

const initialState: PartnerBanksState = {
    partnerBanks: [],
};

export const partnerBanksSlice = createSlice({
    name: "partnerBanks",
    initialState,
    reducers: {
        setPartnerBanks: (state, action: PayloadAction<PartnerBank[]>) => {
            state.partnerBanks = action.payload;
        },
        resetPartnerBanks: (state) => {
            state.partnerBanks = { ...initialState.partnerBanks };
        },
    },
});

export const { setPartnerBanks, resetPartnerBanks } = partnerBanksSlice.actions;
export const partnerBanksReducer = partnerBanksSlice.reducer;
