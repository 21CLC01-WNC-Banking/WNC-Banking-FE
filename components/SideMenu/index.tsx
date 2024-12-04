"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Text, NavLink } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

import classes from "./SideMenu.module.css";

export interface SideMenuProps {
    forCustomer: boolean;
    items: { link: string; label: string; icon: JSX.Element; top: boolean }[];
}

const SideMenu: React.FC<SideMenuProps> = ({ forCustomer, items }) => {
    const [active, setActive] = useState(0);
    const router = useRouter();

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        if (forCustomer) {
            router.push("/customer/login");
        } else {
            router.push("/staff/login");
        }
    };

    const links = items.map(
        (item, index) =>
            item.top && (
                <NavLink
                    component={Link}
                    className={classes.link}
                    active={index === active}
                    href={item.link}
                    key={item.label}
                    label={item.label}
                    leftSection={item.icon}
                    onClick={() => setActive(index)}
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
                    (item, index) =>
                        !item.top && (
                            <NavLink
                                component={Link}
                                className={classes.link}
                                active={index === active}
                                href={item.link}
                                key={item.label}
                                label={item.label}
                                leftSection={item.icon}
                                onClick={() => setActive(index)}
                            />
                        )
                )}

                <Link
                    href={forCustomer ? "/customer/logout" : "/staff/logout"}
                    className={classes.link}
                    onClick={handleLogout}
                >
                    <IconLogout className={classes.linkIcon} />
                    <span>Đăng xuất</span>
                </Link>
            </div>
        </nav>
    );
};

export default SideMenu;
