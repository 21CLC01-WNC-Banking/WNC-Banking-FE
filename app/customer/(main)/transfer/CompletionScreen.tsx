"use client";

import Link from "next/link";
import { Button, Center, Title, Stack } from "@mantine/core";

interface CompletionScreenProps {
    handleNextStep?: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = () => {
    return (
        <Stack mt="xl">
            <Center>
                <Title order={2}>Chuyển khoản thành công</Title>
            </Center>

            <Link href="/customer/home" style={{ textDecoration: "none" }}>
                <Button fullWidth mt="xl">
                    Về trang chủ
                </Button>
            </Link>
        </Stack>
    );
};

export default CompletionScreen;
