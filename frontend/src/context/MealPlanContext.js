import React, { createContext, useContext, useState } from "react";

//  Context 생성
const MealPlanContext = createContext();

//  Provider 컴포넌트 생성
export const MealPlanProvider = ({ children }) => {
  const [userSelections, setUserSelections] = useState({
    budget: "",
    category: [],
    theme: [],
    preferredIngredients: [],
    excludedIngredients: [],
    days: [],
    mealTimes: [],
    mealCount:[],
  });

  return (
    <MealPlanContext.Provider value={{ userSelections, setUserSelections }}>
      {children}
    </MealPlanContext.Provider>
  );
};

//  Context 내보내기
export { MealPlanContext };
