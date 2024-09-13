import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string; // Optional className to allow additional styling
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <div
      className={`bg-yellow-500 bg-opacity-25 text-yellow-500 text-lg rounded-lg px-6 py-2 cursor-pointer flex justify-between items-center ${className}`}
    >
      <button onClick={onClick}>{text}</button>
    </div>
  );
};

export default Button;
