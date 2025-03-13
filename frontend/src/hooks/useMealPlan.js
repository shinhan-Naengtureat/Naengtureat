import { useState, useEffect } from "react";
import axiosInstance from "api/axios";

const useMealPlan = (formattedDate) => {
  const [mealData, setMealData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/mealplan/week/${formattedDate}`)
      .then((response) => {
        setMealData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching meal plan:", error);
        setLoading(false);
      });
  }, [formattedDate]);

  return { mealData, loading, setMealData };
};

export default useMealPlan;
