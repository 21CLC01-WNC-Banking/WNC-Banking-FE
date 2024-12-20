import { Center, Stack, Title } from "@mantine/core";
import UserForm from "../components/UserForm";

const CreateAccount: React.FC = () => {
    return (
        <Stack mx={120}>
            <Center>
                <Title order={2}>Tạo tài khoản khách hàng</Title>
            </Center>
            <UserForm />
        </Stack>
    );
};
export default CreateAccount;
