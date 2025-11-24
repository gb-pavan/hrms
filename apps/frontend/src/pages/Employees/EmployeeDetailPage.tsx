import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../../api/employees";
import ConfirmModal from "../../components/ConfirmModal";
import { useState } from "react";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => employeeApi.getById(id!),
  });

  const deleteMutation = useMutation({
    mutationFn: () => employeeApi.remove(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      nav("/employees");
    },
  });

  if (isLoading)
    return <div className="p-6 text-center">Loading employee...</div>;

  if (isError)
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load employee.
      </div>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>

      <div className="bg-white shadow-md rounded-lg p-6 border">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{data.name}</h2>
          <p className="text-gray-600">{data.role}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p>
            <span className="font-semibold">Email:</span> {data.email}
          </p>

          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {data.phone || "-"}
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => nav(`/employees/edit/${data.id}`)}
          >
            Edit
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={() => setOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={open}
        title="Delete Employee"
        message={`Are you sure you want to delete ${data.name}?`}
        onCancel={() => setOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}
