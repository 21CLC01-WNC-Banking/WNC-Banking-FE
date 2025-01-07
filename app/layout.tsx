import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import StoreProvider from "./customer/StoreProvider";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export const metadata: Metadata = {
    title: "WNC Banking App",
    description: "Final project for HCMUS' Advanced Web Development course",
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
