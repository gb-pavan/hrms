// import { useNavigate } from "react-router-dom";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { employeeApi } from "../api/employees";

// export default function EmployeeRow({ employee }: { employee: any }) {
//   const nav = useNavigate();
//   const qc = useQueryClient();

//   const deleteMutation = useMutation({
//     mutationFn: () => employeeApi.remove(employee.id),
//     onSuccess: () => {
//     //   qc.invalidateQueries(["employees"]);
//     qc.invalidateQueries({ queryKey: ["employees"] });
//     },
//   });

//   return (
//     <tr className="border-b hover:bg-gray-50">
//       <td className="p-3">{employee.name}</td>
//       <td className="p-3">{employee.email}</td>
//       <td className="p-3">{employee.phone || "-"}</td>
//       <td className="p-3 capitalize">{employee.role}</td>

//       <td className="p-3 text-right">
//         <button
//           className="text-blue-600 mr-4 hover:underline"
//           onClick={() => nav(`/employees/edit/${employee.id}`)}
//         >
//           Edit
//         </button>

//         <button
//           className="text-red-600 hover:underline"
//           onClick={() => {
//             if (confirm("Are you sure?")) {
//               deleteMutation.mutate();
//             }
//           }}
//         >
//           Delete
//         </button>
//       </td>
//     </tr>
//   );
// }


// import { useNavigate } from "react-router-dom";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { employeeApi } from "../api/employees";
// import { useState } from "react";
// import ConfirmModal from "./ConfirmModal";

// export default function EmployeeRow({ employee }: { employee: any }) {
//   const nav = useNavigate();
//   const qc = useQueryClient();
//   const [open, setOpen] = useState(false);

//   // const deleteMutation = useMutation({
//   //   mutationFn: () => employeeApi.remove(employee.id),
//   //   onSuccess: () => {
//   //     qc.invalidateQueries({ queryKey: ["employees"] });
//   //     setOpen(false);
//   //   },
//   // });
// const deleteMutation = useMutation({
//   mutationFn: () => employeeApi.remove(employee.id),

//   // Optimistic update
//   onMutate: async () => {
//     setOpen(false); 

//     qc.cancelQueries({ queryKey: ["employees"] });

//     const prev = qc.getQueryData(["employees"]);

//     qc.setQueryData(["employees"], (old: any[] | undefined) => {
//       if (!old) return [];
//       return old.filter((e) => e.id !== employee.id);
//     });

//     return { prev };
//   },

//   // If failed, rollback
//   onError: (_err, _vars, ctx) => {
//     qc.setQueryData(["employees"], ctx?.prev);
//   },

//   // Always refetch
//   onSettled: () => {
//     qc.invalidateQueries({ queryKey: ["employees"] });
//   },
// });

//   return (
//     <>
//       <tr className="border-b hover:bg-gray-50">
//         <td className="p-3">{employee.name}</td>
//         <td className="p-3">{employee.email}</td>
//         <td className="p-3">{employee.phone || "-"}</td>
//         <td className="p-3 capitalize">{employee.role}</td>

//         <td className="p-3 text-right">
//           <button
//             className="text-blue-600 mr-4 hover:underline"
//             onClick={() => nav(`/employees/edit/${employee.id}`)}
//           >
//             Edit
//           </button>

//           <button
//             className="text-red-600 hover:underline"
//             onClick={() => setOpen(true)}
//           >
//             Delete
//           </button>
//         </td>
//       </tr>

//       <ConfirmModal
//         open={open}
//         title="Delete Employee"
//         message={`Are you sure you want to delete ${employee.name}?`}
//         onCancel={() => setOpen(false)}
//         onConfirm={() => deleteMutation.mutate()}
//       />
//     </>
//   );
// }

import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api/employees";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function EmployeeRow({ employee }: { employee: any }) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => employeeApi.remove(employee.id),

    // OPTIONAL: Optimistic update (remove instantly)
    onMutate: async () => {
      setOpen(false);

      await qc.cancelQueries({queryKey:["employees"]});

      const previous = qc.getQueryData(["employees"]);

      qc.setQueryData(["employees"], (old: any[] | undefined) => {
        if (!old) return [];
        return old.filter((e) => e.id !== employee.id);
      });

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      // rollback on error
      if (ctx?.previous) {
        qc.setQueryData(["employees"], ctx.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({queryKey:["employees"]
      }
      );
    },
  });

  return (
    <>
      <tr className="border-b hover:bg-gray-50">
        {/* Clickable Name -> Go to details page */}
        <td
          className="p-3 text-blue-600 hover:underline cursor-pointer"
          onClick={() => nav(`/employees/${employee.id}`)}
        >
          {employee.name}
        </td>

        <td className="p-3">{employee.email}</td>
        <td className="p-3">{employee.phone || "-"}</td>
        <td className="p-3 capitalize">{employee.role}</td>

        <td className="p-3 text-right">
          {/* Edit Button */}
          <button
            className="text-blue-600 mr-4 hover:underline"
            onClick={() => nav(`/employees/edit/${employee.id}`)}
          >
            Edit
          </button>

          {/* Delete Button */}
          <button
            className="text-red-600 hover:underline"
            onClick={() => setOpen(true)}
          >
            Delete
          </button>
        </td>
      </tr>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={open}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.name}?`}
        onCancel={() => setOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </>
  );
}
