import api from "./api";

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard").then((r) => r.data),

  listUsers: (params) => api.get("/admin/users", { params }).then((r) => r.data),
  setUserStatus: (id, isActive) => api.patch(`/admin/users/${id}/status`, { isActive }).then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),

  listVets: () => api.get("/admin/vets").then((r) => r.data),
  approveVet: (id) => api.patch(`/admin/vets/${id}/approve`).then((r) => r.data),
  suspendVet: (id) => api.patch(`/admin/vets/${id}/suspend`).then((r) => r.data),

  listShelters: () => api.get("/admin/shelters").then((r) => r.data),
  approveShelter: (id) => api.patch(`/admin/shelters/${id}/approve`).then((r) => r.data),
  suspendShelter: (id) => api.patch(`/admin/shelters/${id}/suspend`).then((r) => r.data),

  listReviews: (type) => api.get("/admin/reviews", { params: { type } }).then((r) => r.data),
  moderateReview: (id, type, isApproved) =>
    api.patch(`/admin/reviews/${id}/moderate`, { isApproved }, { params: { type } }).then((r) => r.data),
  deleteReview: (id, type) => api.delete(`/admin/reviews/${id}`, { params: { type } }).then((r) => r.data),
};

export const adminProductService = {
  create: (payload) => api.post("/products", payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/products/${id}`, payload).then((r) => r.data),
  delete: (id) => api.delete(`/products/${id}`).then((r) => r.data),
};

export const adminCategoryService = {
  create: (payload) => api.post("/categories", payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/categories/${id}`, payload).then((r) => r.data),
  delete: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};

export const adminArticleService = {
  create: (payload) => api.post("/articles", payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/articles/${id}`, payload).then((r) => r.data),
  delete: (id) => api.delete(`/articles/${id}`).then((r) => r.data),
};
