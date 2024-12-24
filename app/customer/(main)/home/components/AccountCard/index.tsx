import { Text } from "@mantine/core";
import classes from "./AccountCard.module.css";

const data = [
    {
        title: "Chủ tài khoản",
        stats: "DANG NHAT HOA",
    },
    {
        title: "Số tài khoản",
        stats: "0123 4567 8901",
    },
    {
        title: "Số dư",
        stats: "120,000,000 VND",
    },
];

const AccountCard = () => {
    const stats = data.map((stat) => (
        <div key={stat.title} className={classes.stat}>
            <Text className={classes.title}>{stat.title}</Text>
            <Text className={classes.count}>{stat.stats}</Text>
        </div>
    ));

    return <div className={classes.root}>{stats}</div>;
};

export default AccountCard;
