import axios from "axios";
import { createRequestBody } from "../requests/requestBody";

export const sendChatRequest = (model: string, prompt: string) => {
  const requestBody = createRequestBody(model, prompt);
  return axios.post("http://localhost:8000/chat/custom", requestBody, {withCredentials: true});
};

export const getLLMPlatforms = () => {
  return axios.get("http://localhost:8000/platforms", {withCredentials: true});
};

