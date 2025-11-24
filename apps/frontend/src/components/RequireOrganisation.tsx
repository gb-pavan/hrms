import { useQuery } from "@tanstack/react-query";
import { organisationApi } from "../api/organisation";
import { Navigate } from "react-router-dom";

export default function RequireOrganisation({ children }: { children: JSX.Element }) {
  const { data, isLoading } = useQuery({
    queryKey: ["my-org"],
    queryFn: organisationApi.getMyOrganisation,
  });

  if (isLoading) return <div>Loading...</div>;

  // user has no organisation
  if (!data || !data.id) return <Navigate to="/setup-organisation" replace />;

  return children;
}
