"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { Text, NavLink } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

import LinkGroup from "@/components/LinkGroup";
import CurrentTime from "@/components/CurrentTime";

import classes from "./SideMenu.module.css";

import { useAppDispatch } from "@/lib/hooks/withTypes";
import { logout } from "@/app/customer/lib/slices/AuthSlice";

interface SideMenuProps {
    forCustomer: boolean;
    items: {
        link?: string;
        label: string;
        icon: JSX.Element;
        top: boolean;
        innerLinks?: { link: string; label: string }[];
    }[];
}

const SideMenu: React.FC<SideMenuProps> = ({ forCustomer, items }) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        dispatch(logout());

        if (forCustomer) {
            router.push("/customer/login");
        } else {
            localStorage.removeItem("email");
            router.push("/staff/login");
        }
    };

    const links = items.map((item) =>
        item.top && item.innerLinks ? (
            <LinkGroup
                icon={item.icon}
                label={item.label}
                links={item.innerLinks}
                key={item.label}
            />
        ) : item.top ? (
            <NavLink
                component={Link}
                className={classes.link}
                active={pathname === item.link}
                href={item.link ? item.link : "#"}
                key={item.label}
                label={item.label}
                leftSection={item.icon}
            />
        ) : null
    );

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Text fw={700} size="xl" className={classes.title} mt={20} mb={30}>
                    WNC Banking App
                </Text>
                {links}
            </div>

            <CurrentTime />

            <div className={classes.footer}>
                {items.map(
                    (item) =>
                        !item.top && (
                            <NavLink
                                component={Link}
                                className={classes.link}
                                active={pathname === item.link}
                                href={item.link ? item.link : "#"}
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
