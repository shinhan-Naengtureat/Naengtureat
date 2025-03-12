import React, { useState } from "react";

function IngredientSortFilter({
  selectedBigCategory,
  onSelectBigCategory,
  selectedSortFilter,
  onSelectSortFilter,
}) {
  const [showBigCategoryOptions, setShowBigCategoryOptions] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // 예시로 사용하는 식재료 대분류 목록
  const bigCategories = [
    "과일",
    "채소",
    "고기",
    "수산물",
    "유제품",
    "음료",
    "조미료",
    "빵류",
    "견과류",
    "곡류",
    "기타",
  ];
  const sortOptions = ["추천순", "최신순", "난이도순", "조리시간순"];

  return (
    <div className="ingredient-sort-filter">
      <div className="dropdown">
        <button
          onClick={() => setShowBigCategoryOptions(!showBigCategoryOptions)}
        >
          식재료 {selectedBigCategory ? `: ${selectedBigCategory}` : ""}
        </button>
        {showBigCategoryOptions && (
          <div className="dropdown-menu">
            {bigCategories.map((category) => (
              <div
                key={category}
                onClick={() => {
                  onSelectBigCategory(category);
                  setShowBigCategoryOptions(false);
                }}
              >
                {category}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="dropdown">
        <button onClick={() => setShowSortOptions(!showSortOptions)}>
          정렬필터 {selectedSortFilter ? `: ${selectedSortFilter}` : ""}
        </button>
        {showSortOptions && (
          <div className="dropdown-menu" style={{ right: 0, left: "auto" }}>
            {sortOptions.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onSelectSortFilter(option);
                  setShowSortOptions(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default IngredientSortFilter;
