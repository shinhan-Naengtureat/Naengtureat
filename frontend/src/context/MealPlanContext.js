import React, { createContext, useContext, useState } from "react";

const MealPlanContext = createContext();

export const useMealPlan = () => useContext(MealPlanContext);

export const MealPlanProvider = ({ children }) => {
  const [userSelections, setUserSelections] = useState({
    budget: "",
    category: [],
    theme: [],
    preferredIngredients: [],
    excludedIngredients: [],
    days: [],
    mealTimes: [],
  });

  return (
    <MealPlanContext.Provider value={{ userSelections, setUserSelections }}>
      {children}
    </MealPlanContext.Provider>
  );
};
