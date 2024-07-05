export interface LLMDropdownProps {
    options: string[];
    selectedOption: string;
    onOptionSelect: (option: string) => void;
  }
  