import React, { useState, useEffect } from "react";
import { SettingItems } from "../entities/SettingItems";

interface LLMSettingProps {
  onClose: () => void;
  platformSettings: Record<string, string[]>;
  selectedPlatform: string;
}

const LLMSetting: React.FC<LLMSettingProps> = ({
  onClose,
  platformSettings,
  selectedPlatform,
}) => {
  const [settings, setSettings] = useState<SettingItems[]>([]);

  useEffect(() => {
    // Dynamically generate settings based on the selected platform
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

    setSettings(initialSettings);
  }, [platformSettings, selectedPlatform]);

  const handleSettingChange = (index: number, newValue: number) => {
    const newSettings = [...settings];
    newSettings[index].value = Math.min(
      Math.max(newValue, newSettings[index].min),
      newSettings[index].max
    );
    setSettings(newSettings);
  };

  return (
    <div className="flex items-center w-max justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-xl p-8 w-full max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold font-['Roboto Mono']">Settings</div>
          <button onClick={onClose} className="text-black text-xl font-bold">
            X
          </button>
        </div>
        {settings.map((setting, index) => (
          <div key={setting.name} className="mt-8">
            <div className="flex items-center justify-between">
              <div className="text-lg font-['Roboto Mono']">
                {setting.name}: {setting.value}
              </div>
              <div className="ml-6 text-xs font-['Roboto Mono'] text-black/opacity-50">
                {setting.min} ≤ {setting.name.toLowerCase()} ≤ {setting.max}
              </div>
            </div>
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              step={(setting.max - setting.min) / 100}
              value={setting.value}
              onChange={(e) =>
                handleSettingChange(index, parseFloat(e.target.value))
              }
              className="w-full mt-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LLMSetting;
