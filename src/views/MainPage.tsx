import { useState } from "react";
import LLMDropdown from "../components/LLMDropdown";
import TokenCounter from "../components/TokenCounter";
import MainChatWindow from "../components/MainChatWindow";
import PromptInput from "../components/PromptInput";
import useFetchData from "../hooks/useFetchData"; // Import custom hook
import LLMSetting from "../components/LLMSetting";
import { ResponseBody } from "../entities/ResponseBody";

const MainPage: React.FC = () => {
  const {
    platformOptions,
    modelOptions,
    selectedPlatform,
    setSelectedPlatform,
    selectedModel,
    setSelectedModel,
  } = useFetchData(); // Destructure relevant state and setters

  const [showSettings, setShowSettings] = useState(false);
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState<number>(0); // Initialize token count state

  const handleChatResponse = (response: ResponseBody) => {
    setChatResponse(response.response.content);
    setTokenCount(response.response.response_metadata.token_usage.total_tokens); // Update token count state
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedModel(modelOptions[platform][0]); // Select the first model of the selected platform
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
  };

  const toggleSettings = () => {
    setShowSettings((prevShowSettings) => !prevShowSettings);
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center space-x-4 mt-4">
        <TokenCounter tokenCount={tokenCount} />
        <div className="flex space-x-4">
          <LLMDropdown
            options={platformOptions}
            selectedOption={selectedPlatform}
            onOptionSelect={handlePlatformSelect}
          />
          <LLMDropdown
            options={modelOptions[selectedPlatform] || []}
            selectedOption={selectedModel}
            onOptionSelect={handleModelSelect}
          />
        </div>
        <div className="relative">
          <button onClick={toggleSettings} className="w-10 h-10 rounded-full">
            <img
              src={`src/assets/${showSettings ? "minus" : "setting"}.png`}
              alt="Settings"
              className="w-8 h-8"
            />
          </button>
          {showSettings && (
            <div className="absolute top-full mt-2 left-0">
              <LLMSetting onClose={() => setShowSettings(false)} />
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-full p-10">
        <MainChatWindow response={chatResponse} />
      </div>
      <div className="w-11/12 mx-auto">
        <PromptInput
          onChatResponse={handleChatResponse}
          model={selectedModel}
        />
      </div>
    </div>
  );
};

export default MainPage;