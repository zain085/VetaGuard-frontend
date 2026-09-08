import api from "./api";

export const categoryService = {
  list: () => api.get("/categories").then((r) => r.data),
};

export const productService = {
  list: (params) => api.get("/products", { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/products/${slug}`).then((r) => r.data),
};

export const cartService = {
  get: () => api.get("/cart").then((r) => r.data),
  addItem: (product, quantity = 1) => api.post("/cart/items", { product, quantity }).then((r) => r.data),
  updateItem: (productId, quantity) =>
    api.patch(`/cart/items/${productId}`, { quantity }).then((r) => r.data),
  removeItem: (productId) => api.delete(`/cart/items/${productId}`).then((r) => r.data),
  clear: () => api.delete("/cart").then((r) => r.data),
};
