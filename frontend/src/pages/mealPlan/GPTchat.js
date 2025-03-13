import React, { useState } from "react";
import axios from "axios";

const GPTChat = () => {
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [mealTimes, setMealTimes] = useState("");
  const [category, setCategory] = useState(""); //  카테고리 추가
  const [theme, setTheme] = useState(""); //  테마 추가
  const [preferredIngredients, setPreferredIngredients] = useState([]); //  선호 재료 추가
  const [excludedIngredients, setExcludedIngredients] = useState([]); //  제외 재료 추가
  const [mealPlan, setMealPlan] = useState([]);

  // 기본 프롬프트
  const defaultPrompt = `
    역할: 너는 영양사야.
    내 정보: 성인, 31살.
    요청: 내 정보, 'budget', 'category', 'theme', 'preferredIngredients', 'excludedIngredients', 'mealTimes', 'days'을 고려해서 식단표 짜줘.
    결과물 : json형식 '식단표'라는 key에 담아서 식단표만 반환 {요일, 식사시간, 음식명}.
  `;

  // API 호출 함수
  const sendPromptToGPT = async () => {
    if (!budget || !days || !mealTimes || !category || !theme) {
      alert("모든 입력 값을 입력해주세요!");
      return;
    }

    // ✅ 사용자 입력을 포함한 최종 프롬프트 생성
    const finalPrompt = `
      ${defaultPrompt}
      예산: ${budget}원.
      카테고리: ${category}.
      테마: ${theme}.
      선호 재료: ${preferredIngredients.join(", ")}.
      제외 재료: ${excludedIngredients.join(", ")}.
      요일: ${days}.
      원하는 식사시간: ${mealTimes}.
    `;

    try {
      const res = await axios.post(
        "http://localhost:8888/mealplan",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: finalPrompt, temperature: 0.7 }],
          response_format: { type: "json_object" },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("GPT 응답(JSON):", res.data);
      if (!res.data || !res.data.식단표) {
        console.error("❌ OpenAI API 응답 오류 (식단표 없음):", res.data);
        return;
      }

      setMealPlan(res.data.식단표);
    } catch (error) {
      if (error.response) {
        console.error("❌ API 응답 오류:", error.response.data);
      } else if (error.request) {
        console.error("❌ 서버 응답 없음:", error.request);
      } else {
        console.error("❌ 요청 설정 오류:", error.message);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>맞춤 식단 추천</h2>

      {/* 예산 입력 */}
      <div>
        <label>예산 (원): </label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>

      {/* 카테고리 선택 */}
      <div>
        <label>카테고리: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">선택하세요</option>
          <option value="한식">한식</option>
          <option value="양식">양식</option>
          <option value="중식">중식</option>
        </select>
      </div>

      {/* 테마 선택 */}
      <div>
        <label>테마: </label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="">선택하세요</option>
          <option value="다이어트">다이어트</option>
          <option value="고단백">고단백</option>
          <option value="채식">채식</option>
        </select>
      </div>

      {/* 선호 재료 입력 */}
      <div>
        <label>선호 재료: </label>
        <input
          type="text"
          placeholder="쉼표로 구분 (ex: 닭가슴살, 고구마)"
          value={preferredIngredients.join(", ")}
          onChange={(e) => setPreferredIngredients(e.target.value.split(", "))}
        />
      </div>

      {/* 제외 재료 입력 */}
      <div>
        <label>제외 재료: </label>
        <input
          type="text"
          placeholder="쉼표로 구분 (ex: 돼지고기, 우유)"
          value={excludedIngredients.join(", ")}
          onChange={(e) => setExcludedIngredients(e.target.value.split(", "))}
        />
      </div>

      {/* 원하는 요일 입력 */}
      <div>
        <label>원하는 요일 (예: 화, 수): </label>
        <input
          type="text"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
      </div>

      {/* 식사 시간 입력 */}
      <div>
        <label>식사 시간 (예: 아침, 저녁): </label>
        <input
          type="text"
          value={mealTimes}
          onChange={(e) => setMealTimes(e.target.value)}
        />
      </div>

      <br />
      <button onClick={sendPromptToGPT}>GPT에게 질문하기</button>

      {/* 식단표 출력 */}
      {mealPlan.length > 0 && (
        <div>
          <h3>식단표</h3>
          <table border="1" style={{ margin: "auto", width: "50%" }}>
            <thead>
              <tr>
                <th>요일</th>
                <th>식사시간</th>
                <th>음식명</th>
              </tr>
            </thead>
            <tbody>
              {mealPlan.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.요일}</td>
                  <td>{meal.식사시간}</td>
                  <td>{meal.음식명}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GPTChat;
