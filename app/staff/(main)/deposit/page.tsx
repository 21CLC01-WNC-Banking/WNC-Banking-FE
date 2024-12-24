import { Stack, Title, Center } from "@mantine/core";
import DepositForm from "../components/DepositForm";

const Deposit: React.FC = () => {
    return (
        <Stack mx="sm" style={{ maxWidth: 1000, minWidth: 1000 }}>
            <Center>
                <Title order={2}>Nạp tiền vào tài khoản</Title>
            </Center>
            <DepositForm />
        </Stack>

    );
};
export default Deposit;
