import React, {useEffect, useState} from "react";
import "swiper/css";
import "swiper/css/pagination";
import {Swiper, SwiperSlide} from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules"; // Autoplay 추가
import "styles/home/HomePage.css";
import axiosInstance from "api/axios";
import {RECIPE_IMAGE_PATH} from "config/pathConfig";

const todaysMeals = [
  { meal: "아침", content: "시저감자 샐러드" },
  { meal: "점심", content: "꽃게 라면, 토마토 샐러드" },
  { meal: "저녁", content: "새우 버섯 리조또, 양배추 피클" },
];

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`/recipe/top/like`)
      .then((response) => {
        if (response.data) {
          // 🔹 isDelete가 false인 데이터만 필터링
          const filteredRecipes = response.data
            .filter(recipe => recipe.isDelete === false)
            .map(recipe => ({
              title: recipe.name,
              img: recipe.image,
              tags: `#${recipe.level} | ${recipe.serving}`,
            }));
          setRecipes(filteredRecipes);
        }
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);



  return (
    <>
      <div className="home-header">
        <h2 className="home-title">오늘, 이 요리 어때요?</h2>
      </div>
      <div className="home-recipe-section">
        <Swiper
          slidesPerView={1.5}
          spaceBetween={15}
          centeredSlides={true}
          loop={true}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000, // 3초마다 자동 전환
            disableOnInteraction: false, // 사용자 조작 후에도 자동 전환 유지
            pauseOnMouseEnter: true, // 마우스를 올리면 멈춤
            pauseOnMouseLeave: true, // 마우스를 떼면 다시 실행
          }}
          modules={[Pagination, Autoplay]}
          className="recipeSwiper"
        >
          {recipes.map((recipe, idx) => (
            <SwiperSlide key={idx} className="home-recipe-slide">
              <div className="home-recipe-card">
                <img
                  src={`${RECIPE_IMAGE_PATH}/${recipe.img}`}
                  alt={recipe.title}
                  className="home-recipe-image"
                />
              </div>
              <div className="home-recipe-info">
                <div className="home-recipe-header">
                  <h5 className="home-recipe-title">{recipe.title}</h5>
                  <span className="home-recipe-like">❤️</span>
                </div>
                <div className="home-recipe-details">
                  <span className="home-recipe-tags">{recipe.tags}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="home-meal-plan-section">
        <h2 className="home-sub-title">오늘의 식단</h2>
        <div className="home-meal-plan">
          {todaysMeals.map((meal, idx) => (
            <div key={idx} className="home-meal-item">
              <div className="home-meal-card">
                <p className="home-meal-time">{meal.meal}</p>
                <p className="home-meal-content">{meal.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
    ;
};

export default HomePage;