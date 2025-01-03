import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
    title: "WNC Banking App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <NextTopLoader color="#72bcfc" showSpinner={false} />
            <StoreProvider>{children}</StoreProvider>
        </>
    );
}
