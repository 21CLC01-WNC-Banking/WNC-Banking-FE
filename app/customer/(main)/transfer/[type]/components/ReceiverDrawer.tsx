import { useEffect, useState } from "react";

import { useAppSelector, useAppDispatch } from "@/lib/hooks/withTypes";
import { formatAccountNumber, makeToast } from "@/lib/utils/customer";
import { getReceiversThunk } from "@/lib/thunks/customer/ReceiversThunks";

import { Drawer, TextInput, ScrollArea, ActionIcon, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAddressBook, IconSearch } from "@tabler/icons-react";

import ClickableCard from "@/components/ClickableCard";
import { setFilteredReceivers } from "@/lib/slices/customer/ReceiversSlice";

interface ReceiverDrawerProps {
    formHandler: (account: string) => void;
    type: string;
    selectedBank: string;
    onSelect: (account: string) => void;
}

const ReceiverDrawer: React.FC<ReceiverDrawerProps> = ({
    formHandler,
    type,
    selectedBank,
    onSelect,
}) => {
    const dispatch = useAppDispatch();
    const accounts = useAppSelector((state) => state.receivers.filteredReceivers);

    console.log(accounts);

    const [opened, { open, close }] = useDisclosure(false);

    const [query, setQuery] = useState("");

    const filtered = accounts.filter((account) =>
        Object.values(account).some((value) =>
            String(value).toLowerCase().includes(query.toLowerCase().trim())
        )
    );

    const accountList = filtered.map((account) => (
        <ClickableCard
            key={account.receiverAccountNumber}
            title={account.receiverNickname}
            subtitle={
                type === "internal"
                    ? [formatAccountNumber(account.receiverAccountNumber)]
                    : [account.bankShortName, formatAccountNumber(account.receiverAccountNumber)]
            }
            onClick={() => {
                formHandler(formatAccountNumber(account.receiverAccountNumber));
                onSelect(formatAccountNumber(account.receiverAccountNumber));
                close();
            }}
        />
    ));

    useEffect(() => {
        const fetchReceivers = async () => {
            try {
                await dispatch(getReceiversThunk()).unwrap();

                if (type === "internal" || type === "debt-payment") {
                    dispatch(setFilteredReceivers(0));
                } else {
                    dispatch(setFilteredReceivers(parseInt(selectedBank)));
                }
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
        <>
            <ActionIcon
                maw="md"
                variant="subtle"
                color="gray"
                radius="md"
                aria-label="Saved receivers"
                disabled={type === "external" && selectedBank === "0"}
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
                        {accounts.length === 0 ? (
                            <Text ta="center">Bạn chưa lưu người nhận nào</Text>
                        ) : accountList.length === 0 ? (
                            <Text ta="center">Không tìm thấy người nhận</Text>
                        ) : (
                            accountList
                        )}
                    </ScrollArea.Autosize>
                </div>
            </Drawer>
        </>
    );
};

export default ReceiverDrawer;
