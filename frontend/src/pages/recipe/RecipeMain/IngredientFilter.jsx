import React, { useState } from "react";

function IngredientFilter({ onApplyCategories }) {
  // 모달 열고 닫힘 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 여러 대분류 선택을 위한 상태
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 식재료 대분류 목록
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

  // 카테고리 클릭 시 선택/해제
  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // 전체 초기화
  const handleReset = () => {
    setSelectedCategories([]);
  };

  // 적용하기
  const handleApply = () => {
    onApplyCategories(selectedCategories);
    setIsModalOpen(false);
  };

  return (
    <div className="ingredient-filter-container">
      {/* 식재료 버튼 (왼쪽) */}
      <button
        className="btn btn-light ingredient-filter-button"
        onClick={() => setIsModalOpen(true)}
      >
        식재료
      </button>

      {/* 모달 (Bottom Sheet) */}
      {isModalOpen && (
        <>
          {/* 화면 전체를 덮는 오버레이 */}
          <div
            className="bottom-sheet-overlay"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* 실제 바텀시트 영역 */}
          <div className="bottom-sheet">
            {/* 드래그 핸들(선)처럼 보이는 영역을 원하시면 사용 */}
            <div className="sheet-handle"></div>

            <h2 className="sheet-title">필터</h2>
            <p className="sheet-subtitle">식재료</p>

            <div className="sheet-category-list">
              {bigCategories.map((category) => (
                <div
                  key={category}
                  className={`sheet-category-chip ${
                    selectedCategories.includes(category) ? "selected" : ""
                  }`}
                  onClick={(e) => {
                    // e.stopPropagation(); // 오버레이와 클릭 충돌 시 사용 가능
                    handleCategoryClick(category);
                  }}
                >
                  {category}
                </div>
              ))}
            </div>

            <div className="sheet-actions">
              <button className="reset-btn" onClick={handleReset}>
                전체 초기화
              </button>
              <button className="apply-btn" onClick={handleApply}>
                적용하기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default IngredientFilter;
