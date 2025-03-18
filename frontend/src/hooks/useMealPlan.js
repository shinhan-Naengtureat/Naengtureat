import { useState, useEffect } from "react";
import axiosInstance from "api/axios";

const useMealPlan = (dateParam, isMonthlyView) => {
  const [mealData, setMealData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const endpoint = isMonthlyView
          ? `/mealplan/month/${dateParam}` // 월간 API 호출
          : `/mealplan/week/${dateParam}`; // 기존 주간 API 호출

        const response = await axiosInstance.get(endpoint);
        setMealData(response.data);
      } catch (error) {
        console.error("Error fetching meal plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealData();
  }, [dateParam, isMonthlyView]); // isMonthlyView도 의존성에 추가

  return { mealData, loading, setMealData };
};

export default useMealPlan;
