import { Suspense } from "react";

import StoreProvider from "./StoreProvider";

import { Group } from "@mantine/core";
import { IconHome, IconCreditCardPay, IconMessageDollar, IconKey } from "@tabler/icons-react";

import SideMenu from "@/components/SideMenu";

import Loading from "../../../components/Loading";

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
        link: "/customer/request-payment",
        label: "Nhắc nợ",
        icon: <IconMessageDollar />,
        top: true,
    },
    {
        link: "/customer/change-password",
        label: "Đổi mật khẩu",
        icon: <IconKey />,
        top: false,
    },
];

export default function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <StoreProvider>
            <Group align="top" preventGrowOverflow={false} grow gap="0" wrap="nowrap">
                <SideMenu forCustomer items={menuItems} />
                <Suspense fallback={<Loading />}>{children}</Suspense>
            </Group>
        </StoreProvider>
    );
}
