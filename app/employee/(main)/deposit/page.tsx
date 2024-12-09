import { Flex, Title, Center } from "@mantine/core";
import DepositForm from "../components/DepositForm";

const Deposit: React.FC = () => {
    return (
        <Flex direction="column">
            <Center>
                <Title my={10}>NẠP TIỀN VÀO TÀI KHOẢN</Title>
            </Center>
            <DepositForm />
        </Flex>
    );
}
export default Deposit;