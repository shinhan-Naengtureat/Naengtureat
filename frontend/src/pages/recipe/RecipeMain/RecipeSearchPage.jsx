import React, { useState, useEffect } from "react";
import RecipeListGrid from "pages/recipe/RecipeMain/RecipeListGrid";
import SearchBar from "pages/recipe/RecipeMain/SearchBar";
import "styles/recipe/Recipe.css";
import axiosInstance from "api/axios"; // ✅ axios 인스턴스 import

function RecipeSearchPage() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 검색어 변경 시 API 호출
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setRecipes([]);
      return;
    }

    setLoading(true);
    axiosInstance
      .get(`/recipe/search/${encodeURIComponent(searchTerm)}`)
      .then((res) => {
        setRecipes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, [searchTerm]);

  return (
    <div>
      <SearchBar value={searchTerm} onSearch={setSearchTerm} />
      {loading ? (
        <div className="loading"></div>
      ) : error ? (
        <div className="error">오류: {error.message}</div>
      ) : (
        <RecipeListGrid recipes={recipes} />
      )}
    </div>
  );
}

export default RecipeSearchPage;
