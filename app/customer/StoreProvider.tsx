"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { makeStoreWithPersistor, AppStore } from "@/app/customer/lib/store";
import Loading from "@/components/Loading";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<{
        store: AppStore;
        persistor: ReturnType<typeof makeStoreWithPersistor>["persistor"];
    } | null>(null);

    if (!storeRef.current) {
        storeRef.current = makeStoreWithPersistor();
    }

    return (
        <Provider store={storeRef.current.store}>
            <PersistGate loading={<Loading />} persistor={storeRef.current.persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
