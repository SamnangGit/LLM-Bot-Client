import React from "react";
import MainPage from "./views/MainPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="w-full h-full">
      <div className="flex-col w-3/5 h-4/5 mr-auto ml-auto">
        <MainPage />
      </div>
    </div>
  );
};

export default App;
