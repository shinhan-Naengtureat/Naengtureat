import React from 'react';
import "styles/ingredient/ingredientBigCategoryFilter.css";

const IngredientBigCategoryFilter = ({ items, selectedItems, toggleItem }) => {
  return (
    <div className="horizontal-scroll-container">
      {items.map((item, idx) => (
        <button
          key={idx}
          className={`inventory-list-category-btn ${selectedItems.includes(item) ? "active" : ""}`}
          onClick={() => toggleItem(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default IngredientBigCategoryFilter;