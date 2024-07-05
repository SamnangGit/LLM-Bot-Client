import {
  useState,
  ChangeEvent,
  useRef,
  useEffect,
  KeyboardEvent,
} from "react";

const usePromptInput = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [inputHeight, setInputHeight] = useState<number>(40); // Initial height
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    adjustInputHeight(e.target.value);
  };

  const adjustInputHeight = (value: string) => {
    if (inputRef.current) {
      const lineHeight = 24; // Line height in pixels
      const minLines = 1; // Minimum number of lines
      const maxLines = 5; // Maximum number of lines before expanding
      const lines = value.split("\n").length;
      const newHeight =
        Math.min(maxLines, Math.max(minLines, lines)) * lineHeight + lineHeight;
      setInputHeight(newHeight);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollTop = 0; // Scroll to top when content changes
      adjustInputHeight(prompt); // Adjust height when content changes
    }
  }, [prompt]);

  const handleKeyPress = (
    e: KeyboardEvent<HTMLTextAreaElement>,
    handleSubmit: () => void
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return {
    prompt,
    setPrompt,
    inputHeight,
    inputRef,
    handlePromptChange,
    handleKeyPress,
  };
};

export default usePromptInput;
