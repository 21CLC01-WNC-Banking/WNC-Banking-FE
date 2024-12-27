"use client";

import { useEffect } from "react";

import { Text, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import classes from "./AccountCard.module.css";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { getAccountThunk } from "@/lib/thunks/AuthThunks";
import { formatCurrency, formatAccountNumber } from "@/lib/utils";

const AccountCard = () => {
    const dispatch = useAppDispatch();
    const account = useAppSelector((state) => state.auth.customerAccount);

    const data = [
        {
            title: "Chủ tài khoản",
            stats: account?.name || "-",
        },
        {
            title: "Số tài khoản",
            stats: account ? formatAccountNumber(account.accountNumber) : "-",
        },
        {
            title: "Số dư",
            stats: account ? formatCurrency(account.balance) : "-",
        },
    ];

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                await dispatch(getAccountThunk()).unwrap();
            } catch (error) {
                notifications.show({
                    withBorder: true,
                    radius: "md",
                    icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
                    color: "red",
                    title: "Truy vấn thông tin tài khoản thất bại",
                    message: (error as Error).message || "Đã xảy ra lỗi kết nối với máy chủ.",
                    position: "bottom-right",
                });
            }
        };

        fetchAccount();
    }, [dispatch]);

    const stats = data.map((stat) => (
        <div key={stat.title} className={classes.stat}>
            <Text className={classes.title}>{stat.title}</Text>
            <Text className={classes.count}>{stat.stats}</Text>
        </div>
    ));

    return <div className={classes.root}>{stats}</div>;
};

export default AccountCard;
