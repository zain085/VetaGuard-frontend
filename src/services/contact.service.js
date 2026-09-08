import api from "./api";

export const contactService = {
  submit: (payload) => api.post("/contact", payload).then((r) => r.data),
};
