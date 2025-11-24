import { api } from "./client";

export const teamApi = {
  list: () => api.get("/team").then((res) => res.data),

  create: (data: { name: string; description?: string }) =>
    api.post("/team", data).then((res) => res.data),

  update: (id: string, data: any) =>
    api.put(`/team/${id}`, data).then((res) => res.data),

  remove: (id: string) =>
    api.delete(`/team/${id}`).then((res) => res.data),

  getById: (id: string) =>
    api.get(`/team/${id}`).then((res) => res.data),

  assign: (teamId: string, employeeId: string) =>
    api.post(`/team/${teamId}/assign`, { employeeId }).then((res) => res.data),

  removeMember: (teamId: string, employeeId: string) =>
    api.post(`/team/${teamId}/remove`, { employeeId }).then((res) => res.data),
};
