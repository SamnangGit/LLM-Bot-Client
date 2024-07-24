import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MainChatWindowProps {
  chatHistory: Array<{ role: string; content: string }>;
}

const MainChatWindow: React.FC<MainChatWindowProps> = ({ chatHistory }) => {
  const renderContent = (content: string) => {
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
        {chatHistory.length > 0 ? (
          chatHistory.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                item.role === "user" ? "justify-end" : "justify-start"
              } mb-3`}
            >
              <div
                className={` ${
                  item.role === "user" ? "p-3" : "p-4"
                } rounded-lg ${
                  item.role === "user"
                    ? "bg-yellow-400 text-black max-w-xl text-right"
                    : "bg-black w-full text-left"
                }`}
              >
                {renderContent(item.content)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No messages yet.</div>
        )}
      </div>
    </div>
  );
};

export default MainChatWindow;
