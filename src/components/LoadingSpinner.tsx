import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div
      className="spinner-border animate-spin inline-block w-6 h-6 border-2 rounded-full border-current border-t-transparent text-black"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default LoadingSpinner;