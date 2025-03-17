import { addWeeks, format, getDate, getDay, startOfMonth, subWeeks } from "date-fns";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import WeeklyMealPlanTable from "pages/mealPlan/weekly/WeeklyMealPlanTable";
import "styles/mealPlan/WeeklyMealPlan.css";

function WeeklyMealPlan({ memoizedMeals, handleDragEnd, weekStart, onUpdateMeal, onDeleteMeal, currentWeek, setCurrentWeek }) {
  // 이전 주로 이동하는 함수
  const goToPreviousWeek = () => {
    const newWeek = subWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
  };

  // 다음 주로 이동하는 함수
  const goToNextWeek = () => {
    const newWeek = addWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
  };

  const getWeekOfMonthMondayStart = (date) => {
    const firstDayOfMonth = startOfMonth(date);
    let firstDayWeekday = getDay(firstDayOfMonth); // 0(일) ~ 6(토)

    // 월요일 시작 기준으로 변경 (일요일 0 → 7로 변환)
    firstDayWeekday = firstDayWeekday === 0 ? 7 : firstDayWeekday;

    // 현재 날짜 (1일부터 시작)
    const currentDay = getDate(date);

    // 첫째 주 시작이 월요일보다 이전 요일이라면, 첫 주차를 채우기 위해 보정
    const offset = firstDayWeekday - 1; // 첫째 날이 월요일(1)이면 0, 화요일(2)이면 1, ...

    return Math.ceil((currentDay + offset) / 7);
  };

  // 숫자를 한글로 변환하는 배열
  const koreanWeekNames = ["첫째", "둘째", "셋째", "넷째", "다섯째"];

  // 현재 주의 월과 주차 표시
  const weekIndex = getWeekOfMonthMondayStart(currentWeek) - 1; // 배열 인덱스 맞추기
  const weekOfMonth = koreanWeekNames[weekIndex] || `${weekIndex + 1}째`;

  const currentMonth = `${format(currentWeek, "yyyy년 M월")} ${weekOfMonth} 주`;

  // 이행 여부 체크
  const toggleMealCheck = (meal) => {
    onUpdateMeal({ ...meal, check: !meal.check });
  };

  // 식단 삭제
  const deleteMeal = (mealDate) => {
    const today = new Date().setHours(0, 0, 0, 0); // 오늘 날짜 기준
    const mealDateTimestamp = new Date(mealDate).setHours(0, 0, 0, 0); // 식단 날짜 기준

    // 오늘 이후의 식단만 삭제 가능
    return mealDateTimestamp >= today;
  };

  return (
    <div className="weekly-container">
      {/* 이전 주, 다음 주 버튼 */}
      <div className="meal-plan-weekly-header">
        <button
          onClick={goToPreviousWeek}
          className="previous-week-btn"
          variant="link"
          size="sm"
        >
          <IoIosArrowBack style={{ fontSize: '24px' }} />
          {/* <span>지난주</span> */}
        </button>
        {/* 현재 월 출력 */}
        <span className="current-month-label">{currentMonth}</span>
        <button
          onClick={goToNextWeek}
          variant="link"
          size="sm"
          className="next-week-btn"
        >
          {/* <span>다음주</span> */}
          <IoIosArrowForward style={{ fontSize: '24px' }} />
        </button>
      </div>

      <WeeklyMealPlanTable 
        memoizedMeals={memoizedMeals}
        weekStart={weekStart}
        handleDragEnd={handleDragEnd}
        onDeleteMeal={onDeleteMeal}
        toggleMealCheck={toggleMealCheck}
        deleteMeal={deleteMeal}
      />
    </div>
  );
}

export default WeeklyMealPlan;
