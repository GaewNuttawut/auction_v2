'use client';

import React, { useState, useRef, useEffect } from 'react';

const categories = [
  { key: "chair", name: "Chair" },
  { key: "sofas_and_armchairs", name: "Sofas and armchairs" },
  { key: "table", name: "Table" },
  { key: "cupboard", name: "Cupboard" },
  { key: "bad", name: "Bad" },
  { key: "counter", name: "Counter" },
  { key: "office_furniture", name: "Office furniture" },
  { key: "Kitchenware_and_freezer", name: "Kitchenware and freezer" },
  { key: "door", name: "Door" },
  { key: "home_decoration", name: "Home decoration" },
];

const Category = ({ onCategorySelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCategorySelect = (category) => {
    onCategorySelect(category);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-20 left-10" ref={dropdownContainerRef}>
      <button
        onClick={toggleDropdown}
        className='rounded-full bg-gradient-to-tr from-red-400 to-purple-400 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none cursor-pointer hover:scale-125'
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white text-gray-800 border border-gray-300 shadow-lg rounded-lg w-64 z-10 p-2 ">
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.key}
                className="block w-full text-left px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-yellow-400 hover:to-red-300 border-b border-gray-200 transition-all duration-200 ease-in-out transform hover:scale-105 rounded-md shadow-sm"
                onClick={() => handleCategorySelect(category)}
              >
                {category.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No categories available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Category;
