import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryFilter from "pages/recipe/RecipeMain/CategoryFilter";
import RecipeListGrid from "pages/recipe/RecipeMain/RecipeListGrid";
import IngredientFilter from "pages/recipe/RecipeMain/IngredientFilter";
import SortFilter from "pages/recipe/RecipeMain/SortFilter";
import "styles/recipe/Recipe.css";
import {ToastContainer } from 'react-toastify';
import axiosInstance from "api/axios";


const sortMapping = {
  추천순: "recommend",
  최신순: "latest",
  난이도순: "difficulty",
  조리시간순: "cookingtime",
};

function RecipeList() {
  // 전체 레시피와 필터링된 결과를 위한 상태
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // 필터 관련 상태
  const [selectedCategories, setSelectedCategories] = useState(["전체"]);
  const [selectedBigCategories, setSelectedBigCategories] = useState([]);
  const [selectedSortFilter, setSelectedSortFilter] = useState("");

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ["전체", "채식", "한식", "양식", "일식", "중식", "퓨전"];

  // 컴포넌트 마운트 시 전체 레시피 로딩
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/recipe`)
      .then((res) => {
        const validRecipes = res.data.filter((recipe) => !recipe.isDelete);
        setAllRecipes(validRecipes);
        setFilteredRecipes(validRecipes);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, []);

  // 필터링: 카테고리, 재료 대분류, 정렬 적용
  useEffect(() => {
    let recipes = [...allRecipes];

    // 카테고리 필터: "전체"가 아니라면
    if (selectedCategories.length > 0 && !selectedCategories.includes("전체")) {
      recipes = recipes.filter((recipe) =>
        selectedCategories.includes(recipe.category)
      );
    }

    // 재료 대분류 필터: aggregatedIngredients 문자열 파싱
    if (selectedBigCategories.length > 0) {
      recipes = recipes.filter((recipe) => {
        if (recipe.aggregatedIngredients) {
          const ingList = recipe.aggregatedIngredients.split(",");
          const bigCategoriesFromRecipe = ingList.map((item) =>
            item.split(":")[0].trim()
          );
          return bigCategoriesFromRecipe.some((big) =>
            selectedBigCategories.includes(big)
          );
        }
        return false;
      });
    }

    // 정렬 필터 적용
    if (selectedSortFilter) {
      const sortType = sortMapping[selectedSortFilter];
      if (sortType === "latest") {
        recipes.sort((a, b) => b.id - a.id);
      } else if (sortType === "recommend") {
        recipes.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      } else if (sortType === "difficulty") {
        const order = { 초급: 1, 중급: 2, 고급: 3 };
        recipes.sort((a, b) => (order[a.level] || 0) - (order[b.level] || 0));
      } else if (sortType === "cookingtime") {
        // 만약 cookingTime이 숫자가 아닌 문자열이라면 추가 변환 로직 필요
        recipes.sort((a, b) => a.cookingTime - b.cookingTime);
      }
    }

    setFilteredRecipes(recipes);
  }, [
    allRecipes,
    selectedCategories,
    selectedBigCategories,
    selectedSortFilter,
  ]);

  // 다중 선택 카테고리 토글
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

      {/* 선택된 재료 대분류를 보여주는 영역 */}
    {selectedBigCategories.length > 0 && (
      <div className="selected-big-categories" style={{ margin: "16px", textAlign: "left", marginLeft:"15px"}}>
        <strong>선택한 식재료: </strong>
        {selectedBigCategories.map((category, index) => (
          <span
            key={index}
            className="selected-category-chip"
            style={{
              color:"#fff",
              marginRight: "8px",
              padding: "8px 12px",
              border: "1px solid #ddd",
              background: "#fe7f2d",
              borderRadius: "50px",
            }}
          >
            {category}
          </span>
        ))}
      </div>
    )}

      {loading ? (
        <div style={{ padding: "16px" }}></div>
      ) : error ? (
        <div style={{ padding: "16px", color: "red" }}>
          오류: {error.message}
        </div>
      ) : (
        <RecipeListGrid recipes={filteredRecipes} />
      )}
      <ToastContainer />

    </div>
  );
}

export default RecipeList;
