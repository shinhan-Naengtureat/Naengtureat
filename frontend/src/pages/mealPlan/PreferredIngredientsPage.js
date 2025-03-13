import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/RouteConfig";
import "styles/mealPlan/IngredientPage.css"; // 새로운 CSS 파일 추가

import IngredientCard from "./IngredientCard";
import FloatingNextButton from "components/FloatingNextButton";
import BackButton from "components/BackButton";

const PreferredIngredientsPage = ({ setUserSelections }) => {
  const ingredientsList = [
    {
      name: "돼지고기",
      image: "/assets/images/ingredients/ingre-card/pork.jpg",
    },
    { name: "달걀", image: "/assets/images/ingredients/ingre-card/eggs.jpg" },
    { name: "치즈", image: "/assets/images/ingredients/ingre-card/cheeze.jpg" },
    {
      name: "토마토",
      image: "/assets/images/ingredients/ingre-card/tomato.jpg",
    },
    { name: "참치", image: "/assets/images/ingredients/ingre-card/tuna.jpg" },
    { name: "소고기", image: "/assets/images/ingredients/ingre-card/beaf.jpg" },
    { name: "감자", image: "/assets/images/ingredients/ingre-card/potato.jpg" },
    { name: "양파", image: "/assets/images/ingredients/ingre-card/onion.jpg" },
    { name: "무", image: "/assets/images/ingredients/ingre-card/radish.jpg" },
    {
      name: "요거트",
      image: "/assets/images/ingredients/ingre-card/yogurt.jpg",
    },
    {
      name: "닭고기",
      image: "/assets/images/ingredients/ingre-card/chicken.jpg",
    },
    { name: "식빵", image: "/assets/images/ingredients/ingre-card/bread.jpg" },
    { name: "햄", image: "/assets/images/ingredients/ingre-card/ham.jpg" },
    { name: "우유", image: "/assets/images/ingredients/ingre-card/milk.jpg" },
  ];

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const navigate = useNavigate();

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };
  const handleBefore = () => {
    navigate(RouteConfig.themeSelection);
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

    navigate(RouteConfig.excludedIngredients);
  };

  return (
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
  );
};

export default PreferredIngredientsPage;
