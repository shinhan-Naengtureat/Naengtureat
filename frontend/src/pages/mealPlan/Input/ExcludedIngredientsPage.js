import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";
import "styles/mealPlan/IngredientPage.css"; 
import IngredientCard from "pages/mealPlan/IngredientCard";
import FloatingNextButton from "components/FloatingNextButton";
import BackButton from "components/BackButton";
import { INGREDIENT_IMAGE_PATH } from "config/pathConfig";
import useMealPlanContext from "hooks/useMealPlanContext";
import { motion } from "framer-motion";


const ExcludedIngredientsPage = () => {
  const ingredientsList = [
    { name: "땅콩", image: `${INGREDIENT_IMAGE_PATH}/hate-card/peanut.jpg` },
    { name: "복숭아", image: `${INGREDIENT_IMAGE_PATH}/hate-card/pitch.jpg` },
    { name: "오이", image: `${INGREDIENT_IMAGE_PATH}/hate-card/cucumber.jpg`, },
    { name: "달걀", image: `${INGREDIENT_IMAGE_PATH}/hate-card/egg.jpg`, },
    { name: "밀가루", image: `${INGREDIENT_IMAGE_PATH}/hate-card/wheat.jpg` },
    { name: "게", image: `${INGREDIENT_IMAGE_PATH}/hate-card/crab.jpg` },
    { name: "새우", image: `${INGREDIENT_IMAGE_PATH}/hate-card/shrimp.jpg` },
    { name: "홍합", image: `${INGREDIENT_IMAGE_PATH}/hate-card/shell.jpg` },
  ];
  const { userSelections, setUserSelections } = useMealPlanContext();
  const [selectedIngredients, setSelectedIngredients] = useState(userSelections?.excludedIngredients || []);
  const navigate = useNavigate();

  //  선택/해제 함수
  const toggleIngredient = (ingredient) => {
    setSelectedIngredients(
      (prev) =>
        prev.includes(ingredient)
          ? prev.filter((item) => item !== ingredient) // 선택 해제
          : [...prev, ingredient] // 선택 추가
    );
  };

  //  다음 버튼 클릭 시 저장 & 이동
  const handleNext = () => {
    setSelectedIngredients((prev) => ({
      ...prev,
      excludedIngredients: selectedIngredients > 0? selectedIngredients:[],
    }));

    navigate(RouteConfig.paths.frequencyMealPlan); // 횟수입력 페이지로 이동
  };
  // 뒤로가기기
  const handleBefore = () => {
    navigate(RouteConfig.paths.preferredIngredients);
  };
  const pageVariants = {
    initial: { opacity: 0, x: 100 }, // 페이지가 오른쪽에서 등장
    animate: { opacity: 1, x: 0 },   // 정위치로 이동
    exit: { opacity: 0, x: -100 },   // 왼쪽으로 나가기
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }, // 요소들이 순차적으로 등장
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -50 },  // 위에서 떨어지는 효과
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: -50 }, // 재료 카드도 위에서 떨어지듯 등장
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };
  return (
    <motion.div
      className="home-box-container3"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="preferred-ingredients-container2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 뒤로가기 버튼 */}
        <motion.div variants={itemVariants} className="preferred-header">
          <BackButton onClick={handleBefore} />
        </motion.div>

        {/* 타이틀 */}
        <motion.h2 variants={itemVariants} className="preferred-title">
          취향에 맞는 레시피를 추천해드립니다.
        </motion.h2>
        <motion.h2 variants={itemVariants} className="preferred-subtitle">
          제외할 재료를 선택하세요
        </motion.h2>

        {/* 재료 선택 (그리드) */}
        <motion.div variants={containerVariants} className="ingredient-grid2">
          {Array.isArray(selectedIngredients)&&ingredientsList.map(({ name, image }) => (
            <motion.div key={name} variants={cardVariants}>
              <IngredientCard
                name={name}
                image={image}
                isSelected={selectedIngredients.includes(name)}
                onToggle={toggleIngredient}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* 다음 버튼 */}
        <motion.div variants={itemVariants} className="button-container">
          <FloatingNextButton onClick={handleNext}
            disabled={false} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ExcludedIngredientsPage;
