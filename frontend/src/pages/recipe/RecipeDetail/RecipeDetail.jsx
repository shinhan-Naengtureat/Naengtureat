import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart, FaPlus, FaRegComment, FaRegHeart } from "react-icons/fa";
import axiosInstance from "api/axios";
import "styles/recipe/RecipeDetail.css";
import CommentsSection from "pages/recipe/RecipeDetail/CommentsSection";
import MealPlanModal from "pages/recipe/RecipeDetail/MealPlanModal";
import { RECIPE_IMAGE_PATH } from "config/pathConfig";

function RecipeDetail() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [liked, setLiked] = useState(false);

  // 식단 모달 관련 상태
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("아침");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 레시피 상세 조회
  useEffect(() => {
    axiosInstance.get(`/recipe/${recipeId}`)
      .then((response) => {
        setRecipe(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [recipeId]);

  // 댓글 조회
  useEffect(() => {
    axiosInstance.get(`/recipe/${recipeId}/comment`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((err) => console.error("댓글 조회 에러:", err));
  }, [recipeId]);

  // 댓글 등록 처리
  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    axiosInstance.post(`/recipe/${recipeId}/comment`, { content: commentInput })
      .then((response) => {
        setComments(prev => [...prev, response.data]);
        setCommentInput("");
        setShowSubmitButton(false);
      })
      .catch((err) => console.error("댓글 등록 에러:", err));
  };

  // 좋아요 토글
  const handleToggleLike = () => {
    axiosInstance.post(`/recipe/like/${recipeId}`)
      .then((response) => {
        console.log(response.data.message);
        setLiked(prev => !prev);
      })
      .catch((err) => console.error("좋아요 토글 에러:", err));
  };

  // 식단 모달 열기/식단 등록 처리
  const handleAddToMealPlan = () => {
    setShowMealPlanModal(true);
  };

  const handleSaveMealPlan = () => {
    axiosInstance.post(`/recipe/${recipeId}/mealplan`, {
      memberId: 3, // 하드코딩된 예시
      date: selectedDate,
      type: selectedMealType,
    })
      .then((response) => {
        console.log("식단 추가 성공:", response.data);
        setShowMealPlanModal(false);
      })
      .catch((err) => console.error("식단 추가 에러:", err));
  };

  // 댓글 섹션으로 스크롤
  const handleScrollToComment = () => {
    const commentSection = document.querySelector(".comment-section");
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) return <div className="recipe-detail">로딩중...</div>;
  if (error) return <div className="recipe-detail" style={{ color: "red" }}>오류: {error.message}</div>;

  return (
    <div className="recipe-detail">
      {/* Recipe Header (인라인) */}
      <div className="recipe-header">
        <img src={`${RECIPE_IMAGE_PATH}/${recipe.image}`} alt={recipe.name} />
        <h1>{recipe.name}</h1>
        <p>난이도: {recipe.level}</p>
        <p>조리 시간: {recipe.cookingTime}</p>
        {recipe.hashtags && recipe.hashtags.length > 0 && (
          <p className="recipe-hashtags">
            {" "}
            {recipe.hashtags.map((hash, index) => (
              <span key={index}>{hash.hashtagKeyword} </span>
            ))}
          </p>
        )}
      </div>
      
      {/* 액션 아이콘 */}
      <div className="action-icons">
        <FaPlus onClick={handleAddToMealPlan} className="icon" title="레시피 내 식단에 추가" />
        {liked ? (
          <FaHeart onClick={handleToggleLike} className="icon liked" title="좋아요 토글" />
        ) : (
          <FaRegHeart onClick={handleToggleLike} className="icon" title="좋아요 토글" />
        )}
        <FaRegComment onClick={handleScrollToComment} className="icon" title="댓글 보기" />
      </div>

      {/* Ingredients Table (인라인) */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="ingredient-table">
          <h2>기본 재료 {recipe.serving}</h2>
          <table>
            <tbody>
              {recipe.ingredients.map((ing, index) => (
                <tr key={index}>
                  <td className="ingredient-names">{ing.ingredientSmallCategory}</td>
                  <td className="ingredient-quantity">
                    {ing.quantity}{ing.ingredientRecipeUnit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Steps List (인라인) */}
      {recipe.steps && recipe.steps.length > 0 && (
        <div className="recipe-section recipe-steps">
          <h2>조리 단계</h2>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={index}>
                {step.image && (
                  <img src={`${RECIPE_IMAGE_PATH}/${step.image}`} alt={`step-${index}`} />
                )}
                {step.content}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Comments Section */}
      <CommentsSection
        comments={comments}
        commentInput={commentInput}
        setCommentInput={setCommentInput}
        showSubmitButton={showSubmitButton}
        setShowSubmitButton={setShowSubmitButton}
        handleCommentSubmit={handleCommentSubmit}
      />

      {/* Meal Plan Modal */}
      <MealPlanModal
        show={showMealPlanModal}
        onHide={() => setShowMealPlanModal(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedMealType={selectedMealType}
        setSelectedMealType={setSelectedMealType}
        handleSaveMealPlan={handleSaveMealPlan}
      />
    </div>
  );
}

export default RecipeDetail;
