import api from "./api";

export const shelterService = {
  list: (params) => api.get("/shelters", { params }).then((r) => r.data),
  getById: (id) => api.get(`/shelters/${id}`).then((r) => r.data),
  getMine: () => api.get("/shelters/me").then((r) => r.data),
  upsertMine: (payload) => api.put("/shelters/me", payload).then((r) => r.data),
};

export const shelterPetService = {
  list: (params) => api.get("/shelter-pets", { params }).then((r) => r.data),
  getById: (id) => api.get(`/shelter-pets/${id}`).then((r) => r.data),
  listMine: () => api.get("/shelter-pets/mine").then((r) => r.data),
  create: (payload) => api.post("/shelter-pets", payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/shelter-pets/${id}`, payload).then((r) => r.data),
  updateStatus: (id, adoptionStatus) =>
    api.patch(`/shelter-pets/${id}/status`, { adoptionStatus }).then((r) => r.data),
  remove: (id) => api.delete(`/shelter-pets/${id}`).then((r) => r.data),
};

export const adoptionService = {
  apply: (payload) => api.post("/adoptions", payload).then((r) => r.data),
  mine: () => api.get("/adoptions/mine").then((r) => r.data),
  forShelter: (params) => api.get("/adoptions/shelter", { params }).then((r) => r.data),
  updateStatus: (id, payload) => api.patch(`/adoptions/${id}/status`, payload).then((r) => r.data),
  withdraw: (id) => api.patch(`/adoptions/${id}/withdraw`).then((r) => r.data),
};
