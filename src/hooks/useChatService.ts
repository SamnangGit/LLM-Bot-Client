import { useState } from "react";
import { sendChatRequest } from "../services/chatService";

const useChatService = (
  model: string,
  onChatResponse: (response: string) => void
) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (prompt: string) => {
    setLoading(true);
    try {
      const response = await sendChatRequest(model, prompt);
      onChatResponse(response.data.response.content); // Pass the response content
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};

export default useChatService;
