import React, { useState, useEffect } from "react";
import TopNavBar from "./TopNavBar";
import CategoryFilter from "./CategoryFilter";
import IngredientSortFilter from "./IngredientSortFilter";
import SearchBar from "./SearchBar";
import RecipeListGrid from "./RecipeListGrid";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체보기");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBigCategory, setSelectedBigCategory] = useState("");
  const [selectedSortFilter, setSelectedSortFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false); // 검색바 노출 여부

  const categories = ["전체", "채식", "한식", "양식", "일식", "중식", "퓨전"];

  // 정렬 필터의 옵션에 대한 매핑 (API에서 기대하는 파라미터 값)
  const sortMapping = {
    추천순: "recommend",
    최신순: "latest",
    난이도순: "difficulty",
    조리시간순: "cookingtime",
  };

  const handleSearchButtonClick = () => {
    setShowSearchBar((prev) => !prev);
  };

  // 상태(검색어, 정렬, 식재료, 카테고리)가 바뀔 때마다 API 호출
  useEffect(() => {
    setLoading(true);
    let url = "";

    if (searchTerm.trim() !== "") {
      // 검색어가 입력된 경우
      url = `/recipe/search/${encodeURIComponent(searchTerm)}`;
    } else if (selectedSortFilter) {
      // 정렬필터 선택 시
      const sortParam = sortMapping[selectedSortFilter] || "";
      url = `/recipe/sort?sortType=${encodeURIComponent(sortParam)}`;
    } else if (selectedBigCategory) {
      // 식재료 대분류 선택 시
      url = `/recipe/bigcategory?bigCategory=${encodeURIComponent(
        selectedBigCategory
      )}`;
    } else if (selectedCategory !== "전체보기") {
      // 카테고리 필터 (대분류가 아닌 경우)
      url = `/recipe/category/${encodeURIComponent(selectedCategory)}`;
    } else {
      // 기본 전체 레시피 조회
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
  }, [selectedCategory, searchTerm, selectedBigCategory, selectedSortFilter]);

  return (
    <div>
      <TopNavBar onSearchButtonClick={handleSearchButtonClick} />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
          // 다른 필터 초기화
          setSelectedBigCategory("");
          setSelectedSortFilter("");
          setSearchTerm("");
        }}
      />
      <IngredientSortFilter
        selectedBigCategory={selectedBigCategory}
        onSelectBigCategory={(bigCategory) => {
          setSelectedBigCategory(bigCategory);
          // 정렬필터 초기화 시 식재료 선택 우선
          setSelectedSortFilter("");
        }}
        selectedSortFilter={selectedSortFilter}
        onSelectSortFilter={(sortOption) => {
          setSelectedSortFilter(sortOption);
          // 정렬 선택 시 식재료 선택 초기화
          setSelectedBigCategory("");
        }}
      />
      {showSearchBar && <SearchBar onSearch={setSearchTerm} />}
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
