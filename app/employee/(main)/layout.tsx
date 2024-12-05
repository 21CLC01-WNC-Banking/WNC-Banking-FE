import { Flex, Group } from "@mantine/core";
import {
    IconKey,
    IconUserPlus,
    IconHistory,
    IconCashBanknote
} from "@tabler/icons-react";

import SideMenu from "@/components/SideMenu";
import CurrentTime from "./components/currentTime";

const menuItems = [
    {
        link: "/employee/create-account",
        label: "Tạo tài khoản khách hàng",
        icon: <IconUserPlus />,
        top: true,
    },
    {
        link: "/employee/deposit",
        label: "Nạp tiền vào tài khoản",
        icon: <IconCashBanknote />,
        top: true,
    },
    {
        link: "/employee/transfer-history",
        label: "Lịch sử giao dịch",
        icon: <IconHistory />,
        top: true,
    },
    {
        link: "/customer/change-password",
        label: "Đổi mật khẩu",
        icon: <IconKey />,
        top: false,
    },
];

export default function EmployeeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Group align="top" bg="#E6EDF4">
            <SideMenu forCustomer items={menuItems} />
            <Flex direction="column">
                <CurrentTime />
                {children}
            </Flex>
        </Group>
    );
}
