import api from "./api";

export const chatbotService = {
  sendMessage: (message, history) =>
    api.post("/chatbot/message", { message, history }).then((r) => r.data),
};
