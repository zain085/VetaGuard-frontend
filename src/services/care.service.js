import api from "./api";

export const careService = {
  list: (params) => api.get("/articles", { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/articles/${slug}`).then((r) => r.data),
};

export const reminderService = {
  list: (params) => api.get("/reminders", { params }).then((r) => r.data),
  create: (payload) => api.post("/reminders", payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/reminders/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/reminders/${id}`).then((r) => r.data),
};

export const notificationService = {
  list: (params) => api.get("/notifications", { params }).then((r) => r.data),
  markRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.patch("/notifications/read-all").then((r) => r.data),
};

export const reviewService = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`).then((r) => r.data),
  createProductReview: (payload) => api.post("/reviews/product", payload).then((r) => r.data),
  getVetReviews: (vetUserId) => api.get(`/reviews/vet/${vetUserId}`).then((r) => r.data),
  createVetReview: (payload) => api.post("/reviews/vet", payload).then((r) => r.data),
};
