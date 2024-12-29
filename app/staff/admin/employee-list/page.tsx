import { Paper, Center, Title, Stack } from "@mantine/core";
import EmployeeListTable from "../components/EmployeeTable";

const EmployeeList: React.FC = () => {
    return (
        <Stack>
            <Center>
                <Title order={2}>Danh sách nhân viên</Title>
            </Center>
            <Paper withBorder mx={40} radius="md" p={30} mt={30}>
                <EmployeeListTable />
            </Paper>
        </Stack>

    );
};
export default EmployeeList;
