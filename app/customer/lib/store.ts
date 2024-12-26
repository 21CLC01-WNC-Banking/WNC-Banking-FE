"use client";

import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { transferReducer } from "./slices/TransferSlice";
import { receiversReducer } from "./slices/ReceiversSlice";
import { authReducer } from "./slices/AuthSlice";
import { forgotPasswordReducer } from "./slices/ForgotPasswordSlice";

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["isLoggedIn"], // Only persist login state
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const makeStore = () => {
    const store = configureStore({
        reducer: {
            transfer: transferReducer,
            receivers: receiversReducer,
            auth: persistedAuthReducer,
            forgotPassword: forgotPasswordReducer,
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
