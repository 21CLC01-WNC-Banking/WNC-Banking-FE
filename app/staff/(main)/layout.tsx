"use client";

import { Stack, Group, Center } from "@mantine/core";
import { IconUserPlus, IconHistory, IconCreditCardPay } from "@tabler/icons-react";
import SideMenu from "@/components/SideMenu";
import StaffPortalShortcut from "./components/StaffPortalShortcut";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks/withTypes";
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
        link: "/staff/transaction-history",
        label: "Lịch sử giao dịch",
        icon: <IconHistory />,
        top: true,
    },
];

export default function StaffLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    const router = useRouter();
    const user = useAppSelector((state) => state.auth.currentUser);
    const email = user?.email;

    useEffect(() => {
        if (!email) {
            router.push("/staff/login");
        }
    }, [email, router]);

    if (!email) {
        return <Loading />;
    }

    return (
        <Group align="top" preventGrowOverflow={false} grow gap="0" bg="#ebf4fc">
            <SideMenu forCustomer={false} items={menuItems} />
            <Stack my={40}>
                <Group justify="flex-end" mx={40}>
                    <StaffPortalShortcut />
                </Group>

                <Center>
                    {children}
                </Center>
            </Stack>
        </Group>
    );
}
