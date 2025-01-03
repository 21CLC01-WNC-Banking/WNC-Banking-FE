"use client";

import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { transferReducer } from "./slices/customer/TransferSlice";
import { receiversReducer } from "./slices/customer/ReceiversSlice";
import { authReducer } from "./slices/AuthSlice";
import { forgotPasswordReducer } from "./slices/customer/ForgotPasswordSlice";
import { transactionsReducer } from "./slices/customer/TransactionsSlice";
import { notificationsReducer } from "./slices/customer/NotificationsSlice";
import { partnerBanksReducer } from "./slices/customer/PartnerBanksSlice";

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["isLoggedIn"], // Only persist login state
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const makeStore = () => {
    const store = configureStore({
        reducer: {
            auth: persistedAuthReducer,

            // customer
            transfer: transferReducer,
            receivers: receiversReducer,
            forgotPassword: forgotPasswordReducer,
            transactions: transactionsReducer,
            notifications: notificationsReducer,
            partnerBanks: partnerBanksReducer,

            // staff
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
                },
            }),
    });

    return store;
};

export const makeStoreWithPersistor = () => {
    const store = makeStore();
    const persistor = persistStore(store);
    return { store, persistor };
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
