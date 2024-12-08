import React, { useState, useEffect, useCallback } from "react";
import LLMDropdown from "../components/LLMDropdown";
import TokenCounter from "../components/TokenCounter";
import MainChatWindow from "../components/MainChatWindow";
import PromptInput from "../components/PromptInput";
import useFetchData from "../hooks/useFetchData";
import LLMSetting from "../components/LLMSetting";
import { ResponseBody } from "../entities/ResponseBody";
import { SettingItems } from "../entities/SettingItems";
import AuthPopup from "../components/AuthPopup";
import { jwtDecode } from "jwt-decode";
import Button from "../components/Button";

interface DecodedToken {
  username: string;
  email: string;
}

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

  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<SettingItems[]>([]);

  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);

  // Handle platform and settings initialization
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
  }, []);

  const handlePlatformOpen = () => {
    setIsPlatformOpen(!isPlatformOpen);
  };

  const handleLoginSuccess = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUsername(decoded.username);
      setAuthToken(token);
      localStorage.setItem("token", token); // Store token for future requests
    } catch (error) {
      console.error("Failed to decode JWT", error);
    }
  };

  const handleLogout = () => {
    setUsername(null);
    setAuthToken(null);
    localStorage.removeItem("token"); // Remove token on logout
  };

  const handleAuthPopupClose = () => {
    setShowAuthPopup(false);
  };

  const handleWelcomeClick = () => {
    setShowLogoutDropdown((prev) => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        setUsername(decoded.username);
        setAuthToken(token);
      } catch (error) {
        console.error("Invalid token in local storage", error);
      }
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4">
        <div className="hidden lg:block">
          <TokenCounter tokenCount={tokenCount} />
        </div>

        <div className="relative w-full sm:w-auto">
          <button
            onClick={handlePlatformOpen}
            className="p-2 focus:outline-none lg:hidden"
            aria-label="Toggle Settings"
          >
            <div className="w-6 h-6 flex flex-col justify-around">
              <div className="w-6 h-0.5 bg-gray-600 rounded-full"></div>
              <div className="w-6 h-0.5 bg-gray-600 rounded-full"></div>
              <div className="w-6 h-0.5 bg-gray-600 rounded-full"></div>
            </div>
          </button>
          <div
            className={`sm:flex ${
              isPlatformOpen ? "block" : "hidden"
            } flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0`}
          >
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

        <div className="flex items-center">
          <Button
            text={username ? `Welcome, ${username}` : "Login"}
            onClick={
              username ? handleWelcomeClick : () => setShowAuthPopup(true)
            }
            className="absolute right-6 top-4"
          />

          {showLogoutDropdown && username && (
            <Button
              text="Logout"
              onClick={handleLogout}
              className="absolute right-6 top-16"
            />
          )}

          {showAuthPopup && (
            <AuthPopup
              onClose={() => setShowAuthPopup(false)}
              onLoginSuccess={handleLoginSuccess}
            />
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
