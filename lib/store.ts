import { configureStore } from "@reduxjs/toolkit";
import { transferReducer } from "./slices/TransferSlice";
import { receiversReducer } from "./slices/ReceiversSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            transfer: transferReducer,
            receivers: receiversReducer,
        },
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
