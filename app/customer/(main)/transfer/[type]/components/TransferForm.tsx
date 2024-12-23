"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { setTransfer } from "@/lib/slices/TransferSlice";
import { setFilteredReceivers } from "@/lib/slices/ReceiversSlice";

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
    Input,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IMaskInput } from "react-imask";
import { IconAddressBook, IconSearch } from "@tabler/icons-react";

import ClickableCard from "@/components/ClickableCard";
import TransferInfoModal from "./TransferInfoModal";

interface TransferFormProps {
    handleNextStep?: () => void;
    type: string;
}

const TransferForm: React.FC<TransferFormProps> = ({ handleNextStep, type }) => {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();

    const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

    const [query, setQuery] = useState("");
    const [selectedBank, setSelectedBank] = useState(
        type === "internal" ? "WNC Bank" : searchParams.get("at") || ""
    );

    const accounts = useAppSelector((state) => state.receivers.filteredReceivers);

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            receiverAccount: searchParams.get("to") || "",
            amount: 0,
            message: "NGƯỜI DÙNG chuyển tiền",
            receiverHandlesFee: false,
        },
        validate: {
            receiverAccount: (value) =>
                value.length < 1
                    ? "Vui lòng nhập số tài khoản người nhận"
                    : /[0-9\s]{14}/.test(value)
                    ? null
                    : "Số tài khoản người nhận không hợp lệ",
            amount: (value) => (value < 10000 ? "Số tiền cần chuyển tối thiểu là 10000 VND" : null),
            message: isNotEmpty("Vui lòng nhập nội dung chuyển khoản"),
        },
        transformValues: (values) => ({
            ...values,
            receiverAccount: values.receiverAccount.split(" ").join(""),
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
                receiverBank: type === "internal" ? "WNC Bank" : selectedBank,
                senderAccount: "Mặc định",
                senderHandlesFee: !form.getValues().receiverHandlesFee,
            };

            dispatch(setTransfer(newTransfer));

            openModal();
        }
    };

    const filtered = accounts.filter((account) =>
        Object.values(account).some((value) =>
            String(value).toLowerCase().includes(query.toLowerCase().trim())
        )
    );

    const accountList = filtered.map((account) => (
        <ClickableCard
            key={account.name}
            title={account.nickname}
            subtitle={
                type === "internal"
                    ? [account.name, account.accountNumber]
                    : [account.name, account.bank, account.accountNumber]
            }
            onClick={() => {
                form.setFieldValue(
                    "receiverAccount",
                    account.accountNumber.replace(/(\d{4})/g, "$1 ").trim()
                );
                closeDrawer();
            }}
        />
    ));

    useEffect(() => {
        dispatch(setFilteredReceivers(selectedBank));
    }, [dispatch, selectedBank]);

    return (
        <>
            <Fieldset radius="md" p={30} mt="xl">
                <Center mb="xl">
                    <Title order={2}>
                        Chuyển khoản {type === "internal" ? "nội bộ" : "liên ngân hàng"}
                    </Title>
                </Center>

                <form
                    onSubmit={form.onSubmit(() => {
                        if (handleNextStep) {
                            handleNextStep();
                        }
                    })}
                >
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
                                    backgroundColor: "var(--mantine-color-blue-light)",
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
                            data={["Vietcombank", "Techcombank", "Agribank"]}
                            value={selectedBank}
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
                        <Input.Wrapper
                            size="md"
                            mt="lg"
                            label="Số tài khoản người nhận"
                            description="Để xem danh sách người nhận không thuộc ngân hàng đã chọn, hãy chọn ngân hàng khác ở danh sách bên trên"
                            withAsterisk
                        >
                            <Input
                                component={IMaskInput}
                                size="md"
                                radius="md"
                                mask="0000 0000 0000"
                                placeholder="XXXX XXXX XXXX"
                                rightSectionPointerEvents="all"
                                error={form.errors.receiverAccount}
                                key={form.key("receiverAccount")}
                                {...form.getInputProps("receiverAccount")}
                                disabled={type === "external" && selectedBank === ""}
                                rightSection={
                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        radius="md"
                                        aria-label="Saved receivers"
                                        disabled={type === "external" && selectedBank === ""}
                                        onClick={openDrawer}
                                    >
                                        <IconAddressBook size={20} />
                                    </ActionIcon>
                                }
                                onChange={(event) => console.log(event.currentTarget.value)}
                            />
                        </Input.Wrapper>
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
