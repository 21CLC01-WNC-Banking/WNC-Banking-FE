import { useState } from "react";
import Link from "next/link";

import { Box, Collapse, Group, UnstyledButton, NavLink } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

import classes from "./LinkGroup.module.css";

interface LinkGroupProps {
    icon: JSX.Element;
    label: string;
    initiallyOpened?: boolean;
    links: { label: string; link: string }[];
}

const LinkGroup: React.FC<LinkGroupProps> = ({ icon, label, initiallyOpened, links }) => {
    const [opened, setOpened] = useState(initiallyOpened || false);

    const items = links.map((link) => (
        <NavLink
            component={Link}
            className={classes.innerLink}
            // active={pathname === link.link}
            href={link.link}
            key={link.label}
            label={link.label}
        />
    ));

    return (
        <>
            <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        {icon}
                        <Box ml="sm">{label}</Box>
                    </Box>

                    <IconChevronRight
                        className={classes.chevron}
                        stroke={1.5}
                        size={20}
                        style={{ transform: opened ? "rotate(-90deg)" : "none" }}
                    />
                </Group>
            </UnstyledButton>
            <Collapse in={opened}>{items}</Collapse>
        </>
    );
};

export default LinkGroup;
