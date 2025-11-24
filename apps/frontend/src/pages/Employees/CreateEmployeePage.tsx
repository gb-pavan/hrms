import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../../api/employees";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../../components/EmployeeForm";

export default function CreateEmployeePage() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: employeeApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      nav("/employees");
    },
  });

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Employee</h1>

      <EmployeeForm
        loading={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data)}
      />
    </div>
  );
}
