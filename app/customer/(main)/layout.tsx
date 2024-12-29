"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "nextjs-toploader/app";

import { Group } from "@mantine/core";
import {
    IconHome,
    IconCreditCardPay,
    IconMessageDollar,
    IconKey,
    IconBell,
} from "@tabler/icons-react";

import SideMenu from "@/components/SideMenu";
import Loading from "@/components/Loading";
import ScrollToTop from "@/components/ScrollToTop";

import { useAppSelector } from "@/lib/hooks/withTypes";
import { makeToast } from "@/lib/utils/customer";
import useWebSocket from "@/lib/hooks/useWebSocket";

const menuItems = [
    {
        link: "/customer/home",
        label: "Trang chủ",
        icon: <IconHome />,
        top: true,
    },
    {
        label: "Chuyển khoản",
        icon: <IconCreditCardPay />,
        top: true,
        innerLinks: [
            {
                link: "/customer/transfer/internal",
                label: "Nội bộ",
            },
            {
                link: "/customer/transfer/external",
                label: "Liên ngân hàng",
            },
        ],
    },
    {
        link: "/customer/payment-requests",
        label: "Nhắc nợ",
        icon: <IconMessageDollar />,
        top: true,
    },
    {
        link: "/customer/notifications",
        label: "Thông báo",
        icon: <IconBell />,
        top: false,
    },
    {
        link: "/customer/change-password",
        label: "Đổi mật khẩu",
        icon: <IconKey />,
        top: false,
    },
];

export default function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/customer/login");
        }
    }, [isLoggedIn, router]);

    // websocket connection to receive notifications
    useWebSocket((data) => {
        if (data === "established") return;

        try {
            const parts = data.split("\n");
            makeToast("info", parts[0], parts[1]);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    });

    if (!isLoggedIn) {
        return <Loading />;
    }

    return (
        <Group align="top" preventGrowOverflow={false} grow gap="0" wrap="nowrap">
            <SideMenu forCustomer items={menuItems} />
            <ScrollToTop />
            <Suspense fallback={<Loading />}>{children}</Suspense>
        </Group>
    );
}
