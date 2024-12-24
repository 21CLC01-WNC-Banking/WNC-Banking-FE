"use client";

import { Tabs, Text } from "@mantine/core";
import React from "react";

interface TabHeaderProps {
    tabs: { label: string; content: JSX.Element }[];
    mt: string | number;
    mb: string | number;
}

const TabHeader: React.FC<TabHeaderProps> = ({ tabs, mt, mb }) => {
    return (
        <Tabs mt={mt} mb={mb} variant="default" radius="md" defaultValue={tabs[0].label}>
            <Tabs.List justify="flex-end">
                {tabs.map((tab, index) => (
                    <Tabs.Tab key={index} value={tab.label}>
                        <Text size="lg" fw={600}>
                            {tab.label}
                        </Text>
                    </Tabs.Tab>
                ))}
            </Tabs.List>

            {tabs.map((tab, index) => (
                <Tabs.Panel key={index} value={tab.label}>
                    {tab.content}
                </Tabs.Panel>
            ))}
        </Tabs>
    );
};

export default TabHeader;
