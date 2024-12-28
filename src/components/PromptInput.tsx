import React, { useRef, useState } from "react";
import { PromptInputProps } from "../entities/PromptInputProps";
import usePromptInput from "../hooks/usePromptInput";
import useChatService from "../hooks/useChatService";
import arrowUpImage from "../assets/arrow-up-50.png";
import { Paperclip, X } from "lucide-react";

interface FilePreview {
  url: string;
  name: string;
  type: string;
  uploadedFileName?: string; // Store the server-side filename
}

const PromptInput: React.FC<PromptInputProps> = ({
  onChatResponse,
  onUserPrompt,
  model,
  settings,
}) => {
  const {
    prompt,
    setPrompt,
    inputHeight,
    inputRef,
    handlePromptChange,
    handleKeyPress,
  } = usePromptInput();

  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { handleSubmit, loading } = useChatService(
    model,
    onChatResponse,
    settings
  );

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading...");
      const response = await fetch("http://localhost:8000/chat/split", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadStatus("Upload complete!");
      return data.filename;
    } catch (error) {
      setUploadStatus("Upload failed");
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleFormSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    // If we have a file and it's been uploaded, include its information in the chat
    const messageText = filePreview?.uploadedFileName
      ? `${prompt} [File: ${filePreview.uploadedFileName}]`
      : prompt;

    onUserPrompt(prompt);
    await handleSubmit(messageText);
    setPrompt("");
    clearFilePreview();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);

      // Set initial preview
      setFilePreview({
        url: fileUrl,
        name: file.name,
        type: file.type,
      });

      try {
        // Upload immediately
        const uploadedFileName = await uploadFile(file);

        // Update preview with uploaded filename
        setFilePreview((prev) =>
          prev
            ? {
                ...prev,
                uploadedFileName,
              }
            : null
        );
      } catch (error) {
        // If upload fails, keep the preview but show error
        setUploadStatus("Upload failed. Please try again.");
      }
    }
  };

  const clearFilePreview = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview.url);
      setFilePreview(null);
      setUploadStatus("");
    }
  };

  const renderFilePreview = () => {
    if (!filePreview) return null;

    const isImage = filePreview.type.startsWith("image/");

    return (
      <div className="absolute bottom-full mb-2 left-2">
        <div className="bg-white rounded-lg shadow-md p-2 flex items-center gap-2 max-w-xs">
          {isImage ? (
            <img
              src={filePreview.url}
              alt={filePreview.name}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 truncate max-w-[150px]">
              {filePreview.name}
            </span>
            {uploadStatus && (
              <span className="text-xs text-gray-500">{uploadStatus}</span>
            )}
          </div>
          <button
            type="button"
            onClick={clearFilePreview}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {renderFilePreview()}
      <form onSubmit={handleFormSubmit} className="bg-white rounded-xl p-2">
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleFileClick}
            className="p-2 hover:bg-gray-100 rounded-lg mr-2"
          >
            <Paperclip className="h-6 w-6 text-gray-500" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />

          <textarea
            ref={inputRef}
            style={{
              minHeight: "40px",
              maxHeight: "120px",
              height: `${inputHeight}px`,
            }}
            value={prompt}
            onChange={handlePromptChange}
            onKeyPress={(e) => handleKeyPress(e, handleFormSubmit)}
            placeholder="Type your prompt here"
            className="w-full p-2 text-black text-xl font-['Arial'] bg-transparent border-none focus:outline-none resize-none"
          />

          <button
            type="submit"
            className="absolute top-0 right-0 mt-2 mr-2 bg-yellow-400 p-3 rounded-xl active:bg-yellow-500"
            disabled={loading}
          >
            <img src={arrowUpImage} className="h-6 w-6" alt="Send" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptInput;
