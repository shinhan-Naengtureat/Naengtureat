import React from "react";
import { useNavigate } from "react-router-dom";

function RecipeListGrid({ recipes }) {
  const navigate = useNavigate();
  return (
    <div className="recipe-list-grid">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="recipe-card"
          onClick={() => navigate(`/recipe/${recipe.id}`)}
        >
          <img src={recipe.image} alt={recipe.name} />
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
