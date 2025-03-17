import React from "react";
import "styles/mealPlan/grids.css"; // CSS 파일 import

const IngredientCard = ({ name, image, isSelected, onToggle }) => {
  return (
    <div
      className={`ingredient-card ${isSelected ? "selected" : ""}`}
      onClick={() => onToggle(name)}
    >
      {/* 배경 이미지 */}
      <img src={image} alt={name} className="ingredient-image" />

      {/* 선택 체크박스 (○ 아이콘) */}
      <div className="select-circle">
        {isSelected && <div className="inner-circle"></div>}
      </div>
      {/*  왼쪽 상단 텍스트 */}
      <span className="ingredient-name">{name}</span>
      {/* 재료명 */}
      <span className="ingredient-name">{name}</span>
    </div>
  );
};

export default IngredientCard;
