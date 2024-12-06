"use client";

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
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDebouncedState } from "@mantine/hooks";

interface TransferFormProps {
    handleNextStep?: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ handleNextStep }) => {
    const [accNum, setAccNum] = useDebouncedState("", 50, { leading: true });

    const form = useForm({
        mode: "uncontrolled",
        validateInputOnBlur: true,
        initialValues: {
            recipientAccNumber: "",
            amount: 10000,
            message: "Chuyển tiền cơm gà (?)",
            recipientHandlesFee: false,
            saveRecipientInfo: false,
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

    return (
        <>
            <Center mt="xl">
                <Title order={2}>Chuyển khoản</Title>
            </Center>

            <Fieldset id="transfer-form" variant="unstyled" mt="xl">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        size="md"
                        radius="md"
                        comboboxProps={{ shadow: "md" }}
                        label="Chọn tài khoản nguồn"
                        withAsterisk
                        allowDeselect={false}
                        defaultValue="Mặc định"
                        data={["Mặc định"]}
                    />

                    <TextInput
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Số tài khoản người nhận"
                        maxLength={14}
                        withAsterisk
                        placeholder="XXXX XXXX XXXX"
                        key={form.key("recipientAccNumber")}
                        error={form.errors.recipientAccNumber}
                        value={accNum}
                        onChange={(event) =>
                            setAccNum(
                                event.currentTarget.value.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
                            )
                        }
                        onBlur={(event) => {
                            form.setFieldValue("recipientAccNumber", event.currentTarget.value);
                            form.validateField("recipientAccNumber");
                            console.log(form.errors);
                        }}
                    />

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

                    <Checkbox
                        size="md"
                        radius="md"
                        mt="lg"
                        label="Lưu thông tin người nhận"
                        key={form.key("saveRecipientInfo")}
                        {...form.getInputProps("saveRecipientInfo")}
                    />

                    <Button fullWidth type="submit" mt="xl" radius="md">
                        Tiếp tục
                    </Button>
                </form>
            </Fieldset>
        </>
    );
};

export default TransferForm;
