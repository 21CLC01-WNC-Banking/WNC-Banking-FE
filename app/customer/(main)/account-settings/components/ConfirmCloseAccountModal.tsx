"use client";

import { useAppDispatch } from "@/lib/hooks/withTypes";
import { closeAccountThunk } from "@/lib/thunks/customer/AccountThunks";
import { makeToast } from "@/lib/utils/customer";

import { Modal, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const ConfirmCloseAccountModal = () => {
    const dispatch = useAppDispatch();
    const [opened, { open, close }] = useDisclosure(false);

    const handleDelete = async () => {
        try {
            await dispatch(closeAccountThunk()).unwrap();

            makeToast(
                "success",
                "Đóng tài khoản thành công",
                "Cảm ơn bạn đã tin dùng dịch vụ của WNC Bank."
            );
        } catch (error) {
            makeToast("error", "Đóng tài khoản thất bại", (error as Error).message);
        }

        close();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title="Xác nhận đóng tài khoản"
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
                Bạn có chắc chắn muốn đóng tài khoản? Vui lòng kiểm tra và rút hết số dư trước khi
                đóng tài khoản, do tài khoản không thể được khôi phục sau khi đóng.
                <Group mt="lg" justify="flex-end">
                    <Button radius="md" onClick={close} variant="default">
                        Quay lại
                    </Button>

                    <Button radius="md" onClick={handleDelete} variant="filled" color="red">
                        Xác nhận
                    </Button>
                </Group>
            </Modal>

            <Button radius="md" color="red" onClick={open}>
                Đóng tài khoản
            </Button>
        </>
    );
};

export default ConfirmCloseAccountModal;
