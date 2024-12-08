"use client";

import { useState } from "react";

import {
    Button,
    Center,
    Checkbox,
    NumberInput,
    Select,
    Textarea,
    TextInput,
    Title,
    Fieldset,
    ActionIcon,
    Drawer,
    ScrollArea,
    Group,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { IconAddressBook, IconSearch } from "@tabler/icons-react";

import ClickableCard from "@/components/ClickableCard";

interface TransferFormProps {
    handleNextStep?: () => void;
    type: string;
}

const accounts: string[] = ["1234 5678 9012", "2345 6789 0123", "3456 7890 1234", "4567 8901 2345"];

const TransferForm: React.FC<TransferFormProps> = ({ handleNextStep, type }) => {
    const [opened, { open, close }] = useDisclosure(false);

    const [accNum, setAccNum] = useDebouncedState("", 50, { leading: true });

    const [query, setQuery] = useState("");
    const [selectedBank, setSelectedBank] = useState("");

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            recipientAccNumber: "",
            amount: 10000,
            message: "Chuyển tiền cơm gà (?)",
            recipientHandlesFee: false,
            recipientNickname: "",
        },
        validate: {
            recipientAccNumber: () =>
                accNum.trim().length < 1
                    ? "Vui lòng nhập số tài khoản người nhận"
                    : /[0-9\s]{14}/.test(accNum)
                    ? null
                    : "Số tài khoản người nhận không hợp lệ",
            amount: (value) => (value < 10000 ? "Số tiền cần chuyển phải lớn hơn 10000 VND" : null),
            message: isNotEmpty("Vui lòng nhập nội dung chuyển khoản"),
        },
        transformValues: (values) => ({
            ...values,
            recipientAccNumber: values.recipientAccNumber.split(" ").join(""),
            message: values.message.trim(),
        }),
    });

    const handleSubmit = (values: typeof form.values) => {
        const transferForm = document.getElementById("transfer-form");

        if (transferForm) {
            (transferForm as HTMLFieldSetElement).disabled = true;
        }

        console.log(values);

        if (handleNextStep) {
            handleNextStep();
        }
    };

    const filtered = accounts.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

    const items = filtered.map((item) => (
        <ClickableCard
            key={item}
            title={item}
            onClick={() => {
                setAccNum(item);
                form.setFieldValue("recipientAccNumber", item);
                close();
            }}
        />
    ));

    return (
        <>
            <Center mt="xl">
                <Title order={2}>
                    Chuyển khoản {type === "internal" ? "nội bộ" : "liên ngân hàng"}
                </Title>
            </Center>

            <Fieldset id="transfer-form" variant="unstyled" mt="xl">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Group grow gap="xl">
                        <Select
                            size="md"
                            radius="md"
                            comboboxProps={{ shadow: "md" }}
                            label="Tài khoản nguồn"
                            withAsterisk
                            allowDeselect={false}
                            defaultValue="Mặc định"
                            data={["Mặc định"]}
                        />

                        <TextInput
                            size="md"
                            radius="md"
                            label="Số dư tài khoản"
                            value="120,000,000 VND"
                            styles={{
                                input: {
                                    color: "var(--mantine-color-blue-filled)",
                                    "background-color": "var(--mantine-color-blue-light)",
                                },
                            }}
                            readOnly
                        />
                    </Group>

                    {type === "external" && (
                        <Select
                            size="md"
                            radius="md"
                            mt="lg"
                            comboboxProps={{ shadow: "md" }}
                            label="Ngân hàng của người nhận"
                            allowDeselect={false}
                            placeholder="Chọn ngân hàng"
                            data={["WNC Bank", "Vietcombank", "Techcombank", "Agribank"]}
                            onChange={(value) => {
                                if (value) {
                                    setSelectedBank(value);
                                }
                            }}
                        />
                    )}

                    <TextInput
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Số tài khoản người nhận"
                        maxLength={14}
                        withAsterisk
                        placeholder="XXXX XXXX XXXX"
                        rightSection={
                            <ActionIcon
                                variant="filled"
                                radius="md"
                                aria-label="Saved recipients"
                                disabled={type === "external" && selectedBank === ""}
                                onClick={open}
                            >
                                <IconAddressBook size={20} />
                            </ActionIcon>
                        }
                        key={form.key("recipientAccNumber")}
                        error={form.errors.recipientAccNumber}
                        value={accNum}
                        disabled={type === "external" && selectedBank === ""}
                        onChange={(event) =>
                            setAccNum(
                                event.currentTarget.value.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
                            )
                        }
                        onBlur={(event) => {
                            form.setFieldValue("recipientAccNumber", event.currentTarget.value);
                            form.validateField("recipientAccNumber");
                        }}
                    />

                    <Drawer.Root
                        offset={8}
                        radius="md"
                        opened={opened}
                        onClose={close}
                        position="right"
                    >
                        <Drawer.Overlay />
                        <Drawer.Content p={16}>
                            <Drawer.Header>
                                <Drawer.Title>Chọn tài khoản người nhận</Drawer.Title>
                                <Drawer.CloseButton />
                            </Drawer.Header>
                            <Drawer.Body>
                                <TextInput
                                    value={query}
                                    onChange={(event) => {
                                        setQuery(event.currentTarget.value);
                                    }}
                                    leftSection={<IconSearch size={20} />}
                                    placeholder="Tìm kiếm"
                                />
                                <div>
                                    <ScrollArea.Autosize mah="75vh" type="always" mt="md">
                                        {items}
                                    </ScrollArea.Autosize>
                                </div>
                            </Drawer.Body>
                        </Drawer.Content>
                    </Drawer.Root>

                    <NumberInput
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Số tiền cần chuyển"
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
                        label="Nội dung chuyển khoản"
                        withAsterisk
                        placeholder="Người dùng chuyển tiền"
                        autosize
                        minRows={2}
                        maxRows={4}
                        key={form.key("message")}
                        {...form.getInputProps("message")}
                    />

                    <Checkbox
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Người nhận chịu phí"
                        description="Nếu không chọn, người gửi tiền sẽ thanh toán phí chuyển khoản"
                        key={form.key("recipientHandlesFee")}
                        {...form.getInputProps("recipientHandlesFee")}
                    />

                    <Button fullWidth type="submit" mt={40} radius="md">
                        Tiếp tục
                    </Button>
                </form>
            </Fieldset>
        </>
    );
};

export default TransferForm;
