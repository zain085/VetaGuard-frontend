import api from "./api";

export const petService = {
  list: (params) => api.get("/pets", { params }).then((r) => r.data),
  getById: (id) => api.get(`/pets/${id}`).then((r) => r.data),
  create: (payload) => api.post("/pets", payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/pets/${id}`, payload).then((r) => r.data),
  archive: (id) => api.delete(`/pets/${id}`).then((r) => r.data),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api
      .post(`/pets/${id}/image`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  },
  getTimeline: (id) => api.get(`/pets/${id}/timeline`).then((r) => r.data),
  listVaccinations: (id) => api.get(`/pets/${id}/vaccinations`).then((r) => r.data),
  addVaccination: (id, payload) => api.post(`/pets/${id}/vaccinations`, payload).then((r) => r.data),
  listMedicalRecords: (id, params) =>
    api.get(`/pets/${id}/medical-records`, { params }).then((r) => r.data),
};
