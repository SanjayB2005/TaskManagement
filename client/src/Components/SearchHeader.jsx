import React, { useState } from "react";

function SearchHeader({ onSearch, onFilter }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filterOptions = ["All", "High Priority", "Low Priority"];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleFilterClick = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setShowFilterOptions(false);
    if (onFilter) {
      onFilter(filter);
    }
  };

  return (
    <div className="flex flex-wrap gap-10 justify-between items-center p-5 w-full bg-gray-200 rounded-3xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:max-w-full">
      {/* Search Input */}
      <div className="flex justify-between items-center self-stretch my-auto min-w-60 w-[308px]">
        <div className="flex flex-col justify-center p-3 text-sm font-medium leading-none bg-white rounded-3xl min-h-11 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] text-zinc-600 w-full">
          <div className="flex gap-2 items-center w-full">
            <svg 
              className="w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Project"
              className="flex-1 bg-transparent border-none outline-none"
            />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="relative ml-3">
        <button
          className="text-base font-medium whitespace-nowrap rounded-md max-w-[200px] text-neutral-500"
          aria-label="Filter options"
          onClick={handleFilterClick}
        >
          <div className="flex gap-2 items-center p-2.5 bg-white rounded-md border border-solid border-zinc-500">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8ad01b8c3497623212499190f77d85a654a7311d0db9fb0e93af5913f5dbbbb5?placeholderIfAbsent=true&apiKey=35cc7236b4564ae693ad7ccf2b8c203d"
              alt=""
              className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            />
            <span className="self-stretch my-auto">
              {selectedFilter}
            </span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7ad9310749dfcb9f31a308adcc98623fe0f96624cbb8d6c8f81f2a69baf43f2?placeholderIfAbsent=true&apiKey=35cc7236b4564ae693ad7ccf2b8c203d"
              alt=""
              className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            />
          </div>
        </button>

        {/* Filter Options Dropdown */}
        {showFilterOptions && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 py-1">
            {filterOptions.map((option) => (
              <button
                key={option}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedFilter === option
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => handleFilterSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchHeader;