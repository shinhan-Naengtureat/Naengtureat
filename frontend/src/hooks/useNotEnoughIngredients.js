import { useEffect, useState } from "react";
import axiosInstance from "api/axios";
import { endOfWeek, format, startOfWeek } from "date-fns";

const useNotEnoughIngredients = () => {
  const [notEnoughIngredients, setNotEnoughIngredients] = useState([]);
  const [notEnoughCount, setNotEnoughCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const startDate = format(weekStart, "yyyy-MM-dd");
  const endDate = format(weekEnd, "yyyy-MM-dd");

  useEffect(() => {
    const fetchNotEnoughIngredients = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/inventory/gap?startDate=${startDate}&endDate=${endDate}`
        );
        if (response.status === 200) {
          const notEnoughItems = response.data.filter(
            (item) => item.mealPlanQuantity - item.memberQuantity > 0
          );
          setNotEnoughIngredients(notEnoughItems);
          setNotEnoughCount(notEnoughItems.length);
        }
      } catch (err) {
        console.error("부족한 재료 API 호출 오류:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotEnoughIngredients();
  }, [startDate, endDate]);

  return { notEnoughIngredients, notEnoughCount, loading, error };
};

export default useNotEnoughIngredients;
