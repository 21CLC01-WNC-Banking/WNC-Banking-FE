"use client";

import React, { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { Tabs, Text } from "@mantine/core";

interface TabHeaderProps {
    tabs: { label: string; content: JSX.Element; query: string }[];
    mt: string | number;
    mb: string | number;
}

const TabHeader: React.FC<TabHeaderProps> = ({ tabs, mt, mb }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    return (
        <Tabs
            mt={mt}
            mb={mb}
            variant="default"
            radius="md"
            defaultValue={searchParams.get("tab") || tabs[0].query}
        >
            <Tabs.List justify="flex-end">
                {tabs.map((tab, index) => (
                    <Tabs.Tab
                        key={index}
                        value={tab.query}
                        onClick={() =>
                            router.push(pathname + "?" + createQueryString("tab", tab.query))
                        }
                    >
                        <Text size="lg" fw={600}>
                            {tab.label}
                        </Text>
                    </Tabs.Tab>
                ))}
            </Tabs.List>

            {tabs.map((tab, index) => (
                <Tabs.Panel key={index} value={tab.query}>
                    {tab.content}
                </Tabs.Panel>
            ))}
        </Tabs>
    );
};

export default TabHeader;
