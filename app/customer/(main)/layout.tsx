"use client";

import { useEffect, Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { useAppSelector, useAppDispatch } from "@/lib/hooks/withTypes";
import { handleNotification, makeToast } from "@/lib/utils/customer";
import useWebSocket from "@/lib/hooks/useWebSocket";
import { getNotificationsThunk } from "@/lib/thunks/customer/NotificationsThunk";
import { getUnseenNotificationsCount } from "@/lib/utils/customer";

import { Group, Indicator } from "@mantine/core";
import {
    IconHome,
    IconCreditCardPay,
    IconMessageDollar,
    IconBell,
    IconUserCog,
} from "@tabler/icons-react";

import SideMenu from "@/components/SideMenu";
import Loading from "@/components/Loading";
import ScrollToTop from "@/components/ScrollToTop";

export default function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    const router = useRouter();

    const dispatch = useAppDispatch();
    const role = useAppSelector((state) => state.auth.authUser?.role);
    const notifications = useAppSelector((state) => state.notifications.notifications);

    const [unseenCount, setUnseenCount] = useState(0);

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
            label: unseenCount > 0 ? `Thông báo (${unseenCount})` : "Thông báo",
            icon: (
                <Indicator inline color="yellow" disabled={unseenCount === 0} size={8} offset={2}>
                    <Group align="center" justify="center">
                        <IconBell />
                    </Group>
                </Indicator>
            ),
            top: false,
        },
        {
            link: "/customer/account-settings",
            label: "Cài đặt tài khoản",
            icon: <IconUserCog />,
            top: false,
        },
    ];

    useEffect(() => {
        if (role !== "customer") {
            router.push("/customer/login");
        }
    }, [role, router]);

    useEffect(() => {
        if (!role) return;

        const fetchNotifications = async () => {
            try {
                await dispatch(getNotificationsThunk()).unwrap();
            } catch (error) {
                makeToast(
                    "error",
                    "Truy vấn danh sách thông báo thất bại",
                    (error as Error).message
                );
            }
        };

        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        setUnseenCount(getUnseenNotificationsCount(notifications));
    }, [notifications]);

    // websocket connection to receive notifications
    useWebSocket((data) => {
        if (data === "established") return;

        try {
            const audio = new Audio("/notification.mp3");
            audio.play();
            handleNotification(JSON.parse(data), router, dispatch, pathname);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    });

    if (!role) {
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
