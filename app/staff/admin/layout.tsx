"use client";

import { Stack, Group } from "@mantine/core";
import { IconUsers, IconReceipt2 } from "@tabler/icons-react";
import SideMenu from "@/components/SideMenu";
import StaffPortalShortcut from "../employee/components/StaffPortalShortcut";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks/withTypes";
import Loading from "@/components/Loading";

const menuItems = [
    {
        link: "/staff/admin/employee-list",
        label: "Danh sách nhân viên",
        icon: <IconUsers />,
        top: true,
    },
    {
        link: "/staff/admin/transaction-list",
        label: "Danh sách giao dịch",
        icon: <IconReceipt2 />,
        top: true,
    },
];

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    // const router = useRouter();
    // const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         router.push("/staff/login");
    //     }
    // }, [isLoggedIn, router]);

    // if (!isLoggedIn) {
    //     return <Loading />;
    // }

    return (
        <Group align="top" preventGrowOverflow={false} grow gap="0" wrap="nowrap">
            <SideMenu forCustomer={false} items={menuItems} />
            <Stack>
                <Group justify="flex-end" mr={40} mt={10}>
                    <StaffPortalShortcut />
                </Group>
                {children}
            </Stack>
        </Group>
    );
}
