import { Popover, ActionIcon, Select } from "@mantine/core";
import { IconAddressBook } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";

import { ReceiverAccount } from "@/lib/types/customer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { getReceiversThunk } from "@/lib/thunks/customer/ReceiversThunks";
import { formatAccountNumber, makeToast } from "@/lib/utils/customer";
import { useEffect } from "react";

interface SelectPopoverProps {
    form: UseFormReturnType<{
        targetAccountNumber: string;
        amount: number;
        message: string;
    }>;
}

const SelectPopover: React.FC<SelectPopoverProps> = ({ form }) => {
    const dispatch = useAppDispatch();
    const targets = useAppSelector((state) => state.receivers.receivers);

    useEffect(() => {
        const fetchReceivers = async () => {
            try {
                await dispatch(getReceiversThunk()).unwrap();
            } catch (error) {
                makeToast(
                    "error",
                    "Truy vấn danh sách người nhận thất bại",
                    (error as Error).message
                );
            }
        };

        fetchReceivers();
    }, [dispatch]);

    return (
        <Popover width={300} position="bottom" withArrow shadow="md">
            <Popover.Target>
                <ActionIcon variant="subtle" color="gray" radius="md" aria-label="Saved targets">
                    <IconAddressBook size={20} />
                </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
                <Select
                    size="md"
                    radius="md"
                    checkIconPosition="right"
                    label="Chọn tài khoản người nợ"
                    placeholder="Vui lòng chọn"
                    data={targets.map((receiver: ReceiverAccount) => ({
                        value: receiver.receiverAccountNumber,
                        label: receiver.receiverNickname,
                    }))}
                    comboboxProps={{ withinPortal: false }}
                    onChange={(value) => {
                        if (value) {
                            form.setFieldValue("target", formatAccountNumber(value));
                        }
                    }}
                />
            </Popover.Dropdown>
        </Popover>
    );
};

export default SelectPopover;
