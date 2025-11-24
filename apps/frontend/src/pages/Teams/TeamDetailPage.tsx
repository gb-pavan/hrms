// // src/pages/Teams/TeamDetailPage.tsx

// import { useParams } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { employeeApi } from "../../api/employees"; // used for listing employees to assign
// import { useState } from "react";
// import ConfirmModal from "../../components/ConfirmModal";
// import { teamApi } from "../../api/teams";

// export default function TeamDetailPage() {
//   const { id } = useParams();
//   const qc = useQueryClient();

//   const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
//   const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

//   // 1. Fetch team details
//   const { data: team, isLoading, isError } = useQuery({
//     queryKey: ["team", id],
//     queryFn: () => teamApi.getById(id!),
//   });

//   // 2. Employees list for assigning
//   const { data: employees } = useQuery({
//     queryKey: ["employees"],
//     queryFn: () => employeeApi.list(),
//   });

//   // 3. Assign mutation
//   const assignMutation = useMutation({
//     mutationFn: (employeeId: string) => teamApi.assign(id!, employeeId),

//     onMutate: async (employeeId) => {
//       await qc.cancelQueries({queryKey:["team", id]});

//       const prev = qc.getQueryData(["team", id]);

//       qc.setQueryData(["team", id], (old: any) => {
//         if (!old) return old;
//         return {
//           ...old,
//           members: [...old.members, employees.find((e:any) => e.id === employeeId)],
//         };
//       });

//       return { prev };
//     },

//     onError: (_err, _vars, ctx) => {
//       qc.setQueryData(["team", id], ctx?.prev);
//     },

//     onSettled: () => {
//       qc.invalidateQueries({queryKey:["team", id]});
//     },
//   });

//   // 4. Remove member mutation (OPTIMISTIC)
//   const removeMutation = useMutation({
//     mutationFn: (employeeId: string) => teamApi.removeMember(id!, employeeId),

//     onMutate: async (employeeId) => {
//       setConfirmRemove(null);

//       await qc.cancelQueries({queryKey:["team", id]});

//       const prev = qc.getQueryData(["team", id]);

//       qc.setQueryData(["team", id], (old: any) => {
//         if (!old) return old;
//         return {
//           ...old,
//           members: old.members?.filter((m: any) => m.id !== employeeId),
//         };
//       });

//       return { prev };
//     },

//     onError: (_err, _vars, ctx) => {
//       qc.setQueryData(["team", id], ctx?.prev);
//     },

//     onSettled: () => {
//       qc.invalidateQueries({queryKey:["team", id]});
//     },
//   });

//   if (isLoading) return <div className="p-6">Loading team...</div>;
//   if (isError) return <div className="p-6 text-red-600">Failed to load team.</div>;

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-3xl font-bold mb-3">{team.name}</h1>
//       <p className="text-gray-700 mb-6">{team.description || "No description"}</p>

//       {/* Members List */}
//       <h2 className="text-xl font-semibold mb-3">Team Members</h2>

//       {team.members.length === 0 ? (
//         <div className="text-gray-600">No members yet.</div>
//       ) : (
//         <div className="flex flex-col gap-2 mb-6">
//           {team.members.map((m: any) => (
//             <div
//               key={m.id}
//               className="flex items-center justify-between border p-2 rounded"
//             >
//               <span>{m.name}</span>

//               <button
//                 onClick={() => setConfirmRemove(m.id)}
//                 className="text-red-600 hover:text-red-800"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Assign Member */}
//       <h2 className="text-xl font-semibold mb-3">Add Employee to Team</h2>

//       <select
//         className="border p-2 rounded"
//         onChange={(e) => setSelectedEmployee(e.target.value)}
//       >
//         <option value="">Select employee...</option>
//         {employees?.map((e: any) => (
//           <option key={e.id} value={e.id}>
//             {e.name} — {e.role}
//           </option>
//         ))}
//       </select>

//       <button
//         disabled={!selectedEmployee || assignMutation.isPending }
//         onClick={() => assignMutation.mutate(selectedEmployee!)}
//         className="ml-2 px-4 py-2 bg-blue-600 rounded text-white disabled:bg-blue-400"
//       >
//         Add
//       </button>

