"use client";

import { Button, Fieldset, TextInput } from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";

const UserForm: React.FC = () => {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            phone: "",
            email: "",
        },
        validate: {
            name: isNotEmpty("Vui lòng nhập họ tên"),
            email: isEmail("Vui lòng nhập email hợp lệ"),
            phone: (value) =>
                /^(?:\+84|0)(?:\d){9}$/.test(value) ? null : "Vui lòng nhập số điện thoại hợp lệ",
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        console.log(values);
    };

    return (
        <>
            <Fieldset radius="md" p={30} mt="lg">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        size="md"
                        radius="md"
                        label="Họ tên"
                        required
                        placeholder="Nguyễn Văn A"
                        key={form.key("name")}
                        {...form.getInputProps("name")}
                    />

                    <TextInput
                        size="md"
                        radius="md"
                        label="Địa chỉ email"
                        required
                        placeholder="you@wnc.bank"
                        mt="lg"
                        key={form.key("email")}
                        {...form.getInputProps("email")}
                    />

                    <TextInput
                        size="md"
                        radius="md"
                        label="Số điện thoại"
                        required
                        placeholder="0123456789"
                        mt="lg"
                        key={form.key("phone")}
                        {...form.getInputProps("phone")}
                    />

                    <Button fullWidth type="submit" radius="md" mt={40}>
                        Tạo tài khoản
                    </Button>
                </form>
            </Fieldset>
        </>
    );
};
export default UserForm;
