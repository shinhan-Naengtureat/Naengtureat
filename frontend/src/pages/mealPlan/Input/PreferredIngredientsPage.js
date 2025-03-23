import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";
import "styles/mealPlan/IngredientPage.css"; // 새로운 CSS 파일 추가

import IngredientCard from "../IngredientCard";
import FloatingNextButton from "components/FloatingNextButton";
import BackButton from "components/BackButton";
import { INGREDIENT_IMAGE_PATH } from "config/pathConfig";
import useMealPlanContext from "hooks/useMealPlanContext";

const PreferredIngredientsPage = () => {
  const ingredientsList = [
    { name: "돼지고기", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/pork.jpg`,},
    { name: "달걀", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/eggs.jpg` },
    { name: "치즈", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/cheeze.jpg` },
    { name: "토마토", image:`${ INGREDIENT_IMAGE_PATH }/ingre-card/tomato.jpg`,},
    { name: "참치", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/tuna.jpg` },
    { name: "소고기", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/beaf.jpg` },
    { name: "감자", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/potato.jpg` },
    { name: "양파", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/onion.jpg` },
    { name: "무", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/radish.jpg` },
    { name: "요거트", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/yogurt.jpg`,},
    { name: "닭고기", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/chicken.jpg`,},
    { name: "식빵", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/bread.jpg` },
    { name: "햄", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/ham.jpg` },
    { name: "우유", image: `${ INGREDIENT_IMAGE_PATH }/ingre-card/milk.jpg` },
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
    if (selectedIngredients.length === 0) {
      alert("선호하는 재료를 하나 이상 선택해주세요!");
      return;
    }

    setUserSelections((prev) => ({
      ...prev,
      preferredIngredients: selectedIngredients,
    }));

    navigate(RouteConfig.paths.excludedIngredients);
  };

  return (
     <div className="home-box-container2">
    <div className="preferred-ingredients-container">
      {/* 뒤로가기 & 타이틀 */}
      <div className="preferred-header">
        <BackButton onClick={handleBefore} />
      </div>

      <h2 className="preferred-title">취향에 맞는 레시피를 추천해드립니다.</h2>
      <h2 className="preferred-subtitle">선호하는 재료를 선택하세요</h2>

      {/* 재료 선택 (그리드) */}
      <div className="preferred-ingredient-grid">
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

export default PreferredIngredientsPage;
