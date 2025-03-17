import { Button } from "react-bootstrap";
import "react-toggle/style.css";
import "styles/mealPlan/MealPlanHeader.css";

function MealPlanHeader({ isMonthlyView, setIsMonthlyView }) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button className="disabled">이번주 식단 생성하기</Button>
        <div className="toggle-wrapper" onClick={() => setIsMonthlyView((prev) => !prev)}>
          {/* 활성화 상태에 따라 active 클래스 추가 */}
          <span className={`toggle-label weekly ${!isMonthlyView ? "active" : ""}`}>주간</span>
          <span className={`toggle-label monthly ${isMonthlyView ? "active" : ""}`}>월간</span>

          {/* 움직이는 토글 버튼 */}
          <div className={`toggle-slider ${isMonthlyView ? "monthly" : "weekly"}`}></div>
        </div>
      </div>
    </>
  );
}

export default MealPlanHeader;
