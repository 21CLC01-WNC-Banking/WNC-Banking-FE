"use client";
import { IconEdit, IconTrash, IconUserPlus } from "@tabler/icons-react";
import { Paper, Table, Text, Pagination, Center, Button, Flex } from "@mantine/core";
import { useState, useEffect } from "react";
import { chunk } from "../../../../lib/utils/staff";
import { Employee } from "@/lib/types/staff";
import EditEmployeeModal from "./EditEmployeeModal";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { showNotification } from "@mantine/notifications";
import EmployeeForm from "./EmployeeForm";


const EmployeeListTable: React.FC = () => {

    // Handle get all employees
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [error, setError] = useState<string>("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`${apiUrl}/admin/staff`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );
                if (response.ok) {
                    setError("");
                    const data = await response.json();
                    setEmployees(data.data);
                } else {
                    setEmployees([]);
                }
            } catch (error) {
                setError("Đã xảy ra lỗi kết nối với máy chủ");
                setEmployees([]);
            }
        };
        fetchEmployees();
    }, [employees]);

    // Handle add a new employee
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    //Handle delete selected employee
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const handleDelete = async () => {
        if (!employeeToDelete) return;

        try {
            const response = await fetch(`${apiUrl}/admin/staff/${employeeToDelete.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                showNotification({
                    title: "Thành công",
                    message: "Xóa tài khoản nhân viên thành công!",
                    color: "green",
                    position: "bottom-right",
                });
                // Cập nhật danh sách nhân viên sau khi xóa
                setEmployees((prev) =>
                    prev.filter((employee) => employee.id !== employeeToDelete.id)
                );
            }
            else {
                showNotification({
                    title: "Lỗi",
                    message: "Đã xảy ra lỗi khi xóa tài khoản nhân viên!",
                    color: "red",
                    position: "bottom-right"
                })
            }
        } catch (err) {
            showNotification({
                title: "Lỗi",
                message: "Đã xảy ra lỗi kết nối với máy chủ!",
                color: "red",
                position: "bottom-right"
            })
        } finally {
            setEmployeeToDelete(null);
            setIsDeleteDialogOpen(false);
        }
    };


    // Handle edit employee
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const handleSave = (updatedEmployee: Employee) => {
        setEmployees((prev) =>
            prev.map((emp) =>
                emp.id === updatedEmployee.id ? updatedEmployee : emp
            )
        );
    };

    // State for filters and pagination
    const [activePage, setActivePage] = useState<number>(1);

    // Chunk the filtered employees into pages (5 items per page)
    const paginatedEmployees = chunk(employees, 5);

    const totalPages = paginatedEmployees.length;
    useEffect(() => {
        if (activePage > totalPages && totalPages > 0) {
            setActivePage(totalPages); // Adjust to the last page
        } else if (activePage === 0 && totalPages > 0) {
            setActivePage(1); // Reset to the first page
        }
    }, [employees]);

    // Get current page employees
    const currentPageEmployees = paginatedEmployees[activePage - 1] || [];


    // Create table rows for current page
    const rows = currentPageEmployees.map((employee, index) => (
        <Table.Tr key={index}>
            <Table.Td>{employee.id}</Table.Td>
            <Table.Td>{employee.name}</Table.Td>
            <Table.Td>{employee.email}</Table.Td>
            <Table.Td>{employee.phoneNumber}</Table.Td>
            <Table.Td>
                <Button
                    onClick={() => {
                        setSelectedEmployee(employee);
                        setIsEditModalOpen(true);
                    }}>
                    <IconEdit />
                </Button>
            </Table.Td>
            <Table.Td>
                <Button
                    bg="red"
                    onClick={() => {
                        setEmployeeToDelete(employee);
                        setIsDeleteDialogOpen(true);
                    }}
                >
                    <IconTrash />
                </Button>
            </Table.Td>
        </Table.Tr >
    ));

    return (
        <Paper radius="md" mt="lg" p="lg">
            <Flex justify="flex-end">
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <IconUserPlus />
                    Thêm mới nhân viên
                </Button>
            </Flex>

            {/* Table */}
            {employees.length === 0 ? (
                <Center mt="xl" bg="red.3">
                    <Text size="sm">
                        {error ? error : "Chưa có nhân viên nào!"}
                    </Text>
                </Center>)
                :
                (<Table verticalSpacing="sm" mt="xl" striped>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>ID</Table.Th>
                            <Table.Th>Họ Tên</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Số Điện Thoại</Table.Th>
                            <Table.Th>Chỉnh Sửa</Table.Th>
                            <Table.Th>Xóa</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows}
                    </Table.Tbody>
                </Table>)
            }

            {/* Pagination */}
            <Center>
                <Pagination
                    total={paginatedEmployees.length}
                    value={activePage}
                    onChange={setActivePage}
                    mt="xl"
                />
            </Center>

            <EmployeeForm
                opened={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={(newEmployee: Employee) => {
                    setEmployees((prev) => [newEmployee, ...prev]);
                }}
            />

            <EditEmployeeModal
                employee={selectedEmployee}
                opened={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
            />

            <ConfirmDeleteDialog
                opened={isDeleteDialogOpen}
                onConfirm={handleDelete}
                onCancel={() => {
                    setEmployeeToDelete(null);
                    setIsDeleteDialogOpen(false);
                }}
                employee={employeeToDelete}
            />
        </Paper>
    );
};

export default EmployeeListTable;
