// import { useQuery } from "@tanstack/react-query";
// import { teamApi } from "../../api/teams";
// import Button from "../../components/Button";
// import { useNavigate } from "react-router-dom";
// import TeamRow from "../../components/TeamRow";

// export default function TeamsPage() {
//   const nav = useNavigate();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["teams"],
//     queryFn: teamApi.list,
//   });

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Teams</h1>

//         <Button onClick={() => nav("/teams/create")}>
//           + Create Team
//         </Button>
//       </div>

//       {/* Loading State */}
//       {isLoading && (
//         <div className="text-center text-gray-500 py-6">
//           Loading teams...
//         </div>
//       )}

//       {/* Error State */}
//       {isError && (
//         <div className="text-center text-red-600 py-6">
//           Failed to load teams.
//         </div>
//       )}

//       {/* Empty State */}
//       {data?.length === 0 && (
//         <div className="text-center text-gray-500 py-10">
//           No teams available.
//         </div>
//       )}

//       {/* Table */}
//       {data?.length > 0 && (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-left">
//             <thead>
//               <tr className="bg-gray-200 text-sm">
//                 <th className="p-3 font-semibold">Name</th>
//                 <th className="p-3 font-semibold">Description</th>
//                 <th className="p-3 font-semibold text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((team: any) => (
//                 <TeamRow key={team.id} team={team} />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


import { useQuery } from "@tanstack/react-query";
import { teamApi } from "../../api/teams";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import TeamRow from "../../components/TeamRow";
import { useMemo, useState } from "react";

export default function TeamsPage() {
  const nav = useNavigate();

  // Local UI state
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["teams"],
    queryFn: teamApi.list,
  });

  // Filter + Sort Logic
  const filtered = useMemo(() => {
    if (!data) return [];

    let result = data;

    // SEARCH
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (team: any) =>
          team.name.toLowerCase().includes(s) ||
          (team.description || "").toLowerCase().includes(s)
      );
    }

    // SORT BY NAME
    result = [...result].sort((a, b) => {
      if (sort === "asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return result;
  }, [data, search, sort]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teams</h1>

        <Button onClick={() => nav("/teams/create")}>+ Create Team</Button>
      </div>

      {/* SEARCH + SORT CONTROLS */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "asc" | "desc")}
          className="border p-2 rounded"
        >
          <option value="asc">Sort A → Z</option>
          <option value="desc">Sort Z → A</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-gray-500 py-6">
          Loading teams...
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center text-red-600 py-6">
          Failed to load teams.
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 py-10">
          No matching teams found.
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-200 text-sm">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((team: any) => (
                <TeamRow key={team.id} team={team} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
