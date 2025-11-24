import { api } from "./client";

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data).then((res) => res.data),

  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data).then((res) => res.data),
};
