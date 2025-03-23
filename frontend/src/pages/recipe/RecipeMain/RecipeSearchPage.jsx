import React, { useState, useEffect } from "react";
import RecipeListGrid from "pages/recipe/RecipeMain/RecipeListGrid";
import SearchBar from "pages/recipe/RecipeMain/SearchBar";
import "styles/recipe/Recipe.css";

function RecipeSearchPage() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 검색어가 변경될 때마다 바로 API 호출
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setRecipes([]);
      return;
    }
    setLoading(true);
    fetch(`/recipe/search/${encodeURIComponent(searchTerm)}`)
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 응답 에러");
        return res.json();
      })
      .then((data) => {
        setRecipes(data);
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
        <div className="loading">로딩중...</div>
      ) : error ? (
        <div className="error">오류: {error.message}</div>
      ) : (
        <RecipeListGrid recipes={recipes} />
      )}
    </div>
  );
}

export default RecipeSearchPage;
