import React from "react";

function CategoryFilter({ categories, selectedCategories, onSelectCategory }) {
  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={selectedCategories.includes(category) ? "active" : ""}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
