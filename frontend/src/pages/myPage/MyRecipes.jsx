import axiosInstance from "api/axios";
import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // useNavigate 추가

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate(); // navigate 훅 사용

  // 레시피 목록 불러오기
  useEffect(() => {
    axiosInstance
      .get("/recipe/myrecipeList")
      .then((response) => {
        console.log("API 응답 데이터:", response.data);
        const dataArray = Array.isArray(response.data) ? response.data : [];
        setRecipes(dataArray);
      })
      .catch((error) => {
        console.error("레시피 로드 에러:", error);
      });
  }, []);

  // 삭제 기능
  const handleDelete = async (recipeId) => {
    try {
      const response = await axiosInstance.delete(`/recipe/${recipeId}`);
      console.log("삭제 결과:", response.data);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    }
  };

  // 전체 아이템 스타일
  const listItemStyle = {
    position: "relative",
    padding: "9px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "15px",
    backgroundColor: "#fff",
  };

  // 수정/삭제 아이콘 스타일
  const iconsContainerStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    gap: "10px",
  };

  // 이미지 스타일
  const imageStyle = {
    width: "120px",
    borderRadius: "5px",
  };

  // 텍스트 컨테이너 (우측)
  const textContainerStyle = {
    marginLeft: "35px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {/* 상단 헤더 영역 */}
      <header style={{ textAlign: "center", marginBottom: "60px" }}>
        <p style={{ margin: "5px 0", color: "#666" }}>
          등록한 나의 레시피를 확인해 보세요.
        </p>
      </header>

      {/* 레시피 개수 */}
      <div style={{ textAlign: "left", marginBottom: "20px", fontWeight: "bold" }}>
        총 {recipes.length}개의 레시피
      </div>
      {recipes.length === 0 ? (
        <p>등록된 레시피가 없습니다.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {recipes.map((recipe) => (
            <li key={recipe.id} style={listItemStyle}>
              <div style={iconsContainerStyle}>
                <FaPencilAlt
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/recipe/edit/${recipe.id}`)}
                />
                <FaTimes
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(recipe.id)}
                />
              </div>
              {/* 좌측: 이미지, 우측: 텍스트 */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/recipes/${recipe.image}`}
                  alt={recipe.name}
                  style={imageStyle}
                />
                <div style={textContainerStyle}>
                  <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem" }}>{recipe.name}</h3>
                  <p style={{ margin: 0, color: "#555" }}>{recipe.category}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyRecipes;
