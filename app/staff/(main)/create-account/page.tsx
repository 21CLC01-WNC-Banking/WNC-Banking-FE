import { Center, Stack, Title } from "@mantine/core";
import UserForm from "../components/UserForm";

const CreateAccount: React.FC = () => {
    return (
        <Stack mx="mx" style={{ minWidth: "1100px" }}>
            <Center>
                <Title order={2}>Tạo tài khoản khách hàng</Title>
            </Center>
            <UserForm />
        </Stack>
    );
};
export default CreateAccount;
