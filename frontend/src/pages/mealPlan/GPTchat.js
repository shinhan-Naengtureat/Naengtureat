import React, { useEffect, useState } from "react";
import axiosInstance from "api/axios";
import useMealPlanContext from "hooks/useMealPlanContext";
import WeeklyMealPlanEditor from "pages/mealPlan/WeeklyMealPlanEditor";
import { startOfWeek, addDays, format } from "date-fns";

const GPTChat = () => {
  const { userSelections } = useMealPlanContext();
  const [mealPlan, setMealPlan] = useState([]); // GPT에서 받은 식단
  const [extraMeals, setExtraMeals] = useState([]); // 추가 식단 저장
  const [foodList, setFoodList] = useState([]); // DB에서 가져온 음식 목록
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  //  요일을 날짜로 변환하는 함수
  const convertDayToDate = (dayString) => {
    const days = ["월", "화", "수", "목", "금", "토", "일"];
    const today = new Date();
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
    const dayIndex = days.indexOf(dayString);

    if (dayIndex === -1) return format(today, "yyyy-MM-dd");
    return format(addDays(startOfThisWeek, dayIndex), "yyyy-MM-dd");
  };

  //  DB에서 음식 목록 불러오기
  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axiosInstance.get("/recipe/recipeList"); // DB에서 음식 목록 가져오기
        if (!Array.isArray(response.data)) {
          console.error(" 올바른 음식 데이터 형식이 아닙니다:", response.data);
          return;
        }
        setFoodList(response.data);
        console.log(" DB에서 불러온 음식 목록:", response.data);
      } catch (error) {
        console.error(" 음식 목록 불러오기 오류:", error);
        setFoodList([]);
      }
    };

    fetchFoodList();
  }, []);

  //  GPT API 호출 및 데이터 변환
  useEffect(() => {
    if (foodList.length === 0) return; // 🚨 음식 목록이 없으면 GPT 호출 X

    const fetchMealPlan = async () => {
      setIsLoading(true);
      setError("");
  console.log("📌 API 호출 전에 userSelections 확인:", userSelections);
      const { budget, days, mealTimes, category, theme, preferredIngredients, excludedIngredients } = userSelections;

      if (!budget || !days || !mealTimes || !category || !theme) {
        console.error("⚠️ 모든 입력 값이 필요합니다!");
        setError("입력값이 부족하여 식단을 생성할 수 없습니다.");
        setIsLoading(false);
        return;
      }

      // GPT가 선택할 음식 목록을 DB 데이터에서 가져옴
      const foodOptions = foodList.map(food => `${food.id}:${food.name}`).join(", ");

      const finalPrompt = `
      너는 전문 영양사야. 아래 'foodOptions' 내 음식으로만 식단을 구성해야 해.
      - 음식 목록: ${foodOptions}
      - 요청 예산: ${budget}원
      - 요청 카테고리 : ${category}
      - 요청 테마 : ${theme}
      - 선호하는 재료: ${preferredIngredients ? preferredIngredients.join(", ") : "없음"}
      - 제외할 재료: ${excludedIngredients ? excludedIngredients.join(", ") : "없음"}
      - 요청 요일: ${days.join(", ")}
      - 요청 끼니: ${mealTimes.join(", ")}


       아래 요구사항을 반드시 지켜야 해:
      1. 요청한 요일과 끼니에 맞게 식단을 구성할 것.
      2. 음식 목록에 포함된 음식만 사용할 것.
      3. 선호하는 재료를 포함하고, 제외할 재료를 포함하지 않을 것.
      4. 예산을 초과하지 않도록 식단을 구성할 것.
      5. 응답 형식은 JSON으로 반환해야 함.

      - 응답 예시:
      {
        "mealPlan": [
          { "day": "월", "mealTime": "아침", "recipeId": 17, "recipeName": "태국식 불고기 샐러드(분짜)" },
          { "day": "월", "mealTime": "점심", "recipeId": 8, "recipeName": "돼지고기 김치찌개" }
        ],
        "extraMeals": ["불고기", "감자수프", "김치볶음밥", "나시고랭"]
      }
      `;

      try {
        const res = await axiosInstance.post(
          "/mealplan",
          {
            model: "gpt-4",
            messages: [{ role: "user", content: finalPrompt, temperature: 0.7 }],
            response_format: { type: "json_object" },
          },
          { headers: { "Content-Type": "application/json" }, timeout: 15000 }
        );

        console.log(" GPT 응답 데이터:", res.data);

        if (!res.data || !Array.isArray(res.data.mealPlan) || !Array.isArray(res.data.extraMeals)) {
          console.error("🚨 GPT 응답 오류: 올바른 데이터가 아님", res.data);
          setError("식단을 불러오는 데 실패했습니다.");
          return;
        }

        //  변환된 식단 데이터 저장
        const formattedMealPlan = res.data.mealPlan.map((meal, index) => ({
          id: `meal-${index}`,
          date: convertDayToDate(meal.day),
          type: meal.mealTime,
          recipeId: meal.recipeId, //  DB의 음식 ID 포함
          recipeName: meal.recipeName, //  음식 이름 포함
        }));

        setMealPlan(formattedMealPlan);
        setExtraMeals(res.data.extraMeals);
       
      } catch (error) {
        console.error(" API 호출 오류:", error);
        setError("식단을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMealPlan();
  }, [foodList]); // foodList가 준비된 후 GPT 요청 실행

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>📋 식단 추천 결과</h2>

      {isLoading && <p>⏳ 식단을 생성 중입니다...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!isLoading && !error && (
        <WeeklyMealPlanEditor initialMealPlan={mealPlan} extraMeals={extraMeals} />
      )}
    </div>
  );
};

export default GPTChat;
