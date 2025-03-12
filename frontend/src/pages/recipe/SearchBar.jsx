import React from "react";

function SearchBar({ onSearch }) {
  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="레시피 검색"
        onChange={handleInputChange}
      />
    </div>
  );
}

export default SearchBar;
