import React from "react";
import MainPage from "./views/MainPage";
import TestSSE from "./views/TestSSE";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-11/12 sm:w-4/5 md:w-4/5 xl:w-3/5 h-full sm:h-full lg:h-full  mx-auto">
        <MainPage />
        {/* <TestSSE /> */}
      </div>
    </div>
  );
};

export default App;
