// src/pages/Teams/EditTeamPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TeamForm from "../../components/TeamForm";
import { teamApi } from "../../api/teams";

export default function EditTeamPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();

  // 1. Fetch team by ID
  const { data, isLoading, isError } = useQuery({
    queryKey: ["team", id],
    queryFn: () => teamApi.getById(id!),
  });

  // 2. Update mutation
  const mutation = useMutation({
    mutationFn: (updatedData: any) => teamApi.update(id!, updatedData),
    onSuccess: () => {
      // refresh list + current team
      qc.invalidateQueries({ queryKey: ["teams"] });
      qc.invalidateQueries({ queryKey: ["team", id] });

      nav("/teams");
    },
  });

  // 3. Loading states
  if (isLoading)
    return <div className="p-6 text-center">Loading team data...</div>;

  if (isError)
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load team.
      </div>
    );

  // 4. Prefill + form
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Team</h1>

      <TeamForm
        initial={{
          name: data.name,
          description: data.description,
        }}
        loading={mutation.isPending}
        onSubmit={(formData) => mutation.mutate(formData)}
      />
    </div>
  );
}
