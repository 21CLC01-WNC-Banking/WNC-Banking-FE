"use client";

import { Stack, Group } from "@mantine/core";
import { IconUsers, IconReceipt2 } from "@tabler/icons-react";
import SideMenu from "@/components/SideMenu";
import StaffPortalShortcut from "../employee/components/StaffPortalShortcut";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
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
    const router = useRouter();
    const role = useAppSelector((state) => state.auth.authUser?.role);
    const [isCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        if (!role) {
            setIsCheckingRole(true);
            return;
        }

        if (role !== "admin") {
            router.push("/staff/employee/create-account");
        } else {
            setIsCheckingRole(false);
        }
    }, [role, router]);

    if (isCheckingRole) {
        return <Loading />;
    }

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
