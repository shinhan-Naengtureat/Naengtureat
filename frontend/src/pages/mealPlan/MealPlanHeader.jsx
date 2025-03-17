import useNotEnoughIngredients from "hooks/useNotEnoughIngredients";
import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { IoHelpCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "react-toggle/style.css";
import { Tooltip } from "react-tooltip";
import "styles/mealPlan/MealPlanHeader.css";

function MealPlanHeader({ isMonthlyView, setIsMonthlyView }) {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [hideAnimation, setHideAnimation] = useState(false);

  const { notEnoughCount } = useNotEnoughIngredients(); // 공통 훅 사용

  useEffect(() => {
    if (notEnoughCount > 0) {
      setShowNotification(true);

      setTimeout(() => setHideAnimation(true), 4500);
      setTimeout(() => setShowNotification(false), 5100);
    }
  }, [notEnoughCount]);

  return (
    <>
      {showNotification && (
        <Alert
          variant="warning"
          className={`notification ${hideAnimation ? "hide" : ""}`}
        >
          <span>📢 지금 필요한 재료를 확인해보세요!</span>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => navigate("/shopping-container")}
          >
            확인하기
          </Button>
        </Alert>
      )}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button
            className="make-mealplan"
            variant="outline-primary"
            onClick={() => navigate("/budget")}
          >
            식단 생성
          </Button>
        </div>
        <div
          className="toggle-wrapper"
          onClick={() => setIsMonthlyView((prev) => !prev)}
        >
          {/* 활성화 상태에 따라 active 클래스 추가 */}
          <span
            className={`toggle-label weekly ${!isMonthlyView ? "active" : ""}`}
          >
            주간
          </span>
          <span
            className={`toggle-label monthly ${isMonthlyView ? "active" : ""}`}
          >
            월간
          </span>

          {/* 움직이는 토글 버튼 */}
          <div
            className={`toggle-slider ${isMonthlyView ? "monthly" : "weekly"}`}
          ></div>
        </div>
      </div>
    </>
  );
}

export default MealPlanHeader;
