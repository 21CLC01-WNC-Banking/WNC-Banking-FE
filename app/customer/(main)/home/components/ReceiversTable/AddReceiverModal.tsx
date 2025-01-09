"use client";

import { useState, useEffect } from "react";
import { IMaskInput } from "react-imask";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import {
    getInternalAccountOwnerThunk,
    getExternalAccountOwnerThunk,
} from "@/lib/thunks/customer/AccountThunks";
import { makeToast } from "@/lib/utils/customer";
import { addReceiverThunk, getReceiversThunk } from "@/lib/thunks/customer/ReceiversThunks";
import { getPartnerBanksThunk } from "@/lib/thunks/customer/PartnerBanksThunks";

import { Button, Group, Modal, Input, TextInput, Select, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

const AddReceiverModal = () => {
    const dispatch = useAppDispatch();
    const partnerBanks = useAppSelector((state) => state.partnerBanks.partnerBanks);

    const [opened, { open, close }] = useDisclosure(false);

    const [selectedBank, setSelectedBank] = useState("");
    const [receiverName, setReceiverName] = useState("");

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            receiverAccountNumber: "",
            receiverNickname: "",
        },
        validate: {
            receiverAccountNumber: (value) =>
                value.length < 1
                    ? "Vui lòng nhập số tài khoản người nhận"
                    : /[0-9\s]{14}/.test(value)
                    ? null
                    : "Số tài khoản người nhận không hợp lệ",
        },
        transformValues: (values) => ({
            ...values,
            receiver: values.receiverAccountNumber.split(" ").join(""),
        }),
    });

    const getReceiverName = async (account: string) => {
        try {
            let name;
            if (selectedBank === "0") {
                name = await dispatch(
                    getInternalAccountOwnerThunk({ accountNumber: account })
                ).unwrap();
            } else if (selectedBank !== "") {
                name = await dispatch(
                    getExternalAccountOwnerThunk({
                        accountNumber: account,
                        bankId: parseInt(selectedBank),
                    })
                ).unwrap();
            }

            if (name && name.length > 0) {
                setReceiverName(name);
            }
        } catch (error) {
            makeToast("error", "Truy vấn thông tin người nhận thất bại", (error as Error).message);
        }
    };

    const handleSubmit = async (values: typeof form.values) => {
        const name =
            values.receiverNickname.trim().length > 0
                ? values.receiverNickname.trim()
                : receiverName;
        try {
            await dispatch(
                addReceiverThunk({
                    bankId: selectedBank === "0" ? 0 : parseInt(selectedBank),
                    receiverAccountNumber: values.receiverAccountNumber.split(" ").join(""),
                    receiverNickname: name,
                })
            ).unwrap();

            await dispatch(getReceiversThunk()).unwrap();

            makeToast(
                "success",
                "Lưu người nhận thành công",
                "Bạn có thể điều chỉnh tên gợi nhớ trong danh sách người nhận."
            );

            handleModalClose();
        } catch (error) {
            const message = (error as Error).message;

            if (message === "receiver already exists") {
                makeToast(
                    "error",
                    "Lưu người nhận thất bại",
                    "Người nhận này đã được lưu từ trước. Vui lòng kiểm tra lại danh sách người nhận."
                );
            } else {
                makeToast("error", "Lưu người nhận thất bại", message);
            }
        }
    };

    const handleModalClose = () => {
        close();
        form.reset();
        setReceiverName("");
    };

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                await dispatch(getPartnerBanksThunk()).unwrap();
            } catch (error) {
                makeToast(
                    "error",
                    "Truy vấn danh sách ngân hàng liên kết thất bại",
                    (error as Error).message
                );
            }
        };

        fetchBanks();
    }, [dispatch]);

    return (
        <>
            <Modal
                opened={opened}
                onClose={handleModalClose}
                title="Thêm người nhận mới"
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
                    <Select
                        size="md"
                        radius="md"
                        comboboxProps={{ shadow: "md" }}
                        label="Ngân hàng của người nhận"
                        allowDeselect={false}
                        withAsterisk
                        placeholder="Chọn ngân hàng"
                        data={[
                            ...partnerBanks.map((bank) => ({
                                label: `${bank.bankName} (${bank.shortName})`,
                                value: String(bank.id),
                            })),
                            { label: "WNC Bank (nội bộ)", value: "0" },
                        ]}
                        value={selectedBank}
                        onChange={(value) => {
                            if (value) {
                                setSelectedBank(value);
                            }
                        }}
                    />

                    <Tooltip
                        label="Vui lòng chọn ngân hàng trước khi nhập số tài khoản"
                        disabled={selectedBank !== ""}
                    >
                        <Input.Wrapper
                            size="md"
                            mt="lg"
                            label="Số tài khoản người nhận"
                            error={form.errors.receiverAccountNumber}
                            withAsterisk
                        >
                            <Input
                                component={IMaskInput}
                                size="md"
                                radius="md"
                                mask="0000 0000 0000"
                                placeholder="XXXX XXXX XXXX"
                                rightSectionPointerEvents="all"
                                key={form.key("receiverAccountNumber")}
                                {...form.getInputProps("receiverAccountNumber")}
                                onBlur={(event) => {
                                    if (event.currentTarget.value.length >= 14) {
                                        form.setFieldValue(
                                            "receiverAccountNumber",
                                            event.currentTarget.value
                                        );
                                        getReceiverName(event.currentTarget.value);
                                    }
                                }}
                            />
                        </Input.Wrapper>
                    </Tooltip>

                    <TextInput
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Tên người nhận"
                        maxLength={100}
                        value={receiverName}
                        styles={{
                            root: {
                                display: receiverName.length > 0 ? "block" : "none",
                            },
                            input: {
                                color: "var(--mantine-color-blue-filled)",
                                backgroundColor: "var(--mantine-color-blue-light)",
                            },
                        }}
                        readOnly
                    />

                    <TextInput
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Tên gợi nhớ"
                        maxLength={100}
                        placeholder="Nhập tên gợi nhớ (tùy chọn)"
                        key={form.key("receiverNickname")}
                        {...form.getInputProps("receiverNickname")}
                    />

                    <Group mt="lg" justify="flex-end">
                        <Button radius="md" onClick={handleModalClose} variant="default">
                            Hủy
                        </Button>

                        <Button radius="md" type="submit" variant="filled">
                            Thêm người nhận
                        </Button>
                    </Group>
                </form>
            </Modal>

            <Button radius="md" size="md" maw={250} onClick={open}>
                Thêm người nhận mới
            </Button>
        </>
    );
};

export default AddReceiverModal;
