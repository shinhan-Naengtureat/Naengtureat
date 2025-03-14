import { Alert, Button, Form } from "react-bootstrap";
import "styles/mealPlan/MealPlanHeader.css";

function MealPlanHeader({ isMonthlyView, setIsMonthlyView }) {
  return (
    <>
      <Alert
        variant="warning"
        className="d-flex justify-content-between align-items-center"
      >
        <span>📢 지금 필요한 재료를 확인해보세요!</span>
        <Button variant="outline-danger" size="sm">
          확인하기
        </Button>
      </Alert>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button className="disabled">이번주 식단 생성하기</Button>
        <div className="d-flex align-items-center">
          <span className="me-2">월간</span>
          <Form.Check
            type="switch"
            id="monthly-view-switch"
            checked={isMonthlyView}
            onChange={() => setIsMonthlyView((prev) => !prev)}
            className="custom-switch" // 커스텀 클래스 추가
          />
        </div>
      </div>
    </>
  );
}

export default MealPlanHeader;
