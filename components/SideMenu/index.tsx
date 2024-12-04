"use client";

import { useState } from "react";
import {
    IconCreditCard,
    IconUsers,
    IconCreditCardPay,
    IconMessageDollar,
    IconKey,
    IconLogout,
} from "@tabler/icons-react";
import { Text, NavLink } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./SideMenu.module.css";

const data = [
    { link: "/customer/accounts", label: "Danh sách tài khoản", icon: IconCreditCard },
    { link: "/customer/recipients", label: "Danh sách người nhận", icon: IconUsers },
    { link: "/customer/transfer", label: "Chuyển khoản", icon: IconCreditCardPay },
    { link: "/customer/request-payment", label: "Nhắc nợ", icon: IconMessageDollar },
];

const SideMenu = () => {
    const [active, setActive] = useState(0);
    const router = useRouter();

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        router.push("/customer/login");
    };

    const links = data.map((item, index) => (
        <NavLink
            component={Link}
            className={classes.link}
            active={index === active}
            href={item.link}
            key={item.label}
            label={item.label}
            leftSection={<item.icon />}
            onClick={() => setActive(index)}
        />
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Text fw={700} size="xl" className={classes.title} mt={20} mb={30}>
                    WNC Banking App
                </Text>
                {links}
            </div>

            <div className={classes.footer}>
                <Link href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconKey className={classes.linkIcon} stroke={1.5} />
                    <span>Đổi mật khẩu</span>
                </Link>

                <Link href="/customer/logout" className={classes.link} onClick={handleLogout}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Đăng xuất</span>
                </Link>
            </div>
        </nav>
    );
};

export default SideMenu;
