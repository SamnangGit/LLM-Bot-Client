import { useEffect } from "react";

const useInitialSelectedOption = (
  selectedOption: string,
  options: string[],
  onOptionSelect: (option: string) => void
) => {
  useEffect(() => {
    // Ensure selectedOption is initialized when options change
    if (!selectedOption && options.length > 0) {
      onOptionSelect(options[0]);
    }
  }, [options, selectedOption, onOptionSelect]);
};

export default useInitialSelectedOption;
