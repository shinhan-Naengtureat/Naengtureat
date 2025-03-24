import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";
import "styles/mealPlan/IngredientPage.css"; // 새로운 CSS 파일 추가

import IngredientCard from "../IngredientCard";
import FloatingNextButton from "components/FloatingNextButton";
import BackButton from "components/BackButton";
import { INGREDIENT_IMAGE_PATH } from "config/pathConfig";
import useMealPlanContext from "hooks/useMealPlanContext";
import { motion } from "framer-motion";


const PreferredIngredientsPage = () => {
  const ingredientsList = [
    { name: "돼지고기", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/pork.jpg`, },
    { name: "달걀", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/eggs.jpg` },
    { name: "치즈", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/cheeze.jpg` },
    { name: "토마토", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/tomato.jpg`, },
    { name: "참치", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/tuna.jpg` },
    { name: "소고기", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/beaf.jpg` },
    { name: "감자", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/potato.jpg` },
    { name: "양파", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/onion.jpg` },
    { name: "무", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/radish.jpg` },
    { name: "요거트", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/yogurt.jpg`, },
    { name: "닭고기", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/chicken.jpg`, },
    { name: "식빵", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/bread.jpg` },
    { name: "햄", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/ham.jpg` },
    { name: "우유", image: `${INGREDIENT_IMAGE_PATH}/ingre-card/milk.jpg` },
  ];

  const { userSelections, setUserSelections } = useMealPlanContext();
  const navigate = useNavigate();
  const [selectedIngredients, setSelectedIngredients] = useState(userSelections?.preferredIngredients || []);

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };
  const handleBefore = () => {
    navigate(RouteConfig.paths.themeSelection);
  };

  const handleNext = () => {
  setUserSelections((prev) => ({
    ...prev,
    preferredIngredients: selectedIngredients.length > 0 ? selectedIngredients : [],
  }));

  navigate(RouteConfig.paths.excludedIngredients);
};
  const pageVariants = {
    initial: { opacity: 0, x: 100 }, // 페이지가 오른쪽에서 등장
    animate: { opacity: 1, x: 0 },   // 제자리로 이동
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
      className="home-box-container2"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="preferred-ingredients-container"
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
          선호하는 재료를 선택하세요
        </motion.h2>

        {/* 재료 선택 (그리드) */}
        <motion.div variants={containerVariants} className="preferred-ingredient-grid">
          {ingredientsList.map(({ name, image }) => (
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
          <FloatingNextButton onClick={handleNext} disabled={false} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PreferredIngredientsPage;
