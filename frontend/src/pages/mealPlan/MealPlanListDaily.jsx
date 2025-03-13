import { format, startOfWeek } from "date-fns";
import MealPlanHeader from "pages/mealPlan/MealPlanHeader";
import MonthlyMealPlan from "pages/mealPlan/MonthlyMealPlan";
import WeeklyMealPlan from "pages/mealPlan/weekly/WeeklyMealPlan";
import { useState, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import useMealPlan from "hooks/useMealPlan"; // 데이터를 가져오는 훅
import useMealPlanActions from "hooks/useMealPlanActions"; // 액션 훅

function MealPlanListDaily() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isMonthlyView, setIsMonthlyView] = useState(false); // 월간보기 상태

  // 현재 주의 시작 날짜
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const formattedDate = format(weekStart, "yyyyMMdd");

  // 데이터 로딩 훅
  const { mealData, loading, setMealData } = useMealPlan(formattedDate);

  // 액션 훅
  const { handleDragEnd, updateMeal, deleteMeal } = useMealPlanActions(
    mealData,
    setMealData
  );

  // mealData 최적화
  const memoizedMeals = useMemo(() => [...mealData], [mealData]);

  return (
    <div className="body-container">
      <MealPlanHeader
        isMonthlyView={isMonthlyView}
        setIsMonthlyView={setIsMonthlyView}
      />
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : isMonthlyView ? (
        <MonthlyMealPlan />
      ) : (
        <WeeklyMealPlan
          memoizedMeals={memoizedMeals}
          handleDragEnd={handleDragEnd}
          weekStart={weekStart}
          onUpdateMeal={updateMeal}
          onDeleteMeal={deleteMeal}
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
        />
      )}
    </div>
  );
}

export default MealPlanListDaily;
