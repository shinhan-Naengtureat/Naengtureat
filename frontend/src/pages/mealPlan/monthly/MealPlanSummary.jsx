import MonthlyMealChart from "pages/mealPlan/monthly/MonthlyMealChart";
import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";
import { IoHelpCircleOutline } from "react-icons/io5";
import { calculateMealStats } from "utils/mealPlanUtils";

const AVERAGE_MEAL_COST = 11_500;

function MealPlanSummary({ mealData, calendarValue }) {
  const [totalMeals, setTotalMeals] = useState(0); // 전체 식단 개수
  const [completedMeals, setCompletedMeals] = useState(0); // 이행한 식단 개수
  const [estimatedExpense, setEstimatedExpense] = useState(0); // 예상 소비 금액
  const [usedAmount, setUsedAmount] = useState(0); // 사용한 금액

  useEffect(() => {
    const { totalMeals, completedMeals, estimatedExpense, usedAmount } = calculateMealStats(mealData, calendarValue, AVERAGE_MEAL_COST);
    setTotalMeals(totalMeals);
    setCompletedMeals(completedMeals);
    setEstimatedExpense(estimatedExpense);
    setUsedAmount(usedAmount);
  }, [mealData, calendarValue]);

  return (
    <div className="mealplan-check">
      <div className="mealplan-check-label">
        <span>이번달 </span>
        <span className="mealplan-check-label-orange">{totalMeals}</span>
        <span>회의 제공 식단 중 </span>
        <span className="mealplan-check-label-orange">{completedMeals}</span>
        <span>번을 이행했어요!</span>
      </div>
      <MonthlyMealChart estimatedExpense={estimatedExpense} usedAmount={usedAmount} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <IoHelpCircleOutline
          data-tooltip-id="saving-info"
          style={{ cursor: "pointer", fontSize: "24px", color: "#666", verticalAlign: "middle" }}
        />
        <Tooltip
          id="saving-info"
          place="top"
          content={
            <span>
              대한민국의 평균 한 끼 외식 비용은 11,500원입니다.<br />
              출처: 행정안전부 외식비 평균가격(서울)
            </span>
          }
          data-html="true"
        />
        <span>한달 소비 절약 금액: {(estimatedExpense - usedAmount).toLocaleString()}원</span>
      </div>
    </div>
  );
}

export default MealPlanSummary;
