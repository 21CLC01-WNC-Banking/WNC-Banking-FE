"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import {
    Anchor,
    Button,
    Center,
    Container,
    Group,
    Paper,
    PasswordInput,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";

const Login = () => {
    const router = useRouter();

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: { email: "", password: "" },

        validate: {
            email: isEmail("Email không hợp lệ"),
            password: isNotEmpty("Vui lòng nhập mật khẩu"),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        console.log(values);
        router.push("/customer");
    };

    return (
        <Center style={{ height: "100vh" }}>
            <Container size={420} my={40}>
                <Title ta="center">WNC Banking App</Title>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput
                            radius="md"
                            label="Địa chỉ email"
                            placeholder="you@wnc.bank"
                            withAsterisk
                            key={form.key("email")}
                            {...form.getInputProps("email")}
                        />

                        <PasswordInput
                            radius="md"
                            label="Mật khẩu"
                            placeholder="Mật khẩu"
                            mt="md"
                            withAsterisk
                            key={form.key("password")}
                            {...form.getInputProps("password")}
                        />

                        <Group justify="center">
                            <Button fullWidth type="submit" mt="xl" radius="md">
                                Đăng nhập
                            </Button>

                            <Link
                                href="/customer/forgot-password"
                                passHref
                                style={{ textDecoration: "none" }}
                            >
                                <Anchor component="button">Quên mật khẩu</Anchor>
                            </Link>
                        </Group>
                    </form>
                </Paper>

                <Center>
                    <Link href="/staff/login" passHref style={{ textDecoration: "none" }}>
                        <Anchor component="button" mt="lg">
                            Chuyển sang portal nhân viên
                        </Anchor>
                    </Link>
                </Center>
            </Container>
        </Center>
    );
};

export default Login;
