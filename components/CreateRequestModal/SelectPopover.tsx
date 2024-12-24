import { Popover, ActionIcon, Select } from "@mantine/core";
import { IconAddressBook } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";

import { Account } from "@/lib/types";
import data from "@/lib/mock_data/accounts.json";

const targets = data.filter((receiver: Account) => receiver.bank === "WNC Bank");

interface SelectPopoverProps {
    form: UseFormReturnType<{
        target: string;
        amount: number;
        message: string;
    }>;
}

const SelectPopover: React.FC<SelectPopoverProps> = ({ form }) => {
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
                    data={targets.map((receiver: Account) => ({
                        value: receiver.accountNumber,
                        label: receiver.nickname,
                    }))}
                    comboboxProps={{ withinPortal: false }}
                    onChange={(value) => {
                        if (value) {
                            form.setFieldValue("target", value.replace(/(\d{4})/g, "$1 ").trim());
                        }
                    }}
                />
            </Popover.Dropdown>
        </Popover>
    );
};

export default SelectPopover;
