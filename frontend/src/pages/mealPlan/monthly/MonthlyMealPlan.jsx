import { useRef, useState } from "react";
import CalendarView from "pages/mealPlan/monthly/CalendarView";
import MealPlanSlider from "pages/mealPlan/monthly/MealPlanSlider";
import "styles/mealPlan/MonthlyMealPlan.css";

function MonthlyMealPlan({ mealData }) {
  const [calendarValue, setCalendarValue] = useState(new Date());
  const sliderRef = useRef(null); // Slider를 참조할 ref 추가

  return (
    <>
      <CalendarView mealData={mealData} calendarValue={calendarValue} setCalendarValue={setCalendarValue} sliderRef={sliderRef} />
      <MealPlanSlider mealData={mealData} calendarValue={calendarValue} sliderRef={sliderRef} />
    </>
  );
}

export default MonthlyMealPlan;
