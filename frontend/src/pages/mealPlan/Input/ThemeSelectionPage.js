import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/routeConfig";
import FloatingNextButton from "components/FloatingNextButton";
import "styles/mealPlan/BoxChoice.css";
import BackButton from "components/BackButton";
import axiosInstance from "api/axios";
import useMealPlanContext from "hooks/useMealPlanContext";

const ThemeSelectionPage = () => {
   const { userSelections, setUserSelections } = useMealPlanContext();
  const [themes, setThemes] = useState([]); //서버 테마목록
  const [selectedTheme, setSelectedTheme] = useState(userSelections?.theme || []);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await axiosInstance.get(
          "/mealplan/theme"
        );
        if (response.status === 200) {
          setThemes(response.data);
        }
      } catch (error) {
        console.error("테마 API 호출 오류:", error);
      }
    };

    fetchThemes();
  }, []);

  // 카테고리 선택 토글 함수
  const toggleTheme = (theme) => {
    setSelectedTheme((prev) => {
      if (prev.includes(theme)) {
        //이미 선택된 경우 제거
        return prev.filter((c) => c !== theme);
      } else if (prev.length < 2) {
        // 선택된 항목이 2개 미만일 때만 추가
        return [...prev, theme];
      } else {
        alert("테마는 최대 2개까지 선택 가능합니다.");
        return prev;
      }
    });
  };

  const handleBefore = () => {
    navigate(RouteConfig.categorySelection);
  };
  const handleNext = () => {
    if (selectedTheme.length === 0) {
      alert("테마를 선택해주세요!");
      return;
    }
    setUserSelections((prev) => ({ ...prev, theme: selectedTheme }));

    navigate(RouteConfig.paths.preferredIngredients);
  };

  return (
    <div className="box-title" style={{ textAlign: "center" }}>
      {/* 뒤로가기 & 타이틀 */}
      <div className="category-header">
        <BackButton onClick={handleBefore} />
      </div>

      <h2 className="box-title">
        원하는 <span className="box-highlight">테마</span>를 선택하세요
      </h2>

      <div className="theme-container">
        {themes.length > 0 ? (
          themes.map((theme) => (
            <button
              key={theme}
              onClick={() => toggleTheme(theme)}
              className={`theme-button ${
                selectedTheme.includes(theme) ? "selected" : ""
              } transition-all`}
            >
              {theme}
            </button>
          ))
        ) : (
          <p className="loading-text">테마를 불러오는 중...</p>
        )}
      </div>

      <FloatingNextButton
        onClick={handleNext}
        disabled={selectedTheme.length === 0}
      />
    </div>
  );
};

export default ThemeSelectionPage;
