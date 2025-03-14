// RecipeDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RecipeDetail() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/recipe/${recipeId}`)
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 응답 에러");
        return res.json();
      })
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [recipeId]);

  if (loading) return <div style={{ padding: "16px" }}>로딩중...</div>;
  if (error)
    return (
      <div style={{ padding: "16px", color: "red" }}>오류: {error.message}</div>
    );

  return (
    <div style={{ padding: "16px" }}>
      <h1>{recipe.name}</h1>
      <img
        src={recipe.image}
        alt={recipe.name}
        style={{ width: "100%", height: "auto" }}
      />
      <p>난이도: {recipe.level}</p>
      <p>조리 시간: {recipe.cookingTime}</p>
      <p>서빙: {recipe.serving}</p>

      {/* 재료 정보가 RecipeDetailDTO에 포함되어 있다면 */}
      {recipe.ingredients && (
        <div>
          <h2>재료</h2>
          <ul>
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>
                {ing.ingredientSmallCategory} - {ing.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 조리 단계 정보 */}
      {recipe.steps && (
        <div>
          <h2>조리 단계</h2>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={index}>
                {step.image}
                {step.content}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default RecipeDetail;
