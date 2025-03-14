import React from "react";
import { FaArrowRight } from "react-icons/fa"; //  FontAwesome 화살표 아이콘 사용
import "../styles/mealPlan/button.css"; //  버튼 스타일 적용

const NextButton = ({ onClick, disabled }) => {
  return (
    <button className="next-button" onClick={onClick} disabled={disabled}>
      <FaArrowRight className="arrow-icon" /> {/*  `>` 화살표 아이콘 추가 */}
    </button>
  );
};

export default NextButton;
