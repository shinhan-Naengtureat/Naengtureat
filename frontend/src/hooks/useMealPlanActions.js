import { useCallback } from "react";
import axiosInstance from "api/axios";

const useMealPlanActions = (mealData, setMealData) => {
  // 드래그 종료 후 처리 로직
  const handleDragEnd = useCallback(
    (result) => {
      const { destination, draggableId } = result;

      if (!destination) return;

      const splitId = destination.droppableId.split("-");
      const newType = splitId.pop(); // 배열의 마지막 요소를 mealType으로 설정
      const newDate = splitId.join("-"); // 남은 부분을 다시 날짜로 결합

      const movedMeal = mealData.find(
        (meal) => meal.id.toString() === draggableId
      );

      if (
        !movedMeal ||
        (movedMeal.date === newDate && movedMeal.type === newType)
      ) {
        return;
      }

      const droppedMeal = mealData.find(
        (meal) => meal.date === newDate && meal.type === newType
      );

      const updatedMealPlan = { ...movedMeal, date: newDate, type: newType };

      if (droppedMeal) {
        const updatedDroppedMeal = {
          ...droppedMeal,
          date: movedMeal.date,
          type: movedMeal.type,
        };

        Promise.all([
          axiosInstance.put(`/mealplan/${movedMeal.id}`, updatedMealPlan),
          axiosInstance.put(`/mealplan/${droppedMeal.id}`, updatedDroppedMeal),
        ])
          .then(() => {
            setMealData((prevMeals) => {
              const updatedMeals = [...prevMeals];
              const movedIndex = updatedMeals.findIndex(
                (m) => m.id === movedMeal.id
              );
              const droppedIndex = updatedMeals.findIndex(
                (m) => m.id === droppedMeal.id
              );

              if (movedIndex !== -1) updatedMeals[movedIndex] = updatedMealPlan;
              if (droppedIndex !== -1)
                updatedMeals[droppedIndex] = updatedDroppedMeal;

              return updatedMeals;
            });
          })
          .catch((error) =>
            console.error("식단 업데이트 중 오류 발생:", error)
          );
      } else {
        axiosInstance
          .put(`/mealplan/${movedMeal.id}`, updatedMealPlan)
          .then(() => {
            setMealData((prevMeals) =>
              prevMeals.map((meal) =>
                meal.id === movedMeal.id ? updatedMealPlan : meal
              )
            );
          })
          .catch((error) =>
            console.error("식단 업데이트 중 오류 발생:", error)
          );
      }
    },
    [mealData, setMealData]
  );

  // 식단 이행 여부 업데이트
  const updateMeal = (updatedMeal) => {
    axiosInstance
      .put(`/mealplan/${updatedMeal.id}/check`, updatedMeal)
      .then(() => {
        setMealData((prevMeals) =>
          prevMeals.map((meal) =>
            meal.id === updatedMeal.id ? updatedMeal : meal
          )
        );
      })
      .catch((error) =>
        console.error("이행 여부 업데이트 중 오류 발생:", error)
      );
  };

  // 식단 삭제
  const deleteMeal = (mealId) => {
    axiosInstance
      .delete(`/mealplan/${mealId}`)
      .then(() => {
        setMealData((prevMeals) =>
          prevMeals.filter((meal) => meal.id !== mealId)
        );
      })
      .catch((error) => console.error("식단 삭제 중 오류 발생:", error));
  };

  return { handleDragEnd, updateMeal, deleteMeal };
};

export default useMealPlanActions;
