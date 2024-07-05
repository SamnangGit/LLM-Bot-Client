import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MainChatWindowProps {
  response: string | null;
}

const MainChatWindow: React.FC<MainChatWindowProps> = ({ response }) => {
  const renderContent = (content: string) => {
    // Check if the content starts with a markdown code block syntax (```)
    if (content.startsWith("```")) {
      return (
        <SyntaxHighlighter language="markdown" style={dark}>
          {content}
        </SyntaxHighlighter>
      );
    } else {
      return <ReactMarkdown>{content}</ReactMarkdown>;
    }
  };

  return (
    <div className="w-full h-full rounded-xl p-4 bg-gray-800 overflow-hidden">
      <div className="bg-white bg-opacity-20 text-white rounded-xl p-4 overflow-y-auto max-h-full">
        {response ? (
          renderContent(response)
        ) : (
          <div className="text-gray-500">No messages yet.</div>
        )}
      </div>
    </div>
  );
};

export default MainChatWindow;
