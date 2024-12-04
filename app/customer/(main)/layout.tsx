import { Group } from "@mantine/core";
import {
    IconCreditCard,
    IconUsers,
    IconCreditCardPay,
    IconMessageDollar,
    IconKey,
} from "@tabler/icons-react";

import SideMenu from "@/components/SideMenu";

const menuItems = [
    {
        link: "/customer/accounts",
        label: "Danh sách tài khoản",
        icon: <IconCreditCard />,
        top: true,
    },
    {
        link: "/customer/recipients",
        label: "Danh sách người nhận",
        icon: <IconUsers />,
        top: true,
    },
    {
        link: "/customer/transfer",
        label: "Chuyển khoản",
        icon: <IconCreditCardPay />,
        top: true,
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
        <Group align="top">
            <SideMenu forCustomer items={menuItems} />
            {children}
        </Group>
    );
}
