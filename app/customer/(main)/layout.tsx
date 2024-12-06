import { Group } from "@mantine/core";
import { IconHome, IconCreditCardPay, IconMessageDollar, IconKey } from "@tabler/icons-react";

import SideMenu from "@/components/SideMenu";

const menuItems = [
    {
        link: "/customer/home",
        label: "Trang chủ",
        icon: <IconHome />,
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
        <Group align="top" preventGrowOverflow={false} grow gap="0">
            <SideMenu forCustomer items={menuItems} />
            {children}
        </Group>
    );
}
