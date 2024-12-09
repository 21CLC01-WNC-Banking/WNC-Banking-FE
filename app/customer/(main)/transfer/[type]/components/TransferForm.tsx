"use client";

import { useState } from "react";

import { useAppDispatch } from "@/lib/hooks";
import { setTransfer } from "@/lib/slices/TransferSlice";

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
    Tooltip,
    UnstyledButton,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { IconAddressBook, IconSearch } from "@tabler/icons-react";

import ClickableCard from "@/components/ClickableCard";
import TransferInfoModal from "./TransferInfoModal";

interface TransferFormProps {
    handleNextStep?: () => void;
    type: string;
}

const accounts: string[] = ["1234 5678 9012", "2345 6789 0123", "3456 7890 1234", "4567 8901 2345"];

const TransferForm: React.FC<TransferFormProps> = ({ handleNextStep, type }) => {
    const dispatch = useAppDispatch();

    const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

    const [accNum, setAccNum] = useDebouncedState("", 50, { leading: true });

    const [query, setQuery] = useState("");
    const [selectedBank, setSelectedBank] = useState("");

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            receiverAccount: "",
            amount: 0,
            message: "NGƯỜI DÙNG chuyển tiền",
        },
        validate: {
            receiverAccount: () =>
                accNum.trim().length < 1
                    ? "Vui lòng nhập số tài khoản người nhận"
                    : /[0-9\s]{14}/.test(accNum)
                    ? null
                    : "Số tài khoản người nhận không hợp lệ",
            amount: (value) => (value < 10000 ? "Số tiền cần chuyển tối thiểu là 10000 VND" : null),
            message: isNotEmpty("Vui lòng nhập nội dung chuyển khoản"),
        },
        transformValues: (values) => ({
            ...values,
            receiverAccNumber: values.receiverAccount.split(" ").join(""),
            message: values.message.trim(),
        }),
    });

    const toggleConfirmModal = () => {
        const validatedForm = form.validate();

        if (!validatedForm.hasErrors) {
            const newTransfer = {
                amount: form.getValues().amount,
                message: form.getValues().message,
                receiverAccount: form.getValues().receiverAccount,
                senderAccount: "Mặc định",
            };

            dispatch(setTransfer(newTransfer));

            openModal();
        }
    };

    const handleSubmit = () => {
        if (handleNextStep) {
            handleNextStep();
        }
    };

    const filtered = accounts.filter((account) =>
        account.toLowerCase().includes(query.toLowerCase())
    );

    const accountList = filtered.map((account) => (
        <ClickableCard
            key={account}
            title={account}
            onClick={() => {
                setAccNum(account);
                form.setFieldValue("receiverAccNumber", account);

                closeDrawer();
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

            <Fieldset radius="md" p={30} mt="xl">
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
                            withAsterisk
                            placeholder="Chọn ngân hàng"
                            data={["WNC Bank", "Vietcombank", "Techcombank", "Agribank"]}
                            onChange={(value) => {
                                if (value) {
                                    setSelectedBank(value);
                                }
                            }}
                        />
                    )}

                    <Tooltip
                        label="Vui lòng chọn ngân hàng trước khi nhập số tài khoản"
                        disabled={type === "internal" || selectedBank !== ""}
                    >
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
                                    aria-label="Saved receivers"
                                    disabled={type === "external" && selectedBank === ""}
                                    onClick={openDrawer}
                                >
                                    <IconAddressBook size={20} />
                                </ActionIcon>
                            }
                            key={form.key("receiverAccNumber")}
                            error={form.errors.receiverAccNumber}
                            value={accNum}
                            disabled={type === "external" && selectedBank === ""}
                            onChange={(event) =>
                                setAccNum(
                                    event.currentTarget.value
                                        .replace(/(\d{4})(?=\d)/g, "$1 ")
                                        .trim()
                                )
                            }
                            onBlur={(event) => {
                                form.setFieldValue("receiverAccNumber", event.currentTarget.value);
                                form.validateField("receiverAccNumber");
                            }}
                        />
                    </Tooltip>

                    <Drawer
                        offset={8}
                        radius="md"
                        opened={drawerOpened}
                        onClose={closeDrawer}
                        position="right"
                        title="Chọn tài khoản người nhận"
                        styles={{
                            title: {
                                fontWeight: 700,
                                fontSize: "var(--mantine-font-size-lg)",
                            },
                            content: {
                                paddingLeft: 20,
                                paddingRight: 20,
                                paddingTop: 10,
                            },
                        }}
                    >
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
                                {accountList}
                            </ScrollArea.Autosize>
                        </div>
                    </Drawer>

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
                        key={form.key("receiverHandlesFee")}
                        {...form.getInputProps("receiverHandlesFee")}
                    />

                    {/*Invisible button for form submission*/}
                    <UnstyledButton type="submit" id="submit-form"></UnstyledButton>

                    <Button fullWidth onClick={toggleConfirmModal} mt={40} radius="md">
                        Tiếp tục
                    </Button>
                </form>
            </Fieldset>

            <TransferInfoModal isOpen={modalOpened} onClose={closeModal} />
        </>
    );
};

export default TransferForm;
