import axios from "axios";
import { createRequestBody } from "../requests/requestBody";

export const sendChatRequest = (model: string, prompt: string) => {
  const requestBody = createRequestBody(model, prompt);
  return axios.post("http://127.0.0.1:8000/chat/custom", requestBody);
};

export const getLLMPlatforms = () => {
  return axios.get("http://127.0.0.1:8000/platforms");
};
