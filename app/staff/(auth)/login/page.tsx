"use client";

import { useRouter } from "next/navigation";

import {
    Anchor,
    Button,
    Center,
    Container,
    Paper,
    PasswordInput,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import Link from "next/link";

const Login = () => {
    const router = useRouter();

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnChange: true,
        initialValues: { email: "", password: "" },

        validate: {
            email: isEmail("Email không hợp lệ"),
            password: isNotEmpty("Vui lòng nhập mật khẩu"),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        console.log(values);
        router.push("/staff");
    };

    return (
        <Center style={{ height: "100vh" }}>
            <Container size={420} my={40}>
                <Title ta="center">Cổng nhân viên WNC Banking</Title>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput
                            label="Địa chỉ email"
                            placeholder="you@wnc.bank"
                            key={form.key("email")}
                            {...form.getInputProps("email")}
                        />

                        <PasswordInput
                            label="Mật khẩu"
                            placeholder="Mật khẩu"
                            mt="md"
                            key={form.key("password")}
                            {...form.getInputProps("password")}
                        />

                        <Button fullWidth type="submit" mt="xl">
                            Đăng nhập
                        </Button>
                    </form>
                </Paper>

                <Center>
                    <Link href="/customer/login" passHref style={{ textDecoration: "none" }}>
                        <Anchor component="button" mt="lg">
                            Chuyển sang portal khách hàng
                        </Anchor>
                    </Link>
                </Center>
            </Container>
        </Center>
    );
};

export default Login;
