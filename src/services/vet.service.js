import api from "./api";

export const vetService = {
  list: (params) => api.get("/vets", { params }).then((r) => r.data),
  getById: (id) => api.get(`/vets/${id}`).then((r) => r.data),
  getSlots: (id, date) => api.get(`/vets/${id}/slots`, { params: { date } }).then((r) => r.data),
  getMyProfile: () => api.get("/vets/me").then((r) => r.data),
  upsertMyProfile: (payload) => api.put("/vets/me", payload).then((r) => r.data),
};

export const appointmentService = {
  create: (payload) => api.post("/appointments", payload).then((r) => r.data),
  list: (params) => api.get("/appointments", { params }).then((r) => r.data),
  getById: (id) => api.get(`/appointments/${id}`).then((r) => r.data),
  updateStatus: (id, payload) => api.patch(`/appointments/${id}/status`, payload).then((r) => r.data),
  cancel: (id, cancellationReason) =>
    api.patch(`/appointments/${id}/cancel`, { cancellationReason }).then((r) => r.data),
};
