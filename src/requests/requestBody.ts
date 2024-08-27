import { SettingItems } from "../entities/SettingItems";

export const createRequestBody = (model: string, prompt: string, settings: SettingItems[]) => {
  // Create a map of setting names to their values for easy lookup
  const settingsMap = new Map(settings.map(setting => [setting.name, setting.value]));

  return {
    model: model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: settingsMap.get("Temperature") ?? 0.5,
    top_p: settingsMap.get("Top P") ?? 0.5,
    top_k: settingsMap.get("Top K") ?? 50000,
  };
};