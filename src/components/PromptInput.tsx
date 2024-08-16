import React from "react";
import { PromptInputProps } from "../entities/PromptInputProps";
import usePromptInput from "../hooks/usePromptInput";
import useChatService from "../hooks/useChatService";
import arrowUpImage from "../assets/arrow-up-50.png";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the loading spinner component

const PromptInput: React.FC<PromptInputProps> = ({
  onChatResponse,
  onUserPrompt,
  model,
}) => {
  const {
    prompt,
    setPrompt,
    inputHeight,
    inputRef,
    handlePromptChange,
    handleKeyPress,
  } = usePromptInput();
  const { handleSubmit, loading } = useChatService(model, onChatResponse);

  const handleFormSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    onUserPrompt(prompt); // Notify MainPage of the user prompt
    setPrompt(""); // Clear the input before the request
    await handleSubmit(prompt);
    setPrompt(""); // Clear the input after the request
  };

  return (
    <div className="relative">
      <form onSubmit={handleFormSubmit} className="bg-white rounded-xl p-2">
        <textarea
          ref={inputRef}
          style={{
            minHeight: "40px",
            maxHeight: "120px",
            height: `${inputHeight}px`,
          }} // Min and max height settings
          value={prompt}
          onChange={handlePromptChange}
          onKeyPress={(e) => handleKeyPress(e, handleFormSubmit)}
          placeholder="Type your prompt here"
          className="w-full p-2 text-black text-xl font-['Arial'] bg-transparent border-none focus:outline-none resize-none"
        />
        <button
          type="submit"
          className="absolute top-0 right-0 mt-2 mr-2 bg-yellow-400 p-3 rounded-xl active:bg-yellow-500"
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center h-6 w-6">
              <LoadingSpinner /> {/* Render LoadingSpinner when loading */}
            </div>
          ) : (
            <img src={arrowUpImage} className="h-6 w-6" alt="Send" />
          )}
        </button>
      </form>
    </div>
  );
};

export default PromptInput;
