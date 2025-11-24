import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "../../api/employees";
import Button from "../../components/Button";
import EmployeeRow from "../../components/EmployeeRow";
import { useNavigate } from "react-router-dom";

export default function EmployeesPage() {
  const nav = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeApi.list,
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>

        <Button onClick={() => nav("/employees/create")}>
          + Add Employee
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-gray-500">Loading employees...</div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-red-500 text-center">
          Failed to load employees.
        </div>
      )}

      {/* Empty State */}
      {data?.length === 0 && (
        <div className="text-gray-500 text-center py-10">
          No employees found.
        </div>
      )}

      {/* Table */}
      {data?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-sm">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Phone</th>
                <th className="p-3 font-semibold">Role</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((emp: any) => (
                <EmployeeRow key={emp.id} employee={emp} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
