import { RECIPE_IMAGE_PATH } from "config/pathConfig";
import React from "react";
import { useNavigate } from "react-router-dom";
import routeConfig from "routes/routeConfig";
import { FiBarChart } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";

function RecipeListGrid({ recipes }) {
  const navigate = useNavigate();
  return (
    <div className="recipe-list-grid">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="recipe-card"
          onClick={() =>
            navigate(
              routeConfig.paths.recipeDetail.replace(":recipeId", recipe.id)
            )
          }
        >
          <img
            src={`${RECIPE_IMAGE_PATH}/${recipe.image}`}
            alt={recipe.name}
          />
          <div className="recipe-info">
            <h3>{recipe.name}</h3>
            <div className="recipe-meta">
              <span className="icon-text">
                <FiBarChart size={14} /> {recipe.level}
              </span>
              <span className="icon-text">
                <IoMdTime size={14} /> {recipe.cookingTime}
              </span>
            </div>
            <div className="recipe-member">{recipe.memberName}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeListGrid;
