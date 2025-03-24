import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";
import FloatingNextButton from "components/FloatingNextButton";
import "styles/mealPlan/BoxChoice.css";
import BackButton from "components/BackButton";
import axiosInstance from "api/axios";
import useMealPlanContext from "hooks/useMealPlanContext";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";


const ThemeSelectionPage = () => {
  const { userSelections, setUserSelections } = useMealPlanContext();
  const [themes, setThemes] = useState([]); //서버 테마목록
  const [selectedTheme, setSelectedTheme] = useState(userSelections?.theme || []);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await axiosInstance.get(
          "/mealplan/theme"
        );
        if (response.status === 200) {
          setThemes(response.data);
        }
      } catch (error) {
        console.error("테마 API 호출 오류:", error);
      }
    };

    fetchThemes();
  }, []);

  // 카테고리 선택 토글 함수
  const toggleTheme = (theme) => {
    setSelectedTheme((prev) => {
      if (prev.includes(theme)) {
        //이미 선택된 경우 제거
        return prev.filter((c) => c !== theme);
      } else if (prev.length < 2) {
        // 선택된 항목이 2개 미만일 때만 추가
        return [...prev, theme];
      } else {
        toast.warn("최대 2개까지 선택 가능합니다.");
        return prev;
      }
    });
  };

  const handleBefore = () => {
    navigate(RouteConfig.paths.categorySelection);
  };
  const handleNext = () => {
    if (selectedTheme.length === 0) {
      toast.info("테마를 선택해주세요!");
      return;
    }
    setUserSelections((prev) => ({ ...prev, theme: selectedTheme }));

    navigate(RouteConfig.paths.preferredIngredients);
  };
  const pageVariants = {
    initial: { opacity: 0, x: 100 }, // 페이지가 오른쪽에서 시작
    animate: { opacity: 1, x: 0 },   // 정위치로 이동
    exit: { opacity: 0, x: -100 },   // 왼쪽으로 나가기
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }, // 요소들이 순차적으로 등장
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -50 },  // 위에서 떨어지는 효과
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  
  return (
    <motion.div
      className="home-box-container"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {/*  요소들이 하나씩 떨어지듯 등장하는 컨테이너 */}
      <motion.div
        className="box-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 뒤로가기 버튼 */}
        <motion.div variants={itemVariants} className="box-header">
          <BackButton onClick={handleBefore} />
        </motion.div>

        {/* 타이틀 */}
        <motion.h2 variants={itemVariants} className="box-title" style={{ textAlign: "center" }}>
          원하는 <motion.span variants={itemVariants} className="box-highlight">
            테마
          </motion.span>를 선택하세요
        </motion.h2>

        {/* 테마 버튼 목록 */}
        <motion.div variants={containerVariants} className="theme-container">
          {themes.length > 0 ? (
            themes.map((theme) => (
              <motion.button
                key={theme}
                variants={itemVariants}
                onClick={() => toggleTheme(theme)}
                className={`theme-button ${selectedTheme.includes(theme) ? "selected" : ""} transition-all`}
              >
                {theme}
              </motion.button>
            ))
          ) : (
            <motion.p variants={itemVariants} className="loading-text">
              테마를 불러오는 중...
            </motion.p>
          )}
        </motion.div>

        {/* 다음 버튼 */}
        <motion.div variants={itemVariants} className="button-container">
          <FloatingNextButton onClick={handleNext} disabled={selectedTheme.length === 0} />
        </motion.div>
      </motion.div>
            <ToastContainer position="top-center" autoClose={2000} />

    </motion.div>
  );
};
  export default ThemeSelectionPage;
