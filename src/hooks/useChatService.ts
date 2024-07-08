import { useState } from "react";
import { sendChatRequest } from "../services/chatService";
import { ResponseBody } from "../entities/ResponseBody";

const useChatService = (
  model: string,
  onChatResponse: (response: ResponseBody) => void
) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (prompt: string) => {
    setLoading(true);
    try {
      const response = await sendChatRequest(model, prompt);
      const responseBody: ResponseBody = response.data;
      onChatResponse(responseBody); // Pass the entire response body
      console.log("Response:", responseBody);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};

export default useChatService;
