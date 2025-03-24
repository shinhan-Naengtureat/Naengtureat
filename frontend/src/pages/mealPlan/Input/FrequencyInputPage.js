import BackButton from "components/BackButton";
import FloatingNextButton from "components/FloatingNextButton";
import { ICON_IMAGE_PATH } from "config/pathConfig";
import useMealPlanContext from "hooks/useMealPlanContext";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";
import styled from "styled-components";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { motion } from "framer-motion";
import "styles/mealPlan/FrequencyInputPage.css";
import { toast, ToastContainer } from "react-toastify";

const meals = [
    { id: "아침",icon:`${ICON_IMAGE_PATH}/breakfast.png` },
    { id: "점심",icon:`${ICON_IMAGE_PATH}/lunch.png` },
    { id: "저녁",icon:`${ICON_IMAGE_PATH}/dinner.png` },

]

const FrequencyInputPage = () => {
  const { userSelections, setUserSelections } = useMealPlanContext();
  const navigate = useNavigate();
  
  const [selectedMeals, setSelectedMeals] = useState(userSelections?.mealTimes || []);
  const [selectedDays, setSelectedDays] = useState(userSelections?.days || []);

  const toggleMeal = (meal) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };
  // 오늘 요일 확인 (format으로 한글 요일 변환)
  const today = format(new Date(), "E", { locale: ko });
  const weekDays = ["월", "화", "수", "목", "금", "토", "일", "전체"];
  
  //  오늘을 포함한 이전 요일을 비활성화
  const disabledDays = weekDays.slice(0, weekDays.indexOf(today) + 1);

  const toggleDay = (day) => {
    if (disabledDays.includes(day)) return; // 이전 요일 선택 방지
    
    if (day === "전체") {
      setSelectedDays((prev) =>
        prev.includes("전체") ? [] : ["전체", "월", "화", "수", "목", "금", "토", "일"].filter(d => !disabledDays.includes(d))
      );
    } else {
      setSelectedDays((prev) => {
        const filteredDays = prev.filter((d) => d !== "전체");
        return prev.includes(day) ? filteredDays.filter((d) => d !== day) : [...filteredDays, day];
      });
    }
  };
 
  const totalMeals = selectedMeals.length * (selectedDays.includes("전체") ? 7 - disabledDays.length : selectedDays.length);

  // 뒤로가기기
  const handleBefore = () => {
    navigate(RouteConfig.paths.excludedIngredients);
  };

  // 다음 버튼 클릭 시 Context에 저장 후 이동
  const handleNext = () => {
    if (selectedMeals.length === 0 || selectedDays.length === 0) {
      toast.info("요일과 끼니를 모두 선택해주세요!");
      return;
    }
    setUserSelections((prev) => ({
      ...prev,
      mealTimes: selectedMeals, //  선택한 식사 저장
      days: selectedDays, //  선택한 요일 저장
      mealCount: totalMeals,
    }));

    navigate(RouteConfig.paths.makeMealPlan); //  GPTChat 페이지로 이동
  };
  //  페이지 슬라이드 인 효과
  const pageVariants = {
    initial: { opacity: 0, x: 100 }, // 페이지가 오른쪽에서 등장
    animate: { opacity: 1, x: 0 },   // 정위치로 이동
    exit: { opacity: 0, x: -100 },   // 왼쪽으로 나가기
  };

  //  컨테이너 (부모 요소) 애니메이션 - 요소들이 순차적으로 등장
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }, // 요소들이 순차적으로 등장
    },
  };

  //  일반 텍스트 요소 (제목, 설명)
  const itemVariants = {
    hidden: { opacity: 0, y: -50 },  // 위에서 떨어지는 효과
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  //  버튼 스타일 애니메이션 (끼니 선택, 요일 선택)
  const buttonVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.9 }, // 약간 축소된 상태에서 위에서 등장
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="home-box-container2"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      
        {/* 뒤로가기 버튼 */}
        <motion.div variants={itemVariants} className="preferred-header">
          <BackButton onClick={handleBefore} />
        </motion.div>
      <motion.div
        className="container-fre"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* 타이틀 */}
        <motion.div variants={itemVariants} className="header-fre">
          <motion.h2 variants={itemVariants} className="title1-fre">이번주</motion.h2>
          <motion.h2 variants={itemVariants} className="title2-fre">몇 개의 식단을 만들어드릴까요?</motion.h2>
          <motion.div variants={itemVariants} className="count-section">
            <motion.div variants={itemVariants} className="count-text">
              총 <motion.span className="count-number">{totalMeals}</motion.span>
              <motion.span className="count-unit">회</motion.span>
            </motion.div>
            <motion.div variants={itemVariants} className="count-line"></motion.div>
            <motion.p variants={itemVariants} className="sub-text">를 선택하셨어요</motion.p>
          </motion.div>
        </motion.div>

        {/* 끼니 선택 */}
        <motion.div variants={containerVariants} className="meal-container">
          {meals.map((meal) => (
            <motion.button
              key={meal.id}
              variants={buttonVariants}
              className="meal-button"
              data-selected={selectedMeals.includes(meal.id)}
              onClick={() => toggleMeal(meal.id)}
            >
              <motion.img className="meal-icon" src={meal.icon} alt={meal.id} />
              {meal.id}
            </motion.button>
          ))}
        </motion.div>

        {/* 요일 선택 */}
        <motion.div variants={itemVariants} className="line"></motion.div>
        <motion.div variants={containerVariants} className="day-container">
          {weekDays.map((day) => (
            <motion.button
              key={day}
              variants={buttonVariants}
              className="day-button"
              data-selected={selectedDays.includes(day)}
              data-disabled={disabledDays.includes(day)}
              disabled={disabledDays.includes(day)}
              style={{
                opacity: disabledDays.includes(day) ? 0.5 : 1,
                cursor: disabledDays.includes(day) ? "not-allowed" : "pointer",
              }}
              onClick={() => toggleDay(day)}
            >
              {day}
            </motion.button>
          ))}
        </motion.div>

        {/* 다음 버튼 */}
        <motion.div variants={itemVariants} className="button-container" style={{width:"327px"}}>
          <FloatingNextButton onClick={handleNext} disabled={totalMeals.length === 0} />
        </motion.div>
      </motion.div>
            <ToastContainer position="top-center" autoClose={2000} />

    </motion.div>
  );
};

export default FrequencyInputPage;
