// RecipeEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OverviewSection from 'pages/recipe/RecipeRegister/OverviewSection';
import IngredientsSection from 'pages/recipe/RecipeRegister/IngredientsSection';
import StepsSection from 'pages/recipe/RecipeRegister/StepsSection';
import HashtagsSection from 'pages/recipe/RecipeRegister/HashtagsSection';
import axiosInstance from 'api/axios';
import 'styles/recipe/RecipeRegister.css';

function RecipeEdit() {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  // 폼 초기 구조
  const [form, setForm] = useState({
    recipeName: "",
    categoryBig: "",
    mealId: "",
    cookingInfo: { servings: "", cookingTime: "", difficulty: "" },
    ingredients: [{ name: "", quantity: "", unit: "", ingredientId: null }],
    steps: [{ content: "", image: null, imagePreview: null }],
    hashtags: [],
    recipeImage: null,
  });

  // 이미지 미리보기 (초기에는 서버에서 받은 이미지 URL 사용)
  const [imagePreview, setImagePreview] = useState(null);

  // 각 섹션의 펼침 상태 (수정시 모두 열어두기)
  const [openSections, setOpenSections] = useState({
    overview: true,
    ingredients: true,
    steps: true,
    hashtags: true,
  });

  // 입력 필드 터치 여부
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

  // 컴포넌트 마운트 시 recipeId로 기존 레시피 정보를 불러와 form에 매핑
  useEffect(() => {
    axiosInstance.get(`/recipe/${recipeId}`)
      .then((response) => {
        const data = response.data;
        // DTO 구조에 맞게 매핑 (mealId는 data.mealId, 재료의 단위는 ingredientRecipeUnit 사용)
        setForm({
          recipeName: data.name || "",
          categoryBig: data.category || "",
          mealId: data.mealId || "", // data.mealId 사용
          cookingInfo: { 
            servings: data.serving ? data.serving.replace("인분", "").trim() : "", 
            cookingTime: data.cookingTime || "", 
            difficulty: data.level || ""
          },
          ingredients: data.ingredients ? data.ingredients.map(ing => ({
            name: ing.ingredientSmallCategory || "",
            quantity: ing.quantity, // quantity는 숫자형 그대로 사용
            unit: ing.ingredientRecipeUnit || "", // 재료 단위: ingredientRecipeUnit 사용 (원하는 값 선택)
            ingredientId: ing.ingredientId || null,
          })) : [{ name: "", quantity: "", unit: "", ingredientId: null }],
          steps: data.steps ? data.steps.map(step => ({
            content: step.content || "",
            image: step.image || "", // 원래 이미지 파일 이름을 저장
            imagePreview: step.image 
                ? `/assets/images/recipes/${step.image}` 
                : "",
            })) : [{ content: "", image: "", imagePreview: "" }],
          hashtags: data.hashtags ? data.hashtags.map(ht => ({
            value: ht.hashtagId,
            label: ht.hashtagKeyword,
          })) : [],
          recipeImage: data.image || null,
        });
        // 기존 이미지 미리보기 설정 (환경에 맞게 경로 조정)
        if (data.image) {
          setImagePreview(`${process.env.PUBLIC_URL}/assets/images/recipes/${data.image}`);
        }
      })
      .catch((error) => {
        console.error("레시피 상세정보 불러오기 오류:", error);
      });
  }, [recipeId]);

  // 수정 제출 핸들러 (PUT 요청으로 업데이트)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeDto = {
      id: recipeId,
      name: form.recipeName,
      category: form.categoryBig,
      mealId: form.mealId,
      cookingTime: form.cookingInfo.cookingTime,
      serving: form.cookingInfo.servings ? `${form.cookingInfo.servings}인분` : "",
      level: form.cookingInfo.difficulty,
      image: form.recipeImage 
             ? (form.recipeImage.name ? form.recipeImage.name : form.recipeImage)
             : "",
      ingredients: form.ingredients.filter(
        ing => ing.name.trim() && ing.quantity > 0 && ing.unit.trim()
      ),
      steps: form.steps.filter(step => step.content.trim()).map(step => ({
        content: step.content,
        image: step.image ? (step.image.name ? step.image.name : step.image) : ""
      })),
      hashtagIds: form.hashtags.map(ht => ({ id: ht.value })),
    };

    console.log(recipeDto);

    try {
      const response = await axiosInstance.put(`/recipe/${recipeId}`, recipeDto);
      console.log("수정 결과:", response.data);
      alert("레시피 수정 성공");
      navigate("/my-recipe-list");
    } catch (error) {
      console.error("레시피 수정 오류:", error);
      alert("레시피 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="recipe-form-container">
      <h1>레시피 수정</h1>
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
        <button type="submit" className="submit-btn">수정하기</button>
      </form>
    </div>
  );
}

export default RecipeEdit;
