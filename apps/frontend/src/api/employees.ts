import { api } from "./client";

export const employeeApi = {
  list: () => api.get("/employee").then((res) => res.data),

  create: (data: {
    name: string;
    email: string;
    phone?: string;
    role?: string;
  }) => api.post("/employee", data).then((res) => res.data),

  update: (id: string, data: any) =>
    api.put(`/employee/${id}`, data).then((res) => res.data),

  remove: (id: string) =>
    api.delete(`/employee/${id}`).then((res) => res.data),

  getById: (id: string) =>
    api.get(`/employee/${id}`).then((res) => res.data),
};
