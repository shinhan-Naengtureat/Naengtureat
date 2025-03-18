import React, { useState } from "react";

function SortFilter({ selectedSortFilter, onSelectSortFilter }) {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const sortOptions = ["추천순", "최신순", "난이도순", "조리시간순"];

  const handleOptionClick = (option) => {
    onSelectSortFilter(option);
    setShowSortOptions(false);
  };

  const displayValue = selectedSortFilter || "추천순";

  return (
    <div className="sort-filter-container">
      <div className="dropdown">
        <button
          className="btn btn-light dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          onClick={() => setShowSortOptions(!showSortOptions)}
          aria-expanded={showSortOptions}
        >
          {displayValue}
        </button>
        {showSortOptions && (
          <ul
            className="dropdown-menu show"
            aria-labelledby="dropdownMenuButton"
          >
            {sortOptions.map((option) => (
              <li key={option}>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SortFilter;
