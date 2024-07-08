import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { ModelOptions } from "../entities/ModelOptions";
import { getLLMPlatforms } from "../services/chatService";

interface FetchDataResult {
  platformOptions: string[];
  modelOptions: ModelOptions;
  platformSettings: Record<string, string[]>;
  selectedPlatform: string;
  setSelectedPlatform: Dispatch<SetStateAction<string>>;
  selectedModel: string;
  setSelectedModel: Dispatch<SetStateAction<string>>;
}

const useFetchData = (): FetchDataResult => {
  const [platformOptions, setPlatformOptions] = useState<string[]>([]);
  const [modelOptions, setModelOptions] = useState<ModelOptions>({ platforms: {} });
  const [platformSettings, setPlatformSettings] = useState<Record<string, string[]>>({});
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await getLLMPlatforms();
      const data = response.data as { platforms: { [key: string]: string[] }; platform_settings: Record<string, string[]> }; // Type assertion

      // Extract platform names and model options from API response
      const platforms = Object.keys(data.platforms);
      const modelOptions = { platforms: data.platforms
      };

      // Set platform and model options in state
      setPlatformOptions(platforms);
      setModelOptions(modelOptions);
      setPlatformSettings(data.platform_settings);

      // Select default platform and model
      if (platforms.length > 0) {
        setSelectedPlatform(platforms[0]);
        if (data.platforms[platforms[0]] && data.platforms[platforms[0]].length > 0) {
          setSelectedModel(data.platforms[platforms[0]][0]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  return {
    platformOptions,
    modelOptions,
    platformSettings,
    selectedPlatform,
    setSelectedPlatform,
    selectedModel,
    setSelectedModel,
  };
};

export default useFetchData;
