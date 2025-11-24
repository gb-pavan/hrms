import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "../../api/teams";
import { useNavigate } from "react-router-dom";
import TeamForm from "../../components/TeamForm";

export default function CreateTeamPage() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: teamApi.create,
    onSuccess: () => {
      qc.invalidateQueries({queryKey:["teams"]});
      nav("/teams");
    },
  });

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Team</h1>

      <TeamForm
        loading={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data)}
      />
    </div>
  );
}
