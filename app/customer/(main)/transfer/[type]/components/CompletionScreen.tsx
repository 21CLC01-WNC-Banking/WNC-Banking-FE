"use client";

import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { formatCurrency, makeToast } from "@/lib/utils/customer";
import { resetTransfer } from "@/lib/slices/customer/TransferSlice";
import { addReceiverThunk } from "@/lib/thunks/customer/ReceiversThunks";
import { resetFilter } from "@/lib/slices/customer/ReceiversSlice";

import {
    Button,
    Center,
    Title,
    Checkbox,
    Group,
    TextInput,
    Fieldset,
    Stack,
    Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const CompletionScreen = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const transfer = useAppSelector((state) => state.transfer.currentTransfer);

    const [displayNickname, setDisplayNickname] = useState(false);

    const content = [
        { label: "Tài khoản nguồn", value: [transfer?.senderAccount, transfer?.senderName] },
        { label: "Nguời nhận", value: [transfer?.receiverAccount, transfer?.receiverName] },
        { label: "Số tiền", value: [formatCurrency(transfer ? transfer.amount : 0)] },
        { label: "Diễn giải", value: [transfer?.message] },
        {
            label: "Phí giao dịch",
            value: [
                formatCurrency(transfer ? transfer.transferFee : 0),
                transfer?.senderHandlesFee ? "" : "(người nhận trả phí)",
            ],
        },
    ];

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            nickname: "",
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        if (displayNickname) {
            const name =
                values.nickname.trim().length > 0
                    ? values.nickname.trim()
                    : transfer
                    ? transfer.receiverName
                    : "<chưa có tên gợi nhớ>";
            try {
                await dispatch(
                    addReceiverThunk({
                        bankId: transfer?.receiverBankId || 0,
                        receiverAccountNumber: transfer?.receiverAccount.split(" ").join("") || "",
                        receiverNickname: name,
                    })
                ).unwrap();

                makeToast(
                    "success",
                    "Lưu người nhận thành công",
                    "Bạn có thể kiểm tra lại thông tin người nhận tại Trang chủ."
                );

                dispatch(resetTransfer());
                dispatch(resetFilter());

                router.push("/customer/home");
            } catch (error) {
                const message = (error as Error).message;

                if (message === "receiver already exists") {
                    makeToast(
                        "error",
                        "Lưu người nhận thất bại",
                        "Người nhận này đã được lưu từ trước. Vui lòng kiểm tra lại ở Trang chủ."
                    );
                } else {
                    makeToast("error", "Lưu người nhận thất bại", message);
                }
            }
        } else {
            makeToast(
                "success",
                "Chuyển khoản hoàn tất",
                "Bạn có thể kiểm tra lại thông tin giao dịch tại Trang chủ."
            );

            dispatch(resetTransfer());
            router.push("/customer/home");
        }
    };

    return (
        <Fieldset radius="md" p={30} mt="xl">
            <Center>
                <Title order={2}>Chuyển khoản thành công</Title>
            </Center>

            <Stack my={20} gap="md">
                {content.map((item) => (
                    <Group
                        key={item.label}
                        grow
                        preventGrowOverflow={false}
                        justify="between"
                        align="flex-start"
                    >
                        <Text variant="text">{item.label}</Text>

                        <Stack gap={0}>
                            {item.value.map((value, index) => (
                                <Text key={index} ta="right" fw={700}>
                                    {value}
                                </Text>
                            ))}
                        </Stack>
                    </Group>
                ))}

                <Group grow preventGrowOverflow={false} justify="between" align="flex-start">
                    <Text fw={600}>Tổng số tiền</Text>
                    <Text ta="right" fw={700} fz="h3" c="blue">
                        {transfer?.senderHandlesFee
                            ? formatCurrency(transfer ? transfer.amount + transfer.transferFee : 0)
                            : formatCurrency(transfer ? transfer.amount : 0)}
                    </Text>
                </Group>
            </Stack>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Group grow gap="xl" my="xl">
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
    );
};

export default CompletionScreen;
