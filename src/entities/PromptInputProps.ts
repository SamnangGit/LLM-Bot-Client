// src/entities/PromptInputProps.ts
import { ResponseBody } from "./ResponseBody";

export interface PromptInputProps {
  onChatResponse: (response: ResponseBody) => void;
  onUserPrompt: (prompt: string) => void;
  model: string;
}
