import React, { useState } from "react";
import useInitialSelectedOption from "../hooks/useInitialSelectedOption";
import { LLMDropdownProps } from "../entities/LLMDropdownProps";

const LLMDropdown: React.FC<LLMDropdownProps> = ({
  options,
  selectedOption,
  onOptionSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Custom hook for initializing selected option
  useInitialSelectedOption(selectedOption, options, onOptionSelect);

  const handleOptionSelect = (option: string) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="bg-yellow-500 bg-opacity-25 text-yellow-500 text-lg rounded-lg px-6 py-2 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption || "Select an option"}</span>
        <svg
          className={`w-4 h-4 ml-2 ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute bg-white border border-gray-200 rounded-lg mt-2 shadow-lg w-56 z-10">
          <ul>
            {options.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LLMDropdown;
