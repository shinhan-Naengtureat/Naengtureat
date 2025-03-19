import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "styles/home/HomePage.css";
import axiosInstance from "api/axios";
import { RECIPE_IMAGE_PATH } from "config/pathConfig";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import routeConfig from "routes/routeConfig";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [isSwiperMounted, setIsSwiperMounted] = useState(false);
  const [dailyMealPlan, setDailyMealPlan] = useState([]);
  const navigate = useNavigate();
  const mealTypeOrder = {
    "아침": 1,
    "점심": 2,
    "저녁": 3,
  };

  // Top Recipe 데이터 가져오기
  useEffect(() => {
    axiosInstance
      .get(`/recipe/top/like`)
      .then((response) => {
        if (response.data) {
          // isDelete가 false인 데이터만 필터링
          const filtered = response.data.filter((r) => r.isDelete === false);
          setRecipes(filtered);
        }
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  useEffect(() => {
    // 300ms 후에 Swiper를 렌더링하도록 설정 (필요에 따라 지연시간 조정)
    const timer = setTimeout(() => {
      setIsSwiperMounted(true);
    }, 300);
    return () => clearTimeout(timer);
  });

  // 좋아요 토글 함수
  const handleToggleLike = (recipeId) => {
    axiosInstance
      .post(`/recipe/like/${recipeId}`)
      .then((res) => {
        console.log("좋아요 상태 변경 성공:", res.data.message);
        setRecipes((prevRecipes) =>
          prevRecipes.map((r) =>
            r.id === recipeId ? { ...r, liked: !r.liked } : r
          )
        );
      })
      .catch((err) => console.error("좋아요 토글 에러:", err));
  };

  // 오늘 날짜를 YYYYMMDD 형식으로 포맷팅
  const getFormattedToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);
    return `${year}${month}${day}`;
  };

  // 오늘의 식단 데이터 가져오기
  useEffect(() => {
    const formattedDate = getFormattedToday();
    axiosInstance
      .get(`/mealplan/daily/${formattedDate}`)
      .then((response) => {
        const data = response.data || [];
        // type 기준으로 정렬 ("아침" -> "점심" -> "저녁")
        data.sort((a, b) => {
          const orderA = mealTypeOrder[a.type] || 999;
          const orderB = mealTypeOrder[b.type] || 999;
          return orderA - orderB;
        });
        setDailyMealPlan(data);
      })
      .catch((error) =>
        console.error("식단 데이터 에러:", error)
      );
  }, []);

  return (
    <>
      <div className="home-header">
        <h2 className="home-title">오늘, 이 요리 어때요?</h2>
      </div>
      <div className="home-recipe-section">
        {isSwiperMounted && (
        <Swiper
          slidesPerView={1.5}
          spaceBetween={15}
          centeredSlides={true}
          loop={true}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000, // 3초마다 자동 전환
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            pauseOnMouseLeave: true,
          }}
          modules={[Pagination, Autoplay]}
          className="recipeSwiper"
        >
          {recipes.map((recipe) => (
            <SwiperSlide key={recipe.id} className="home-recipe-slide">
              <div className="home-recipe-card" onClick={() => navigate(routeConfig.paths.recipeDetail.replace(":recipeId", recipe.id))}>
                <img
                  src={`${RECIPE_IMAGE_PATH}/${recipe.image}`}
                  alt={recipe.name}
                  className="home-recipe-image"
                />
              </div>
              <div className="home-recipe-info" onClick={() => navigate(routeConfig.paths.recipeDetail.replace(":recipeId", recipe.id))}>
                <div className="home-recipe-header">
                  <h5 className="home-recipe-title">{recipe.name}</h5>
                  {recipe.liked ? (
                    <FaHeart
                      className="home-recipe-like icon liked"
                      onClick={() => handleToggleLike(recipe.id)}
                      title="좋아요 토글"
                    />
                  ) : (
                    <FaRegHeart
                      className="home-recipe-like icon"
                      onClick={() => handleToggleLike(recipe.id)}
                      title="좋아요 토글"
                    />
                  )}
                </div>
                <div className="home-recipe-details">
                  <span className="home-recipe-tags">
                    #{recipe.level} | {recipe.serving}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>)}
      </div>
      <div className="home-meal-plan-section">
        <h2 className="home-sub-title">오늘의 식단</h2>
        <div className="home-meal-plan">
          {dailyMealPlan.length > 0 ? (
            dailyMealPlan.map((meal, idx) => (
              <div key={idx} className="home-meal-item">
                <div className="home-meal-card" onClick={() => navigate(routeConfig.paths.recipeDetail.replace(":recipeId", meal.recipeId))}>
                  <p className="home-meal-time">{meal.type}</p>
                  <p className="home-meal-content">{meal.recipeName}</p>
                </div>
              </div>
            ))
          ) : (
            <p>오늘의 식단 데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
