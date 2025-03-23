import { format } from "date-fns";

// 날짜별 배경색을 설정하는 함수
export const getTileClassName = (date, mealData) => {
  const formattedDate = format(date, "yyyy-MM-dd");
  const completedCount = mealData.filter((m) => m.date === formattedDate && m.check).length; // 체크된(meal.check === true) 식단 개수 계산
  
  let classNames = "";

  if (completedCount > 0) {
     classNames += ` completed-${completedCount}`;
  }

  if (date.getDay() === 6) {
    classNames += " saturday"; // 토요일이면 'saturday' 클래스 추가
  }

  return classNames.trim();
};

export const calculateMealStats = (mealData, calendarValue, AVERAGE_MEAL_COST) => {
  const currentMonth = format(calendarValue, "yyyy-MM");
  const mealsInMonth = mealData.filter((meal) => meal.date.startsWith(currentMonth)); // 이번달 식단
  // 이행된 식단만 필터링
  const completedMealsInMonth = mealData.filter((meal) => 
    meal.date.startsWith(currentMonth) && meal.check
  );
  return {
    totalMeals: mealsInMonth.length, // 전체 식단 개수
    completedMeals: completedMealsInMonth.filter((meal) => meal.check).length, // 이행한 식단 개수
    estimatedExpense: completedMealsInMonth.length * AVERAGE_MEAL_COST, // 예상 외식 비용
    usedAmount: Math.floor(completedMealsInMonth.reduce((sum, meal) => // 사용한 금액(레시피 가격/레시피 인분)
      sum + (meal.recipePrice / (meal.recipeServing ? parseInt(meal.recipeServing.match(/\d+/), 10) || 1 : 1)), 0)),
  };
};
