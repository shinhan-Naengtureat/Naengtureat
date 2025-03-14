import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";
import FloatingNextButton from "components/FloatingNextButton";
import "styles/mealPlan/BudgetInput.css";
import axiosInstance from "api/axios";
import { useMealPlan } from "context/MealPlanContext"; 

const BudgetInputPage = () => {
  const { userSelections, setUserSelections } = useMealPlan();
  const [budget, setBudget] = useState(userSelections.budget || ""); 
  const [memberInfo, setMemberInfo] = useState(null); // 기존 예산 저장할 상태 추가
  const navigate = useNavigate();


 //회원 정보 API 호출 (기존 예산 가져오기)
   useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await axiosInstance.get("/member/detail");
        if (response.status === 200) {
          console.log("회원 정보 조회 성공", response.data);
          setMemberInfo(response.data); // 기존 예산 상태 업데이트
        } else {
          console.error("회원 정보 조회 실패:", response);
        }
      } catch (error) {
        console.error("회원 정보 가져오기 실패:", error);
      }
     };
     
  fetchMemberInfo();
  }, []); // 첫 렌더링 시 한 번 실행됨

  //  예산 저장 후 다음 페이지 이동
  const handleNext = async () => {
    if (!budget) {
      alert("예산을 입력해주세요!");
      return;
    }

    try {
      const response = await axiosInstance.put("/mealplan/budget", {
        budget: parseInt(budget, 10), // 숫자로 변환하여 전송
      });

      if (response.status === 200) {
        console.log("예산 저장 성공", response.data);

        //  상태 업데이트 후 다음 페이지로 이동
        setUserSelections((prev) => ({ ...prev, budget }));
        navigate(RouteConfig.paths.categorySelection);
      } else {
        console.error("예산 업데이트 실패:", response);
      }
    } catch (error) {
      console.error("예산 업데이트 실패", error);
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
          type="text"
          className="budget-input"
          value={budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          onChange={(e) => setBudget(e.target.value.replace(/,/g, ""))} // 입력 시 콤마 제거
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

      <FloatingNextButton
        onClick={handleNext}
        disabled={budget.length === 0}
      />

      {/* //api 호출 후 다음페이지 이동 */}
    </div>
  );
};

export default BudgetInputPage;
