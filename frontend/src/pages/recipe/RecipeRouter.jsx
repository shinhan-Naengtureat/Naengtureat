// RecipeRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import RecipeList from "pages/recipe/RecipeList";
import RecipeDetail from "pages/recipe/RecipeDetail";

const RecipeRoutes = () => {
  return (
    <Routes>
      {/* 기본 레시피 리스트 */}
      <Route path="/" element={<RecipeList />} />
      {/* 레시피 상세 페이지, URL 예: /recipe/123 */}
      <Route path=":recipeId" element={<RecipeDetail />} />
    </Routes>
  );
};

export default RecipeRoutes;
