import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaHeart,
  FaPlus,
  FaRegComment,
  FaRegHeart
} from "react-icons/fa";
import "styles/recipe/RecipeDetail.css";
import { RECIPE_IMAGE_PATH } from "config/pathConfig";

function RecipeDetail() {
  const { recipeId } = useParams();

  // 레시피 상세 정보
  const [recipe, setRecipe] = useState(null);
  // 댓글 목록
  const [comments, setComments] = useState([]);
  // 댓글 입력값
  const [commentInput, setCommentInput] = useState("");
  // 댓글 버튼 표시 여부
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  // 좋아요 상태 관리
  const [liked, setLiked] = useState(false);

  // 모달 열림/닫힘
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  // 모달 내부 입력값(날짜, 식단유형)
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("아침");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 레시피 상세 조회
  useEffect(() => {
    fetch(`/recipe/${recipeId}`)
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 응답 에러");
        return res.json();
      })
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [recipeId]);

  // 댓글 목록 조회
  useEffect(() => {
    fetch(`/recipe/${recipeId}/comment`)
      .then((res) => {
        if (!res.ok) throw new Error("댓글 조회 중 오류");
        return res.json();
      })
      .then((data) => {
        setComments(data);
      })
      .catch((err) => console.error(err));
  }, [recipeId]);

  // 댓글 등록 처리
  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;

    fetch(`/recipe/${recipeId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentInput }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("댓글 등록 실패");
        return res.json();
      })
      .then((newComment) => {
        setComments((prev) => [...prev, newComment]);
        setCommentInput("");
        setShowSubmitButton(false);
      })
      .catch((err) => console.error(err));
  };

  // 좋아요 토글
  const handleToggleLike = () => {
    fetch(`/recipe/like/${recipeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("좋아요 토글 실패");
        return res.json();
      })
      .then((data) => {
        console.log(data.message); // "좋아요 상태 변경 성공"
        setLiked((prev) => !prev);
      })
      .catch((err) => {
        console.error("좋아요 토글 에러:", err);
      });
  };

  // 모달 열기
  const handleAddToMealPlan = () => {
    setShowMealPlanModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowMealPlanModal(false);
  };

  // "저장" 버튼으로 식단 등록
  const handleSaveMealPlan = () => {
    // 예시: /recipe/{recipeId}/mealplan으로 POST
    fetch(`/recipe/${recipeId}/mealplan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberId: 2, // 실제 로그인 유저 ID
        date: selectedDate,
        type: selectedMealType,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("식단 추가 실패");
        return res.json();
      })
      .then((data) => {
        console.log("식단 추가 성공:", data);
        setShowMealPlanModal(false);
      })
      .catch((err) => {
        console.error("식단 추가 에러:", err);
      });
  };

  // 댓글 섹션으로 스크롤
  const handleScrollToComment = () => {
    const commentSection = document.querySelector(".comment-section");
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) return <div className="recipe-detail">로딩중...</div>;
  if (error)
    return (
      <div className="recipe-detail" style={{ color: "red" }}>
        오류: {error.message}
      </div>
    );

  return (
    <div className="recipe-detail">
      {/* 레시피 대표 이미지 */}
      <img src={`${RECIPE_IMAGE_PATH}/${recipe.image}`} alt={recipe.name} />

      {/* 레시피 기본 정보 */}
      <h1>{recipe.name}</h1>
      <p>난이도: {recipe.level}</p>
      <p>조리 시간: {recipe.cookingTime}</p>

      {/* 해쉬태그 */}
      {recipe.hashtags && recipe.hashtags.length > 0 && (
        <p className="recipe-hashtags">
          해쉬태그:{" "}
          {recipe.hashtags.map((hash, index) => (
            <span key={index}>{hash.hashtagKeyword}</span>
          ))}
        </p>
      )}

      {/* 아이콘 액션 */}
      <div className="action-icons">
        <FaPlus
          onClick={handleAddToMealPlan}
          className="icon"
          title="레시피 내 식단에 추가"
        />
        {liked ? (
          <FaHeart
            onClick={handleToggleLike}
            className="icon liked"
            title="좋아요 토글"
          />
        ) : (
          <FaRegHeart
            onClick={handleToggleLike}
            className="icon"
            title="좋아요 토글"
          />
        )}
        <FaRegComment
          onClick={handleScrollToComment}
          className="icon"
          title="댓글 보기"
        />
      </div>

      {/* 재료 표시 (테이블 형태) */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="ingredient-table">
          <h2>기본 재료 {recipe.serving}</h2>
          <table>
            <tbody>
              {recipe.ingredients.map((ing, index) => (
                <tr key={index}>
                  <td className="ingredient-names">{ing.ingredientSmallCategory}</td>
                  <td className="ingredient-quantity">
                    {ing.quantity}
                    {ing.ingredientRecipeUnit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 조리 단계 정보 */}
      {recipe.steps && recipe.steps.length > 0 && (
        <div className="recipe-section recipe-steps">
          <h2>조리 단계</h2>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={index}>
                {step.image && <img src={`${RECIPE_IMAGE_PATH}/${step.image}`} alt={`step-${index}`} />}
                {step.content}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 댓글 섹션 */}
      <div className="comment-section">
        <h2>레시피 댓글</h2>
        {comments && comments.length > 0 ? (
          comments.map((comment, idx) => (
            <div className="comment-box" key={comment.id || idx}>
              <div className="comment-header">
                <span className="comment-user">{comment.memberName}</span>
                <span className="comment-date"></span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))
        ) : (
          <p>댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
        )}

        {/* 댓글 작성 영역 */}
        <div className="comment-input-container">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력해주세요."
            onFocus={() => setShowSubmitButton(true)}
            onBlur={() => {
              if (!commentInput.trim()) setShowSubmitButton(false);
            }}
          />
          {showSubmitButton && (
            <button
              className="comment-submit-button"
              onClick={handleCommentSubmit}
            >
              댓글등록
            </button>
          )}
        </div>
      </div>

      {/* ============================
          모달 (내 식단에 추가)
      ============================ */}
      {showMealPlanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>내 식단에 추가</h2>
            <div className="modal-row">
              <label>추가할 날짜</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="modal-row">
              <label>식단 유형</label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
              >
                <option value="아침">아침</option>
                <option value="점심">점심</option>
                <option value="저녁">저녁</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button onClick={handleCloseModal}>취소</button>
              <button onClick={handleSaveMealPlan}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeDetail;
