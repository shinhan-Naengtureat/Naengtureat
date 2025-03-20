// RecipeRegister.jsx
import React, { useState } from 'react';
import OverviewSection from 'pages/recipe/RecipeRegister/OverviewSection';
import IngredientsSection from 'pages/recipe/RecipeRegister/IngredientsSection';
import StepsSection from 'pages/recipe/RecipeRegister/StepsSection';
import HashtagsSection from 'pages/recipe/RecipeRegister/HashtagsSection';
import axiosInstance from 'api/axios';
import 'styles/recipe/RecipeRegister.css';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import routeConfig from "routes/routeConfig";

function RecipeRegister() {
  const [form, setForm] = useState({
  recipeName: "",
  categoryBig: "",
  mealId: "", // 추가: 소분류(메뉴) 선택 시 저장되는 Meal ID
  cookingInfo: { servings: "", cookingTime: "", difficulty: "" },
  ingredients: [{ name: "", quantity: "", unit: "" }],
  steps: [{ content: "", image: null, imagePreview: null }],
  hashtags: "",
  recipeImage: null,
});
    const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  // 섹션 열림 상태
  const [openSections, setOpenSections] = useState({
    overview: false,
    ingredients: false,
    steps: false,
    hashtags: false,
  });

  // 각 입력 필드의 터치 여부 (동적 항목은 배열로 관리)
  const [touched, setTouched] = useState({
    recipeName: false,
    categoryBig: false,
    mealId: false,
    cookingInfo: { servings: false, cookingTime: false, difficulty: false },
    recipeImage: false,
    ingredients: [{ name: false, quantity: false, unit: false }],
    steps: [{ content: false, image: false }],
    hashtags: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 서버에 전송할 DTO 형태로 변환합니다.
    const recipeDto = {
      name: form.recipeName,
      category: form.categoryBig, 
      mealId: form.mealId,
      cookingTime: form.cookingInfo.cookingTime,
      serving: form.cookingInfo.servings ? `${form.cookingInfo.servings}인분` : "",
      level: form.cookingInfo.difficulty,
      // 이미지 파일명을 저장 (이미지 프리뷰 URL이 아닌 파일의 이름)
      image: form.recipeImage ? form.recipeImage.name : "",
      // 유효한 재료와 단계만 필터링하여 전송
      ingredients: form.ingredients.filter(
        ing => ing.name.trim() && ing.quantity.trim() && ing.unit.trim()
      ),
      steps: form.steps
        .filter(step => step.content.trim())
        .map(step => ({
          content: step.content,
          image: step.image ? step.image.name : ""
        })),
      hashtags: form.hashtags,
    };
    console.log(recipeDto);

    try {
      const response = await axiosInstance.post(`/recipe/new`, recipeDto);
      console.log("등록결과:",response.data);
      toast.success('레시피가 등록되었습니다', {
                position: "top-center",
                autoClose: 3000,
            });
      navigate(routeConfig.paths.recipeList)
      // 등록 후 폼 초기화 또는 다른 페이지 이동 로직 추가 가능
    } catch (error) {
      toast.error('레시피 등록에 실패했습니다.', {
                position: "top-center",
                autoClose: 3000,
            });
    }
  };

  return (
    <div className="recipe-form-container">
      
      <form className="recipe-form" onSubmit={handleSubmit}>
        <OverviewSection
          form={form}
          setForm={setForm}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          open={openSections.overview}
          toggleSection={() =>
            setOpenSections(prev => ({ ...prev, overview: !prev.overview }))
          }
          touched={touched}
          setTouched={setTouched}
        />
        <IngredientsSection
          form={form}
          setForm={setForm}
          open={openSections.ingredients}
          toggleSection={() =>
            setOpenSections(prev => ({ ...prev, ingredients: !prev.ingredients }))
          }
          touched={touched}
          setTouched={setTouched}
        />
        <StepsSection
          form={form}
          setForm={setForm}
          open={openSections.steps}
          toggleSection={() =>
            setOpenSections(prev => ({ ...prev, steps: !prev.steps }))
          }
          touched={touched}
          setTouched={setTouched}
        />
        <HashtagsSection
          form={form}
          setForm={setForm}
          open={openSections.hashtags}
          toggleSection={() =>
            setOpenSections(prev => ({ ...prev, hashtags: !prev.hashtags }))
          }
          touched={touched}
          setTouched={setTouched}
        />
        <button type="submit" className="submit-btn">등록하기</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default RecipeRegister;
