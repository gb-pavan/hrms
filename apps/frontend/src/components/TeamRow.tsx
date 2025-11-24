import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "../api/teams";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

export default function TeamRow({ team }: { team: any }) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  // const deleteMutation = useMutation({
  //   mutationFn: () => teamApi.remove(team.id),
  //   onSuccess: () => {
  //     qc.invalidateQueries({queryKey:["teams"]});
  //     setOpen(false);
  //   },
  // });
const deleteMutation = useMutation({
  mutationFn: () => teamApi.remove(team.id),

  // OPTIMISTIC UPDATE (added)
  onMutate: async () => {
    setOpen(false); // close modal

    await qc.cancelQueries({queryKey:["teams"]});

    const prev = qc.getQueryData(["teams"]);

    // remove instantly from UI
    qc.setQueryData(["teams"], (old: any[] | undefined) => {
      if (!old) return [];
      return old.filter((t) => t.id !== team.id);
    });

    return { prev };
  },

  // ROLLBACK (added)
  onError: (_err, _vars, ctx) => {
    qc.setQueryData(["teams"], ctx?.prev);
  },

  // FINALIZE (kept your original behavior)
  onSettled: () => {
    qc.invalidateQueries({ queryKey: ["teams"] });
  },
});

  return (
    <>
      <tr className="border-b hover:bg-gray-50">
        <td
          className="p-3 text-blue-600 cursor-pointer hover:underline"
          onClick={() => nav(`/teams/${team.id}`)}
        >
          {team.name}
        </td>

        <td className="p-3">{team.description || "-"}</td>

        <td className="p-3 text-right">
          <button
            className="text-blue-600 mr-4 hover:underline"
            onClick={() => nav(`/teams/edit/${team.id}`)}
          >
            Edit
          </button>

          <button
            className="text-red-600 hover:underline"
            onClick={() => setOpen(true)}
          >
            Delete
          </button>
        </td>
      </tr>

      <ConfirmModal
        open={open}
        title="Delete Team"
        message={`Are you sure you want to delete the team "${team.name}"?`}
        onCancel={() => setOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </>
  );
}
