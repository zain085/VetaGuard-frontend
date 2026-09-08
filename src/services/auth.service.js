import api from "./api";

export const authService = {
  register: (payload) => api.post("/auth/register", payload).then((r) => r.data),
  login: (payload) => api.post("/auth/login", payload).then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
  getMe: () => api.get("/auth/me").then((r) => r.data),
  updateProfile: (payload) => api.patch("/auth/profile", payload).then((r) => r.data),
  changePassword: (payload) => api.patch("/auth/change-password", payload).then((r) => r.data),
};
