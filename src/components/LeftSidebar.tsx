import React from "react";

const LeftSidebar: React.FC = () => {
  const folders = [
    "Personal",
    "Work",
    "Relationship",
    "Prediction",
    "Research",
  ];
  const recents = [
    "What is vertex ai?",
    "The code below is the logic..",
    "Use of Nvidia Omniverse on ..",
  ];

  return (
    <aside className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 h-full relative bg-white bg-opacity-10 rounded-xl">
      <div className="absolute inset-4">
        <div className="text-white text-2xl font-['Roboto Mono']">Folders</div>
        <ul className="mt-4 space-y-4">
          {folders.map((item) => (
            <li key={item} className="flex items-center">
              <img
                className="w-5 h-5"
                src="https://via.placeholder.com/20x20"
                alt="Icon"
              />
              <span className="ml-4 text-white text-xl font-['Roboto Mono']">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="text-white text-2xl font-['Roboto Mono']">Recents</div>
        <ul className="mt-4 space-y-4">
          {recents.map((item) => (
            <li
              key={item}
              className="text-white text-xl font-['Roboto Mono'] truncate"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default LeftSidebar;
