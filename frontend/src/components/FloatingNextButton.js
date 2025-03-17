import React from "react";
import "styles/mealPlan/button.css"; // CSS 파일 import

const FloatingNextButton = ({ onClick, disabled }) => {
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
      다음
    </button>
  );
};
export default FloatingNextButton;
