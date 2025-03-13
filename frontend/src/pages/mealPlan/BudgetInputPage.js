import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RouteConfig from "routes/RouteConfig";
import FloatingNextButton from "components/FloatingNextButton";
import "styles/mealPlan/BudgetInput.css";

const BudgetInputPage = ({ setUserSelections }) => {
  const [budget, setBudget] = useState("");
  const navigate = useNavigate();

  // 예산api, 저장
  const handleNext = async () => {
    if (!budget) {
      alert("예산을 입력해주세요!");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:8888/mealplan/budget",
        {
          budget: parseInt(budget, 10), //숫자로 변환하여 전송
        }
      );

      if (response.status === 200) {
        console.log("예산 저장 성공", response.data);
        // 상태 업데이트 후 다음 페이지로 이동
        setUserSelections((prev) => ({ ...prev, budget }));
        navigate(RouteConfig.categorySelection);
      } else {
        console.error("예산 업데이트 실패:", response);
        alert("예산 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("예산 업데이트 실패", error);
      alert("서버에 연결할 수 없습니다.");
    }
  };

  return (
    <div className="budget-container">
      {/* 타이틀 */}
      <h2 className="budget-subtitle">내가 추천 받고 싶은 식단에 대한</h2>
      <h2 className="budget-title">상세한 정보를 입력해주세요.</h2>
      {/* 예산입력 */}
      <div className="budget-input-container">
        <h3 className="budget-heading">1주일 식단</h3>
        <h2 className="budget-label">예산을 입력해주세요</h2>

        {/* 예산 입력 필드 */}
        <div className="budget-input-wrapper">
          <input
            type="number"
            className="budget-input"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="디폴트 값 원"
          />
        </div>
      </div>
      <p className="budget-info-text">기존에 설정된 예산은 ---입니다.</p>
      {/* 다음 버튼 */}

      <FloatingNextButton
        onClick={handleNext}
        disabled={setBudget.length === 0}
      />

      {/* //api 호출 후 다음페이지 이동 */}
    </div>
  );
};

export default BudgetInputPage;
