import React from "react";
import FloatingNextButton from "components/FloatingNextButton";
import { useNavigate } from "react-router-dom";
import "styles/mealPlan/BudgetInput.css";
import useMealPlanInput from "hooks/useMealPlanInput";


const BudgetInputPage = () => {
  const { budget, memberInfo, inputRef, handleBudgetChange, saveBudget } = useMealPlanInput(); // Hook 사용
  const navigate = useNavigate();

  return (
     <div className="home-box-container">
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
            ref={inputRef}
          type="text"
          className="budget-input"
          value={budget ? `${budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원`: ""}
          onChange={handleBudgetChange} // 입력 시 콤마 제거
          placeholder="0 원"
          />
        </div>
      </div>
      
      {/* 기존 예산 정보 */}
      <p className="budget-info-text">
        {memberInfo && memberInfo.budget ? (
         <span>기존에 설정된 예산은 {memberInfo.budget.toLocaleString("ko-KR")}원 입니다.</span>
      ):(
        <span>기존 예산 불러오는중...</span>
      )}
      </p>
        
      
      {/* 다음 버튼 */}

       <FloatingNextButton onClick={() => saveBudget(navigate)} disabled={budget.length === 0} />
</div>
    </div>
  );
};

export default BudgetInputPage;
