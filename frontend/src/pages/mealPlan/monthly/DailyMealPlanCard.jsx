import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import "styles/mealPlan/DailyMealPlanCard.css"; // 스타일 파일

const DailyMealPlanCard = ({ name, type, check }) => {
    
  return (
    <div className="event-card">
      {/* 텍스트 영역 */}
      <div className="event-content">
        <div className="recipe-type">{type}</div>
        <div className="recipe-name">{name}</div>
        <div className="recipe-check">{check && <FaCheckCircle color="#F35C04" size={20} />}</div>
      </div>
    </div>
  );
};

export default DailyMealPlanCard;
