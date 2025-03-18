import React from "react";
import "styles/mealPlan/button.css"; // CSS 파일 import

const FloatingNextButton = ({ onClick, disabled,children }) => {
  return (
    <button
      className={"floating-next-button"}
      onClick={onClick}
      disabled={disabled}
      
      style={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
     {children || "다음"} {/* children이 있으면 사용, 없으면 기본값 */}
    </button>
  );
};
export default FloatingNextButton;
