import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import StoreProvider from "./StoreProvider";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

export const metadata: Metadata = {
    title: "WNC Banking App",
    description: "Đồ án học phần Lập trình Web nâng cao - 21KTPM1 (Nhóm 03)",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider>
                    <Notifications />
                    <NextTopLoader color="#72bcfc" showSpinner={false} />
                    <StoreProvider>{children}</StoreProvider>
                </MantineProvider>
            </body>
        </html>
    );
}
