import React from "react";
import { Link } from "react-router-dom";
import "styles/home/HomePage.css"; // 스타일 적용

const HomePage = () => {
  return (
    <div className="home-container">
      {/* 상단 유저 아이콘 */}
      <div className="header">
        <h2>오늘, 이 요리 어때요?</h2>
        <Link to="/mypage">
          <img src={`${process.env.PUBLIC_URL}/assets/images/user-icon.png`} alt="유저 아이콘" className="user-icon" />
        </Link>
      </div>

      {/* 추천 요리 섹션 */}
      <div className="recipe-section">
        <p>양배추 듬뿍 건강하고 맛있는 밀프랩 레시피</p>
        <div className="recipe-card">
          <img src={`${process.env.PUBLIC_URL}/assets/images/recipe-salad.jpg`} alt="샐러드" className="recipe-image" />          <div className="recipe-info">
            <h3>오리엔탈 양배추 샐러드</h3>
            <p>#메인요리  |  초급  |  30분</p>
            <span>❤️</span>
          </div>
        </div>
      </div>

      {/* 오늘의 식단 */}
      <div className="meal-plan-section">
        <h2>오늘의 식단</h2>
        <div className="meal-plan">
          <div className="meal-item">🥗 시저감자 샐러드</div>
          <div className="meal-item">🍜 꽃게 라면, 토마토 샐러드</div>
          <div className="meal-item">🍲 새우 버섯 리조또, 양배추 피클</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;