import { Center, Stack, Title } from "@mantine/core";
import UserForm from "../components/UserForm";
import ProtectedRoute from "../components/ProtectedRoute";

const CreateAccount: React.FC = () => {
    return (
        <ProtectedRoute>
            <Stack mx="mx" style={{ minWidth: "1100px" }}>
                <Center>
                    <Title order={2}>Tạo tài khoản khách hàng</Title>
                </Center>
                <UserForm />
            </Stack>
        </ProtectedRoute>
    );
};
export default CreateAccount;
