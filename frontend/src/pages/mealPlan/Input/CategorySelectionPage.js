import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";
import { motion } from "framer-motion";
import FloatingNextButton from "components/FloatingNextButton";
import BackButton from "components/BackButton";
import "styles/mealPlan/BoxChoice.css";
import axiosInstance from "api/axios";
import useMealPlanContext from "hooks/useMealPlanContext";

const CategorySelectionPage = () => {
  const { userSelections, setUserSelections } = useMealPlanContext(); 
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(userSelections?.category || []); // 기존 선택값 유지
  const navigate = useNavigate();
 
  // 백엔드에서 카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "/mealplan/category"
        );
        if (response.status === 200) {
          setCategories(response.data); // 받아온 카테고리 목록 설정
        }
      } catch (error) {
        console.error("카테고리 API 호출 오류:", error);
      }
    };

    fetchCategories();
  }, []);

  // 카테고리 선택 토글 함수
  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        //이미 선택된 경우 제거
        return prev.filter((c) => c !== category);
      } else if (prev.length < 2) {
        // 선택된 항목이 2개 미만일 때만 추가
        return [...prev, category];
      } else {
        alert("카테고리는 최대 2개까지 선택 가능합니다.");
        return prev;
      }
    });
  };

  const handleBefore = () => {
    navigate(RouteConfig.paths.budgetInput);
  };
  // 다음 버튼 클릭 시 데이터 저장 및 이동
  const handleNext = () => {
    if (selectedCategories.length === 0) {
      alert("카테고리를 하나 이상 선택해주세요!");
      return;
    }

    setUserSelections((prev) => ({
      ...prev,
      category: selectedCategories, //선택된 카테고리 저장
    }));

    navigate(RouteConfig.paths.themeSelection); //테마 선택 페이지로 이동
  };


  const pageVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };


const itemVariants = {
  hidden: { opacity: 0, y: -20 }, // 처음에는 위쪽에 있음
  visible: { opacity: 1, y: 0, transition:{durtaion:0.6,ease:"easeOut"} },  // 점점 내려오면서 나타남
};
  return (
    <motion.div className="home-box-container"
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
      transition={{ duration: 0.5 } }
    >
    <motion.div 
      className="box-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
        {/* 뒤로가기 & 타이틀 */}
         
      <motion.div variants={itemVariants} className="box-header">
       <BackButton onClick={handleBefore} />
      </motion.div>

      <motion.h2 variants={itemVariants} className="box-title" style={{textAlign:"center"}}>
        식단표에 추가하고 싶은 <br />
        <span className="box-highlight">카테고리를 모두 선택하세요</span>
      </motion.h2>

      {/*카테고리 버튼 목록 */}
      <motion.div variants={containerVariants} className="theme-container">
        {categories.length > 0 ? (
          categories.map((category) => (
            <motion.button
              variants={itemVariants}
              key={category}
              onClick={() => toggleCategory(category)}
              className={`theme-button ${
                selectedCategories.includes(category) ? "selected" : ""
              } transition-all`}
            >
              {category}
            </motion.button>
          ))
        ) : (
          <motion.p variants={itemVariants} className="loading-text">카테고리를 불러오는 중...</motion.p>
        )}
      </motion.div>

        {/*다음 버튼 */}
        <motion.div variants={itemVariants} className="button-container">
      <FloatingNextButton
        onClick={handleNext}
        disabled={selectedCategories.length === 0}
      /></motion.div>
      </motion.div>
     </motion.div>
  );
};
export default CategorySelectionPage;
