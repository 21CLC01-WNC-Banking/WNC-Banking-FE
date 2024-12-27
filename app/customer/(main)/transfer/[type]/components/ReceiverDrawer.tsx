import { useAppSelector } from "@/lib/hooks/withTypes";
import ClickableCard from "@/components/ClickableCard";
import { Drawer, TextInput, ScrollArea, ActionIcon } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconAddressBook, IconSearch } from "@tabler/icons-react";
import { useState } from "react";

interface ReceiverDrawerProps {
    form: UseFormReturnType<
        {
            receiverAccount: string;
            amount: number;
            message: string;
            receiverHandlesFee: boolean;
        },
        (values: {
            receiverAccount: string;
            amount: number;
            message: string;
            receiverHandlesFee: boolean;
        }) => {
            sourceAccountNumber: string;
            targetAccountNumber: string;
            amount: number;
            isSourceFee: boolean;
            description: string;
            type: string;
        }
    >;
    type: string;
    selectedBank: string;
    onSelectReceiver: (account: string) => void;
}

const ReceiverDrawer: React.FC<ReceiverDrawerProps> = ({
    form,
    type,
    selectedBank,
    onSelectReceiver,
}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [query, setQuery] = useState("");

    const accounts = useAppSelector((state) => state.receivers.filteredReceivers);

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
                onSelectReceiver(account.accountNumber.replace(/(\d{4})/g, "$1 ").trim());
                close();
            }}
        />
    ));

    return (
        <>
            <ActionIcon
                variant="subtle"
                color="gray"
                radius="md"
                aria-label="Saved receivers"
                disabled={type === "external" && selectedBank === ""}
                onClick={open}
            >
                <IconAddressBook size={20} />
            </ActionIcon>

            <Drawer
                offset={8}
                radius="md"
                opened={opened}
                onClose={close}
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
        </>
    );
};

export default ReceiverDrawer;
