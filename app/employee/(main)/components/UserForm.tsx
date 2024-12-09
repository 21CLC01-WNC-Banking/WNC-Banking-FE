"use client";

import {
    Button,
    Paper,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";


const UserForm: React.FC = () => {

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            phone: '',
            email: '',
        },
        validate: {
            name: isNotEmpty("Vui lòng nhập họ tên"),
            email: isEmail("Vui lòng nhập email hợp lệ"),
            phone: (value) => (/^(?:\+84|0)(?:\d){9}$/.test(value) ? null : "Vui lòng nhập số điện thoại hợp lệ"),
        }
    })

    const handleSubmit = (values: typeof form.values) => {
        console.log(values);
    };

    return (
        <>
            <Title order={2} my={10}>Thông tin khách hàng</Title>
            <Paper shadow="md" p={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>

                    <TextInput
                        label="Họ tên"
                        required
                        placeholder="Nguyễn Văn A"
                        key={form.key("name")}
                        {...form.getInputProps("name")}
                    />

                    <TextInput
                        label="Địa chỉ email"
                        required
                        placeholder="you@wnc.bank"
                        mt="md"
                        key={form.key("email")}
                        {...form.getInputProps("email")}
                    />

                    <TextInput
                        label="Số điện thoại"
                        required
                        placeholder="0123456789"
                        mt="md"
                        key={form.key("phone")}
                        {...form.getInputProps("phone")}
                    />

                    <Button fullWidth type="submit" mt="xl">
                        Tạo tài khoản
                    </Button>
                </form>
            </Paper>
        </>

    );
}
export default UserForm;