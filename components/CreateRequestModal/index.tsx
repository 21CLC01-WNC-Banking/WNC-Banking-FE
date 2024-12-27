"use client";

import {
    Button,
    NumberInput,
    Textarea,
    Group,
    Modal,
    Input,
    ActionIcon,
    Tooltip,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IMaskInput } from "react-imask";

import { IconMessageDollar } from "@tabler/icons-react";

import SelectPopover from "./SelectPopover";

interface CreateModalProps {
    targetAccountNumber?: string;
    targetName?: string;
    isFromReceiversList: boolean;
}

const CreateRequestModal: React.FC<CreateModalProps> = ({
    targetAccountNumber,
    targetName,
    isFromReceiversList,
}) => {
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            targetAccountNumber: targetAccountNumber || "",
            amount: 0,
            message: "Nhắc ĐỐI TƯỢNG trả nợ ngày DD/MM/YYYY",
        },
        validate: {
            targetAccountNumber: (value) =>
                value.length < 1
                    ? "Vui lòng nhập số tài khoản người nhận"
                    : /[0-9\s]{14}/.test(value)
                    ? null
                    : "Số tài khoản người nhận không hợp lệ",
            amount: (value) => (value < 10000 ? "Số tiền nợ tối thiểu là 10000 VND" : null),
            message: isNotEmpty("Vui lòng nhập nội dung nhắc nợ"),
        },
        transformValues: (values) => ({
            ...values,
            target: values.targetAccountNumber.split(" ").join(""),
            message: values.message.trim(),
        }),
    });

    const handleSubmit = (values: typeof form.values) => {
        console.log(values);
        close();
        form.reset();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title="Tạo nhắc nợ mới"
                radius="md"
                centered
                styles={{
                    title: {
                        fontWeight: 700,
                        fontSize: "var(--mantine-font-size-lg)",
                    },
                    content: {
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                    },
                }}
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Input.Wrapper size="md" mt="lg" label="Số tài khoản người nợ" withAsterisk>
                        <Input
                            component={IMaskInput}
                            size="md"
                            radius="md"
                            mask="0000 0000 0000"
                            placeholder="XXXX XXXX XXXX"
                            rightSectionPointerEvents="all"
                            error={form.errors.target}
                            key={form.key("target")}
                            {...form.getInputProps("target")}
                            rightSection={<SelectPopover form={form} />}
                        />
                    </Input.Wrapper>

                    <NumberInput
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Số tiền nợ"
                        withAsterisk
                        allowNegative={false}
                        allowDecimal={false}
                        thousandSeparator=","
                        suffix=" VND"
                        key={form.key("amount")}
                        {...form.getInputProps("amount")}
                    />

                    <Textarea
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Nội dung nhắc nợ"
                        withAsterisk
                        placeholder="Nhắc trả nợ ngày DD/MM/YYYY"
                        autosize
                        minRows={2}
                        maxRows={4}
                        key={form.key("message")}
                        {...form.getInputProps("message")}
                    />

                    <Group mt="lg" justify="flex-end">
                        <Button onClick={close} variant="default">
                            Hủy
                        </Button>

                        <Button type="submit" variant="filled">
                            Tạo nhắc nợ
                        </Button>
                    </Group>
                </form>
            </Modal>

            {isFromReceiversList ? (
                <Tooltip label="Nhắc nợ">
                    <ActionIcon variant="subtle" color="blue" onClick={open}>
                        <IconMessageDollar size={20} />
                    </ActionIcon>
                </Tooltip>
            ) : (
                <Button size="md" radius="md" maw={200} onClick={open}>
                    Tạo nhắc nợ mới
                </Button>
            )}
        </>
    );
};

export default CreateRequestModal;
