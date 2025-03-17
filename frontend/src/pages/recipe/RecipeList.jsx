import React, { useState, useEffect } from "react";
import CategoryFilter from "./CategoryFilter";
import RecipeListGrid from "./RecipeListGrid";
import IngredientFilter from "./IngredientFilter";
import SortFilter from "./SortFilter";

import "styles/recipe/Recipe.css";

const sortMapping = {
    추천순: "recommend",
    최신순: "latest",
    난이도순: "difficulty",
    조리시간순: "cookingtime",
  };

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["전체"]);
  const [selectedBigCategories, setSelectedBigCategories] = useState([]);
  const [selectedSortFilter, setSelectedSortFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ["전체", "채식", "한식", "양식", "일식", "중식", "퓨전"];

  // 선택된 필터(정렬, 식재료, 카테고리)에 따라 API 호출
  useEffect(() => {
    setLoading(true);
    let url = "";

    if (selectedSortFilter) {
      const sortParam = sortMapping[selectedSortFilter] || "";
      url = `/recipe/sort?sortType=${encodeURIComponent(sortParam)}`;
    } else if (selectedBigCategories.length > 0) {
      const queryString = selectedBigCategories
        .map((cat) => `bigCategory=${encodeURIComponent(cat)}`)
        .join("&");
      url = `/recipe/bigcategory?${queryString}`;
    } else if (selectedCategories.length > 0 && !selectedCategories.includes("전체")) {
      const queryString = selectedCategories
        .map((cat) => `category=${encodeURIComponent(cat)}`)
        .join("&");
      url = `/recipe/category?${queryString}`;
    } else {
      url = "/recipe";
    }

    fetch(url)
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
  }, [selectedCategories, selectedBigCategories, selectedSortFilter]);

  // 다중 선택을 위한 카테고리 토글 로직
  const handleSelectCategory = (category) => {
    if (category === "전체") {
      setSelectedCategories(["전체"]);
    } else {
      setSelectedCategories((prev) => {
        const withoutAll = prev.filter((c) => c !== "전체");
        if (withoutAll.includes(category)) {
          return withoutAll.filter((c) => c !== category);
        } else {
          return [...withoutAll, category];
        }
      });
    }
  };

  return (
    <div>
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onSelectCategory={handleSelectCategory}
      />

      <div className="filter-bar">
        <IngredientFilter onApplyCategories={setSelectedBigCategories} />
        <SortFilter
          selectedSortFilter={selectedSortFilter}
          onSelectSortFilter={setSelectedSortFilter}
        />
      </div>

      {loading ? (
        <div style={{ padding: "16px" }}>로딩중...</div>
      ) : error ? (
        <div style={{ padding: "16px", color: "red" }}>
          오류: {error.message}
        </div>
      ) : (
        <RecipeListGrid recipes={recipes} />
      )}
    </div>
  );
}

export default RecipeList;
