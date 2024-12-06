"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Text, NavLink } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

import classes from "./SideMenu.module.css";

export interface SideMenuProps {
    forCustomer: boolean;
    items: { link: string; label: string; icon: JSX.Element; top: boolean }[];
}

const SideMenu: React.FC<SideMenuProps> = ({ forCustomer, items }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        if (forCustomer) {
            router.push("/customer/login");
        } else {
            router.push("/staff/login");
        }
    };

    const links = items.map(
        (item) =>
            item.top && (
                <NavLink
                    component={Link}
                    className={classes.link}
                    active={pathname === item.link}
                    href={item.link}
                    key={item.label}
                    label={item.label}
                    leftSection={item.icon}
                />
            )
    );

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Text fw={700} size="xl" className={classes.title} mt={20} mb={30}>
                    WNC Banking App
                </Text>
                {links}
            </div>

            <div className={classes.footer}>
                {items.map(
                    (item) =>
                        !item.top && (
                            <NavLink
                                component={Link}
                                className={classes.link}
                                active={pathname === item.link}
                                href={item.link}
                                key={item.label}
                                label={item.label}
                                leftSection={item.icon}
                            />
                        )
                )}

                <Link
                    href={forCustomer ? "/customer/logout" : "/staff/logout"}
                    className={classes.link}
                    onClick={handleLogout}
                >
                    <IconLogout className={classes.linkIcon} />
                    <span style={{ marginLeft: "25" }}>Đăng xuất</span>
                </Link>
            </div>
        </nav>
    );
};

export default SideMenu;
