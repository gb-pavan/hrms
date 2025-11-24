import { api } from "./client";

export const organisationApi = {
  create: (data: { name: string }) =>
    api.post("/organisation", data).then((res) => res.data),

  getMyOrganisation: () =>
    api.get("/organisation/me").then((res) => res.data),
};
