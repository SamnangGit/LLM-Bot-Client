import axios from "axios";
import { createRequestBody } from "../requests/requestBody";
import { SettingItems } from "../entities/SettingItems";

export const sendChatRequest = (model: string, prompt: string, settings: SettingItems[]) => {
  const requestBody = createRequestBody(model, prompt, settings);
  console.log("Setting: ", settings);
  return axios.post("http://localhost:8000/chat/custom", requestBody, {withCredentials: true});
};

export const getLLMPlatforms = () => {
  return axios.get("http://localhost:8000/platforms", {withCredentials: true});
};

