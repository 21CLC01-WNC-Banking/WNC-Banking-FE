import { useState } from "react";

import { Popover, ActionIcon, Select } from "@mantine/core";
import { IconAddressBook } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";

import { ReceiverAccount } from "@/lib/types/customer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/withTypes";
import { getReceiversThunk } from "@/lib/thunks/customer/ReceiversThunks";
import { formatAccountNumber, makeToast } from "@/lib/utils/customer";
import { useEffect } from "react";
import { setFilteredReceivers } from "@/lib/slices/customer/ReceiversSlice";

interface SelectPopoverProps {
    form: UseFormReturnType<{
        targetAccountNumber: string;
        amount: number;
        message: string;
    }>;
    onSelect: (value: string) => void;
}

const SelectPopover: React.FC<SelectPopoverProps> = ({ form, onSelect }) => {
    const dispatch = useAppDispatch();
    const targets = useAppSelector((state) => state.receivers.filteredReceivers);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReceivers = async () => {
            setIsLoading(true);

            try {
                await dispatch(getReceiversThunk()).unwrap();

                dispatch(setFilteredReceivers(0));
            } catch (error) {
                makeToast(
                    "error",
                    "Truy vấn danh sách người nhận thất bại",
                    (error as Error).message
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchReceivers();
    }, [dispatch]);

    return (
        <Popover width={300} position="bottom" withArrow shadow="md">
            <Popover.Target>
                <ActionIcon
                    maw="md"
                    variant="subtle"
                    color="gray"
                    radius="md"
                    aria-label="Saved targets"
                >
                    <IconAddressBook size={20} />
                </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
                <Select
                    size="md"
                    radius="md"
                    checkIconPosition="right"
                    label="Chọn tài khoản người nợ"
                    placeholder={isLoading ? "Đang truy vấn danh sách..." : "Vui lòng chọn"}
                    disabled={isLoading}
                    data={targets.map((receiver: ReceiverAccount) => ({
                        value: receiver.receiverAccountNumber,
                        label: receiver.receiverNickname,
                    }))}
                    comboboxProps={{ withinPortal: false }}
                    onChange={(value) => {
                        if (value) {
                            form.setFieldValue("targetAccountNumber", formatAccountNumber(value));
                            onSelect(formatAccountNumber(value));
                        }
                    }}
                />
            </Popover.Dropdown>
        </Popover>
    );
};

export default SelectPopover;
