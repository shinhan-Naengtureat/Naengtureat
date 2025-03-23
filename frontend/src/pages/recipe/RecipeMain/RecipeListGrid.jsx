import { RECIPE_IMAGE_PATH } from "config/pathConfig";
import React from "react";
import { useNavigate } from "react-router-dom";
import routeConfig from "routes/routeConfig";

function RecipeListGrid({ recipes }) {
  const navigate = useNavigate();
  return (
    <div className="recipe-list-grid">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="recipe-card"
          onClick={() => navigate(routeConfig.paths.recipeDetail.replace(":recipeId", recipe.id))}
        >
          <img src={`${RECIPE_IMAGE_PATH}/${recipe.image}`} alt={recipe.name} />
          <div className="recipe-info">
            <h3>{recipe.name}</h3>
            <p>{recipe.level}</p>
            <p>{recipe.cookingTime}</p>
            <p>{recipe.memberName}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeListGrid;
