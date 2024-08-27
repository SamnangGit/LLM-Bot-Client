// src/entities/PromptInputProps.ts
import { ResponseBody } from "./ResponseBody";
import { SettingItems } from "./SettingItems";

export interface PromptInputProps {
  onChatResponse: (response: ResponseBody) => void;
  onUserPrompt: (prompt: string) => void;
  model: string;
  settings: SettingItems[];
}
