import SideMenu from "@/components/SideMenu";
import { Group } from "@mantine/core";

export default function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Group align="top">
            <SideMenu />
            {children}
        </Group>
    );
}
