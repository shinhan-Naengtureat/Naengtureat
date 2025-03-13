import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RouteConfig from "routes/RouteConfig";
import axios from "axios";
import FloatingNextButton from "components/FloatingNextButton";
import "styles/mealPlan/BoxChoice.css";
import BackButton from "components/BackButton";

const ThemeSelectionPage = ({ setUserSelections }) => {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/mealplan/theme"
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
    setUserSelections((prev) => ({ ...prev, themes: selectedTheme }));

    navigate(RouteConfig.preferredIngredients);
  };

  return (
    <div className="container">
      {/* 뒤로가기 & 타이틀 */}
      <div className="header">
        <BackButton onClick={handleBefore} />
      </div>

      <h2 className="title">
        원하는 <span className="highlight">테마</span>를 선택하세요
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
