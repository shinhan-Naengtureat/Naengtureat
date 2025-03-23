import { useContext } from "react";
import { MealPlanContext } from "context/MealPlanContext"; //  MealPlanContext 가져오기

const useMealPlanContext = () => {
  const context = useContext(MealPlanContext);
  
  if (!context) {
    throw new Error("useMealPlanContext must be used within a MealPlanProvider");
  }
  
  return context; //  userSelections & setUserSelections 반환
};

export default useMealPlanContext; // 