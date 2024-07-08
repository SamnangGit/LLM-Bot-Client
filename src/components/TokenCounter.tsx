import React from "react";

interface TokenCounterProps {
  tokenCount: number;
}

const TokenCounter: React.FC<TokenCounterProps> = ({ tokenCount }) => {
  return (
    <div className="bg-yellow-500 bg-opacity-25 text-yellow-500 text-lg font-mono font-medium rounded-lg px-6 py-2">
      Tokens: {tokenCount}
    </div>
  );
};

export default TokenCounter;