//       {/* Remove confirmation modal */}
//       {confirmRemove && (
//         // <ConfirmModal
//         //   message="Remove this member from the team?"
//         //   onCancel={() => setConfirmRemove(null)}
//         //   onConfirm={() => removeMutation.mutate(confirmRemove)}
//         // />
//         <ConfirmModal
//   open={!!confirmRemove}
//   title="Remove Team Member"
//   message="Are you sure you want to remove this member from the team?"
//   onCancel={() => setConfirmRemove(null)}
//   onConfirm={() => removeMutation.mutate(confirmRemove!)}
// />

//       )}
//     </div>
//   );
// }


// src/pages/Teams/TeamDetailPage.tsx

import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../../api/employees";
import { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { teamApi } from "../../api/teams";

export default function TeamDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();

  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  // 1. Fetch team
  const { data: team, isLoading, isError } = useQuery({
    queryKey: ["team", id],
    queryFn: () => teamApi.getById(id!),
  });

  // 2. Employees list
  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: () => employeeApi.list(),
  });

  // 3. Assign Mutation (Optimistic)
  const assignMutation = useMutation({
    mutationFn: (employeeId: string) => teamApi.assign(id!, employeeId),

    onMutate: async (employeeId) => {
      await qc.cancelQueries({ queryKey: ["team", id] });

      const prev = qc.getQueryData(["team", id]);

      qc.setQueryData(["team", id], (old: any) => {
        if (!old) return old;

        const emp = employees?.find((e: any) => e.id === employeeId);
        if (!emp) return old;

        return {
          ...old,
          members: [...old.members, emp],
        };
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      qc.setQueryData(["team", id], ctx?.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["team", id] });
    },
  });

  // 4. Remove Member Mutation (Optimistic)
  const removeMutation = useMutation({
    mutationFn: (employeeId: string) =>
      teamApi.removeMember(id!, employeeId),

    onMutate: async (employeeId) => {
      setConfirmRemove(null);

      await qc.cancelQueries({ queryKey: ["team", id] });

      const prev = qc.getQueryData(["team", id]);

      qc.setQueryData(["team", id], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          members: old.members.filter((m: any) => m.id !== employeeId),
        };
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      qc.setQueryData(["team", id], ctx?.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["team", id] });
    },
  });

  // 5. Page Loading/Error
  if (isLoading) return <div className="p-6">Loading team...</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load team.</div>;

  // Pre-calc members list safely
  const members = team?.members || [];

  // Filter employees that are not yet in the team
  const assignableEmployees =
    employees?.filter(
      (emp: any) => !members.some((m: any) => m.id === emp.id)
    ) || [];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-3">{team.name}</h1>
      <p className="text-gray-700 mb-6">
        {team.description || "No description"}
      </p>

      {/* ------------------------------------------------ */}
      {/* TEAM MEMBERS */}
      {/* ------------------------------------------------ */}
      <h2 className="text-xl font-semibold mb-3">Team Members</h2>

      {members.length === 0 ? (
        <div className="text-gray-600">No members yet.</div>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {members.map((m: any) => (
            <div
              key={m.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <span>{m.name}</span>

              <button
                onClick={() => setConfirmRemove(m.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* ASSIGN EMPLOYEE */}
      {/* ------------------------------------------------ */}
      <h2 className="text-xl font-semibold mb-3">Add Employee to Team</h2>

      <div className="flex gap-3 items-center">
        <select
          className="border p-2 rounded flex-1"
          value={selectedEmployee || ""}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select employee...</option>

          {assignableEmployees.map((emp: any) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} — {emp.role}
            </option>
          ))}
        </select>

        <button
          disabled={!selectedEmployee || assignMutation.isPending}
          onClick={() => assignMutation.mutate(selectedEmployee!)}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-300"
        >
          {assignMutation.isPending ? "Assigning..." : "Assign"}
        </button>
      </div>

      {/* ------------------------------------------------ */}
      {/* REMOVE CONFIRM MODAL */}
      {/* ------------------------------------------------ */}
      <ConfirmModal
        open={!!confirmRemove}
        title="Remove Team Member"
        message="Are you sure you want to remove this member from the team?"
        onCancel={() => setConfirmRemove(null)}
        onConfirm={() => removeMutation.mutate(confirmRemove!)}
      />
    </div>
  );
}
