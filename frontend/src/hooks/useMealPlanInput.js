import { useState, useRef, useEffect } from "react";
import axiosInstance from "api/axios";
import useMealPlanContext from "hooks/useMealPlanContext";

const useMealPlanInput = () => {
  const { userSelections, setUserSelections } = useMealPlanContext(); //  Context에서 데이터 가져오기
  const [budget, setBudget] = useState(userSelections?.budget || ""); 
  const [memberInfo, setMemberInfo] = useState(null); 
  const inputRef = useRef(null);

  // 기존 예산 정보 가져오기 (API 호출)
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await axiosInstance.get("/member/detail");
        if (response.status === 200) {
          console.log("회원 정보 조회 성공", response.data);
          setMemberInfo(response.data);
        } else {
          console.error("회원 정보 조회 실패:", response);
        }
      } catch (error) {
        console.error("회원 정보 가져오기 실패:", error);
      }
    };

    fetchMemberInfo();
  }, []);

  //  숫자 입력 핸들러 (콤마 및 "원" 자동 처리 + 커서 유지)
  const handleBudgetChange = (e) => {
    let value = e.target.value.replace(/,/g, "").replace("원", "").trim();
    if (!/^\d*$/.test(value)) return; // 숫자가 아닐 경우 무시
    setBudget(value);

    requestAnimationFrame(() => {
      if (inputRef.current) {
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length - 2, length - 2);
      }
    });
  };

  //  예산 저장 후 상태 업데이트
  const saveBudget = async (navigate) => {
    if (!budget || isNaN(budget)) {
      alert("올바른 숫자를 입력해주세요!");
      return;
    }

    try {
      const response = await axiosInstance.put("/mealplan/budget", {
        budget: parseInt(budget, 10),
      });

      if (response.status === 200) {
        console.log("예산 저장 성공", response.data);
        setUserSelections((prev) => ({ ...prev, budget }));
        navigate("/category"); //  다음 페이지 이동
      } else {
        console.error("예산 업데이트 실패:", response);
      }
    } catch (error) {
      console.error("예산 업데이트 실패", error);
    }
  };

  return {
    budget,
    memberInfo,
    inputRef,
    handleBudgetChange,
    saveBudget,
  };
};

export default useMealPlanInput;
