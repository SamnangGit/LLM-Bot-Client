export const createRequestBody = (model: string, prompt: string) => {
  return {
    model: model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
    top_p: 0.5,
    top_k: 0,
  };
};
