"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Button,
    Center,
    Title,
    Stack,
    Checkbox,
    Group,
    TextInput,
    rem,
    Fieldset,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

interface CompletionScreenProps {
    handleNextStep?: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = () => {
    const router = useRouter();

    const [displayNickname, setDisplayNickname] = useState(false);

    const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            nickname: "",
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        if (displayNickname) {
            // send the nickname to be set by the server and await response

            // if good, pop this notification
            notifications.show({
                withBorder: true,
                radius: "md",
                icon: checkIcon,
                color: "teal",
                title: "Lưu người nhận thành công",
                message: "Bạn có thể kiểm tra lại thông tin người nhận tại Trang chủ.",
                position: "bottom-right",
            });
        }

        router.push("/customer/home");
    };

    return (
        <Stack mt="xl">
            <Center>
                <Title order={2}>Chuyển khoản thành công</Title>
            </Center>

            <Fieldset radius="md" p={30} mt="xl">
                <form onSubmit={form.onSubmit(handleSubmit)}>
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
                            <TextInput
                                size="md"
                                radius="md"
                                placeholder="Nhập tên gợi nhớ (tùy chọn)"
                                key={form.key("nickname")}
                                {...form.getInputProps("nickname")}
                            />
                        )}
                    </Group>

                    <Button fullWidth type="submit" mt={40} radius="md">
                        Xác nhận
                    </Button>
                </form>
            </Fieldset>
        </Stack>
    );
};

export default CompletionScreen;
