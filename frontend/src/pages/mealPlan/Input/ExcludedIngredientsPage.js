import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";
import "styles/mealPlan/IngredientPage.css"; 
import IngredientCard from "pages/mealPlan/IngredientCard";
import FloatingNextButton from "components/FloatingNextButton";
import BackButton from "components/BackButton";
import { INGREDIENT_IMAGE_PATH } from "config/pathConfig";
import useMealPlanContext from "hooks/useMealPlanContext";
const ExcludedIngredientsPage = ( ) => {
  const ingredientsList = [
    { name: "땅콩", image: `${ INGREDIENT_IMAGE_PATH }/hate-card/peanut.jpg`},
    { name: "복숭아", image: `${ INGREDIENT_IMAGE_PATH }/hate-card/pitch.jpg` },
    { name: "오이", image: `${  INGREDIENT_IMAGE_PATH }/hate-card/cucumber.jpg`,},
    { name: "달걀", image: `${  INGREDIENT_IMAGE_PATH }/hate-card/egg.jpg`,},
    { name: "밀가루", image: `${  INGREDIENT_IMAGE_PATH }/hate-card/wheat.jpg` },
    { name: "게", image: `${  INGREDIENT_IMAGE_PATH }/hate-card/crab.jpg` },
    { name: "새우", image: `${  INGREDIENT_IMAGE_PATH }/hate-card/shrimp.jpg` },
    { name: "홍합", image: `${  INGREDIENT_IMAGE_PATH }/hate-card/shell.jpg` },
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
    if (selectedIngredients.length === 0) {
      alert("제외할 재료를 선택해주세요!");
      return;
    }

    setUserSelections((prev) => ({
      ...prev,
      excludedIngredients: selectedIngredients,
    }));
    

    navigate(RouteConfig.paths.frequencyMealPlan); // 횟수입력 페이지로 이동
  };
  // 뒤로가기기
  const handleBefore = () => {
    navigate(RouteConfig.paths.preferredIngredients);
  };

  return (
    <div className="home-box-container3">
    <div className="preferred-ingredients-container2">
      {/* 뒤로가기 & 타이틀 */}
      <div className="preferred-header">
        <BackButton onClick={handleBefore} />
      </div>
      <h2 className="preferred-title">취향에 맞는 레시피를 추천해드립니다.</h2>
      <h2 className="preferred-subtitle">제외할 재료를 선택하세요</h2>
     

      {/*  재료 선택 (그리드) */}
      <div className="ingredient-grid2">
        {ingredientsList.map(({ name, image }) => (
          <IngredientCard
            key={name}
            name={name}
            image={image}
            isSelected={selectedIngredients.includes(name)}
            onToggle={toggleIngredient}
          />
        ))}
      </div>

      <FloatingNextButton
        onClick={handleNext}
        disabled={selectedIngredients.length === 0}
        />
        </div>
    </div>
  );
};

export default ExcludedIngredientsPage;
