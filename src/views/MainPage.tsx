import { useState } from "react";
import LLMDropdown from "../components/LLMDropdown";
import TokenCounter from "../components/TokenCounter";
import MainChatWindow from "../components/MainChatWindow";
import PromptInput from "../components/PromptInput";
import useFetchData from "../hooks/useFetchData";
import LLMSetting from "../components/LLMSetting";
import { ResponseBody } from "../entities/ResponseBody";

const MainPage: React.FC = () => {
  const {
    platformOptions,
    modelOptions,
    selectedPlatform,
    platformSettings,
    setSelectedPlatform,
    selectedModel,
    setSelectedModel,
  } = useFetchData();

  const [showSettings, setShowSettings] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [tokenCount, setTokenCount] = useState<number>(0);

  const handleChatResponse = (response: ResponseBody) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "assistant", content: response.response.content },
    ]);
    setTokenCount(response.response.response_metadata.token_usage.total_tokens);
  };

  const handleUserPrompt = (prompt: string) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: prompt },
    ]);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    const selectedModels = modelOptions.platforms[platform];
    if (selectedModels) {
      setSelectedModel(selectedModels[0]);
    }
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
            options={modelOptions.platforms[selectedPlatform] || []}
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
              <LLMSetting
                onClose={() => setShowSettings(false)}
                platformSettings={platformSettings}
                selectedPlatform={selectedPlatform}
              />
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-full p-10">
        <MainChatWindow chatHistory={chatHistory} />
      </div>
      <div className="w-11/12 mx-auto">
        <PromptInput
          onChatResponse={handleChatResponse}
          onUserPrompt={handleUserPrompt}
          model={selectedModel}
        />
      </div>
    </div>
  );
};

export default MainPage;
