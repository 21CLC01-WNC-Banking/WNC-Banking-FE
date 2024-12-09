import { Suspense } from "react";

import { Stack, Group } from "@mantine/core";
import { IconUserPlus, IconHistory, IconCreditCardPay } from "@tabler/icons-react";

import SideMenu from "@/components/SideMenu";
import StaffPortalShortcut from "./components/StaffPortalShortcut";
import Loading from "@/components/Loading";

const menuItems = [
    {
        link: "/staff/create-account",
        label: "Tạo tài khoản khách hàng",
        icon: <IconUserPlus />,
        top: true,
    },
    {
        link: "/staff/deposit",
        label: "Nạp tiền vào tài khoản",
        icon: <IconCreditCardPay />,
        top: true,
    },
    {
        link: "/staff/transfer-history",
        label: "Lịch sử giao dịch",
        icon: <IconHistory />,
        top: true,
    },
];

export default function StaffLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Group align="top" preventGrowOverflow={false} grow gap="0" bg="#E6EDF4">
            <SideMenu forCustomer={false} items={menuItems} />
            <Stack my={40}>
                <Group justify="flex-end" mx={40}>
                    <StaffPortalShortcut />
                </Group>

                <Suspense fallback={<Loading />}>{children}</Suspense>
            </Stack>
        </Group>
    );
}
