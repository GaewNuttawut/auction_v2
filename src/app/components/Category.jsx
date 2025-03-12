'use client';

import React, { useState } from 'react';

const Category = ({ categories = [], onCategorySelect }) => {
  const [showCategories, setShowCategories] = useState(false);

  const handleCategoryClick = () => {
    setShowCategories(!showCategories);
  };

  const handleCategorySelect = (category) => {
    onCategorySelect(category);
    setShowCategories(false);
  };

  return (
    <div>
      <button onClick={handleCategoryClick} className='fixed bottom-20 left-10 rounded-full bg-gradient-to-tr from-red-400 to-purple-400 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none cursor-pointer hover:scale-125'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
      </button>
      {showCategories && (
        <ul>
          {categories.length > 0 ? (
            categories.map((category) => (
              <li key={category.id} onClick={() => handleCategorySelect(category)}>
                {category.name}
              </li>
            ))
          ) : (
            <li>No categories available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Category;