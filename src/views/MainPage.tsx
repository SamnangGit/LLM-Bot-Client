import React, { useState, useCallback, useEffect } from "react";
import LLMDropdown from "../components/LLMDropdown";
import TokenCounter from "../components/TokenCounter";
import MainChatWindow from "../components/MainChatWindow";
import PromptInput from "../components/PromptInput";
import useFetchData from "../hooks/useFetchData";
import LLMSetting from "../components/LLMSetting";
import { ResponseBody } from "../entities/ResponseBody";
import { SettingItems } from "../entities/SettingItems";

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
  const [loading, setLoading] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<SettingItems[]>([]);

  // Initialize settings when the component mounts or when the platform changes
  useEffect(() => {
    const supportedSettings = Object.keys(platformSettings).filter((setting) =>
      platformSettings[setting].includes(
        `${selectedPlatform.toLowerCase()}_platform`
      )
    );

    const initialSettings: SettingItems[] = supportedSettings.map((setting) => {
      switch (setting) {
        case "Temperature":
          return { name: "Temperature", value: 0.5, min: 0, max: 1 };
        case "Top_P":
          return { name: "Top P", value: 0.5, min: 0, max: 1 };
        case "Top_K":
          return { name: "Top K", value: 50000, min: 0, max: 100000 };
        default:
          return { name: setting, value: 0, min: 0, max: 1 };
      }
    });

    setCurrentSettings(initialSettings);
  }, [selectedPlatform, platformSettings]);

  const handleChatResponse = (response: ResponseBody) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "assistant", content: response.response.content },
    ]);
    setTokenCount(response.response.response_metadata.token_usage.total_tokens);
    setLoading(false);
  };

  const handleUserPrompt = (prompt: string) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: prompt },
    ]);
    setLoading(true);
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

  const handleSettingsChange = useCallback((newSettings: SettingItems[]) => {
    setCurrentSettings(newSettings);
    console.log("Updated settings:", newSettings);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4">
        <div className="hidden lg:block">
          <TokenCounter tokenCount={tokenCount} />
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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

        <div className="relative hidden lg:block">
          <button onClick={toggleSettings} className="w-10 h-10 rounded-full">
            <img
              src={`src/assets/${showSettings ? "minus" : "setting"}.png`}
              alt="Settings"
              className="w-8 h-8"
            />
          </button>
          {showSettings && (
            <div className="absolute top-full mt-2 right-0 sm:right-auto sm:left-0 z-10">
              <LLMSetting
                onClose={() => setShowSettings(false)}
                platformSettings={platformSettings}
                selectedPlatform={selectedPlatform}
                onSettingsChange={handleSettingsChange}
                initialSettings={currentSettings}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-auto p-4 sm:p-6 md:p-8 lg:p-10">
        <MainChatWindow chatHistory={chatHistory} loading={loading} />
      </div>

      <div className="w-full p-4">
        <PromptInput
          onChatResponse={handleChatResponse}
          onUserPrompt={handleUserPrompt}
          model={selectedModel}
          settings={currentSettings}
        />
      </div>
    </div>
  );
};

export default MainPage;
