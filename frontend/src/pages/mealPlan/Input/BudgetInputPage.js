import React from "react";
import FloatingNextButton from "components/FloatingNextButton";
import { useNavigate } from "react-router-dom";
import "styles/mealPlan/BudgetInput.css";
import useMealPlanInput from "hooks/useMealPlanInput";
import { motion } from "framer-motion";

const BudgetInputPage = () => {
  const { budget, memberInfo, inputRef, handleBudgetChange, saveBudget } = useMealPlanInput(); // Hook 사용
  const navigate = useNavigate();

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15, // 0.15초 간격으로 자식 등장
    },
  },
  };
  const pageVariants = {
  initial: { opacity: 0, x: 100 },     // 오른쪽에서 들어옴
  animate: { opacity: 1, x: 0 },       // 제자리
  exit: { opacity: 0, x: -100 },       // 왼쪽으로 나감
  };
  const pageTransition = {
  duration: 0.5, // 0.5초 애니메이션
};
const itemVariants = {
  hidden: { opacity: 0, y: -20 }, // 처음에는 위쪽에 있음
  visible: { opacity: 1, y: 0 },  // 점점 내려오면서 나타남
};
  return (
    
    <motion.div
  className="home-box-container"
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={pageTransition}
>
  <motion.div
    className="budget-container"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
      {/* 타이틀 */}
      <motion.h2 variants={itemVariants} className="budget-subtitle">내가 추천 받고 싶은 식단에 대한</motion.h2>
      <motion.h2 variants={itemVariants} className="budget-title">상세한 정보를 입력해주세요.</motion.h2>
      
      {/* 예산입력 */}
      <motion.div variants={itemVariants} className="budget-input-container">
        <motion.h3 variants={itemVariants} className="budget-heading" />1주일 식단
        <motion.h2 variants={itemVariants} className="budget-label" />예산을 입력해주세요

        {/* 예산 입력 필드 */}
        <motion.div variants={itemVariants} className="budget-input-wrapper">
          <motion.input variants={itemVariants}
            ref={inputRef}
          type="text"
          className="budget-input"
          value={budget ? `${budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원`: ""}
          onChange={handleBudgetChange} // 입력 시 콤마 제거
          placeholder="0 원"
          />
        </motion.div>
      </motion.div>
      
      {/* 기존 예산 정보 */}
      <motion.p variants={itemVariants} className="budget-info-text">
        {memberInfo && memberInfo.budget ? (
         <motion.span variants={itemVariants}>기존에 설정된 예산은 {memberInfo.budget.toLocaleString("ko-KR")}원 입니다.</motion.span>
      ):(
        <motion.span variants={itemVariants}>기존 예산 불러오는중...</motion.span>
      )}
      </motion.p>
        
      
      {/* 다음 버튼 */}
<motion.div variants={itemVariants} className="button-container">
          <FloatingNextButton  onClick={() => saveBudget(navigate)} disabled={budget.length === 0} />
          </motion.div>
</motion.div>
    </motion.div>
  );
};

export default BudgetInputPage;
