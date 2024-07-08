// src/entities/PromptInputProps.ts
import { ResponseBody } from "./ResponseBody";

export interface PromptInputProps {
  onChatResponse: (response: ResponseBody) => void;
  model: string;
}
