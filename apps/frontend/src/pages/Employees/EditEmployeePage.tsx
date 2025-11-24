import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../../api/employees";
import EmployeeForm from "../../components/EmployeeForm";

export default function EditEmployeePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => employeeApi.getById(id!),
  });

  const mutation = useMutation({
    mutationFn: (updatedData: any) => employeeApi.update(id!, updatedData),
    onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["employees"] });
        qc.invalidateQueries({ queryKey: ["employees",id] });
      nav("/employees");
    },
  });

  if (isLoading)
    return <div className="p-6 text-center">Loading employee data...</div>;

  if (isError)
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load employee.
      </div>
    );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Employee</h1>

      <EmployeeForm
        initial={{
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
        }}
        loading={mutation.isPending}
        onSubmit={(formData) => mutation.mutate(formData)}
      />
    </div>
  );
}
