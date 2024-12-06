import { Center, Flex, Title } from "@mantine/core";
import UserForm from "../components/UserForm";

const CreateAccount: React.FC = () => {
    return (
        <Flex direction="column">
            <Center>
                <Title my={10}>Tạo tài khoản khách hàng</Title>
            </Center>
            <UserForm />
        </Flex>
    );
}
export default CreateAccount;