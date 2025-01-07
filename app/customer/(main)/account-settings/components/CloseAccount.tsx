import { Stack, Center, Title, Text } from "@mantine/core";
import ConfirmCloseAccountModal from "./ConfirmCloseAccountModal";

const CloseAccount = () => {
    return (
        <Stack gap="xl" style={{ width: "50%" }}>
            <Center>
                <Title order={2}>Đóng tài khoản</Title>
            </Center>

            <Text>
                Sau khi đóng tài khoản, bạn sẽ không thể đăng nhập bằng địa chỉ email đã dùng để tạo
                tài khoản, cũng như thực hiện bất kì giao dịch nào bằng số tài khoản được liên kết
                với tài khoản này.
            </Text>

            <ConfirmCloseAccountModal />
        </Stack>
    );
};

export default CloseAccount;
