// RecipeEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OverviewSection from 'pages/recipe/OverviewSection';
import IngredientsSection from 'pages/recipe/IngredientsSection';
import StepsSection from 'pages/recipe/StepsSection';
import HashtagsSection from 'pages/recipe/HashtagsSection';
import axiosInstance from 'api/axios';
import 'styles/recipe/RecipeRegister.css';

function RecipeEdit() {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  // 폼 초기 구조 (RecipeRegister.jsx와 동일)
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

  // 각 섹션의 펼침 상태 (수정시에는 모두 열어두는 것이 좋습니다)
  const [openSections, setOpenSections] = useState({
    overview: true,
    ingredients: true,
    steps: true,
    hashtags: true,
  });

  // 입력 필드 터치 여부 (RecipeRegister.jsx와 동일)
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

  // 컴포넌트 마운트 시 recipeId를 이용하여 기존 레시피 정보를 불러옴
  useEffect(() => {
    axiosInstance.get(`/recipe/${recipeId}`)
      .then((response) => {
        const data = response.data;
        // 서버에서 받아온 데이터를 RecipeRegister.jsx의 폼 구조에 맞게 매핑
        setForm({
          recipeName: data.name || "",
          categoryBig: data.category || "",
          mealId: data.meal ? data.meal.id : "",
          cookingInfo: { 
            servings: data.serving ? data.serving.replace("인분", "") : "", 
            cookingTime: data.cookingTime || "", 
            difficulty: data.level || ""
          },
          ingredients: data.ingredients ? data.ingredients.map(ing => ({
            name: ing.ingredientSmallCategory || "",
            quantity: ing.quantity || "",
            unit: ing.unit || "", // 만약 단위 정보가 있다면 사용
            ingredientId: ing.ingredientId || null,
          })) : [{ name: "", quantity: "", unit: "", ingredientId: null }],
          steps: data.steps ? data.steps.map(step => ({
            content: step.content || "",
            image: null, // 파일 객체는 없으므로 null 처리
            imagePreview: step.image || "", // 기존 이미지 URL 사용
          })) : [{ content: "", image: null, imagePreview: null }],
          hashtags: data.hashtags ? data.hashtags.map(ht => ({
            value: ht.id,
            label: ht.keyword,
          })) : [],
          // 기존에 저장된 이미지 파일명 또는 URL
          recipeImage: data.image || null,
        });
        // 기존 이미지 미리보기 (이미지 경로는 프로젝트 환경에 맞게 수정)
        if(data.image) {
          setImagePreview(`${process.env.PUBLIC_URL}/assets/images/recipes/${data.image}`);
        }
      })
      .catch((error) => {
        console.error("레시피 상세정보 불러오기 오류:", error);
      });
  }, [recipeId]);

  // 수정 제출 핸들러: PUT 요청으로 업데이트
  const handleSubmit = async (e) => {
    e.preventDefault();

    // RecipeRegister.jsx와 유사하게 DTO 형태로 변환
    const recipeDto = {
      id: recipeId,
      name: form.recipeName,
      category: form.categoryBig,
      mealId: form.mealId,
      cookingTime: form.cookingInfo.cookingTime,
      serving: form.cookingInfo.servings ? `${form.cookingInfo.servings}인분` : "",
      level: form.cookingInfo.difficulty,
      // 만약 새 이미지가 선택되었다면 파일명을, 아니면 기존 이미지 값을 사용
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
      hashtags: form.hashtags, // react-select의 값 그대로 전송 (백엔드에서 처리 방식에 맞게 조정)
    };
    console.log(recipeDto);
    try {
      const response = await axiosInstance.put(`/recipe/${recipeId}`, recipeDto);
      console.log("수정 결과:", response.data);
      alert("레시피 수정 성공");
      // 수정 후 리스트 페이지 또는 상세 페이지로 이동
      navigate("/recipe");
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
