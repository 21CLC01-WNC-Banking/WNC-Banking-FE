"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { getUserAccountThunk } from "@/lib/thunks/customer/AccountThunks";
import { formatCurrency, formatAccountNumber, makeToast } from "@/lib/utils/customer";

import { Text } from "@mantine/core";
import classes from "./AccountCard.module.css";

const AccountCard = () => {
    const dispatch = useAppDispatch();
    const account = useAppSelector((state) => state.account.customerAccount);

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
                await dispatch(getUserAccountThunk()).unwrap();
            } catch (error) {
                makeToast(
                    "error",
                    "Truy vấn thông tin tài khoản thất bại",
                    (error as Error).message
                );
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
