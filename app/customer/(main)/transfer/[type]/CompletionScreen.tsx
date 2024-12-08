"use client";

import { useState } from "react";
import { Button, Center, Title, Stack, Checkbox, Group, TextInput } from "@mantine/core";

interface CompletionScreenProps {
    handleNextStep?: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = () => {
    const [displayNickname, setDisplayNickname] = useState(false);

    return (
        <Stack mt="xl">
            <Center>
                <Title order={2}>Chuyển khoản thành công</Title>
            </Center>

            <Group grow gap="xl" mt="lg">
                <Checkbox
                    size="md"
                    radius="md"
                    mt="lg"
                    label="Lưu thông tin người nhận"
                    checked={displayNickname}
                    onChange={(event) => {
                        setDisplayNickname(event.currentTarget.checked);
                    }}
                />

                {displayNickname && (
                    <TextInput size="md" radius="md" placeholder="Nhập tên gợi nhớ (tùy chọn)" />
                )}
            </Group>

            <Button fullWidth mt={40}>
                Xác nhận
            </Button>
        </Stack>
    );
};

export default CompletionScreen;
