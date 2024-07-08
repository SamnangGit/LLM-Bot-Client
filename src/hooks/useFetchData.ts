import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { ModelOptions } from "../entities/ModelOptions";
import { getLLMPlatforms } from "../services/chatService";

interface FetchDataResult {
  platformOptions: string[];
  modelOptions: ModelOptions;
  selectedPlatform: string; // Ensure selectedPlatform is declared here
  setSelectedPlatform: Dispatch<SetStateAction<string>>; // Include setter for selectedPlatform
  selectedModel: string; // Ensure selectedModel is declared here
  setSelectedModel: Dispatch<SetStateAction<string>>; // Include setter for selectedModel
}

const useFetchData = (): FetchDataResult => {
  const [platformOptions, setPlatformOptions] = useState<string[]>([]);
  const [modelOptions, setModelOptions] = useState<ModelOptions>({ platforms: {} });
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await getLLMPlatforms();
      const data = response.data.platforms;

      // Extract platform names and model options from API response
      const platforms = Object.keys(data);
      const models = Object.values(data);
      // Prepare new ModelOptions object
      const newModelOptions: ModelOptions = {
        platforms: data,
      };

      // Set platform and model options in state
      setPlatformOptions(platforms);
      setModelOptions(newModelOptions);

      // Select default platform and model
      setSelectedPlatform(platforms[0]);
      setSelectedModel(models[0][0]); // Selecting the first model of the first platform
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
