import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "components/BackButton";
import "styles/mealPlan/shoppingList.css"; // CSS 파일

const ShoppingListPage = ({ onSelectIngredients }) => {
  const [ingredients, setIngredients] = useState([]);
  const [expandedRecipes, setExpandedRecipes] = useState({});
  const navigate = useNavigate();
  //  API 호출: 부족한 재료 리스트 가져오기
  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/inventory/gap?startDate=${"2025-03-10"}&endDate=${"2025-03-16"}`
        );
        if (response.status === 200) {
          setIngredients(response.data);
        }
      } catch (error) {
        console.error("재료 리스트 API 호출 오류:", error);
      }
    };
    fetchShoppingList();
  }, []);

  //같은 레시피명을 기준으로 그룹화
  const groupedIngredients = ingredients.reduce((acc, item) => {
    if (!acc[item.recipeName]) {
      acc[item.recipeName] = [];
    }
    acc[item.recipeName].push(item);
    return acc;
  }, {});

  // 📌 특정 레시피 그룹 토글 (펼치기/접기)
  const toggleRecipe = (recipeName) => {
    setExpandedRecipes((prev) => ({
      ...prev,
      [recipeName]: !prev[recipeName],
    }));
  };

  return (
    <div className="shopping-container">
      {/* 뒤로가기 버튼 */}
      <div className="header">
        <BackButton />
      </div>
      {/* 제목 */}
      <h2 className="title" style={{ textAlign: "center" }}>
        필요한 재료 리스트
      </h2>

      {ingredients.length === 0 ? (
        <p className="no-items">부족한 재료가 없습니다 🎉</p>
      ) : (
        <table className="shopping-table">
          <thead>
            <tr>
              <th>재료명</th>
              <th>현재 보유량</th>
              <th>구매 필요량</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedIngredients).map((recipeName, index) => (
              <React.Fragment key={index}>
                {/* 📌 레시피 그룹 헤더 (한 줄만 표시) */}
                <tr>
                  <td colSpan="4">
                    <strong>{recipeName}</strong>
                  </td>
                  <td>
                    <button onClick={() => toggleRecipe(recipeName)}>
                      {expandedRecipes[recipeName] ? "-" : "+"}
                    </button>
                  </td>
                </tr>

                {/* 📌 레시피별 재료 리스트 (펼쳤을 때만 보이게) */}
                {expandedRecipes[recipeName] &&
                  groupedIngredients[recipeName].map((item, i) => (
                    <tr key={i}>
                      <td></td> {/* 레시피명 자리 비우기 */}
                      <td>{item.ingredientName}</td>
                      <td>{item.memberQuantity ?? 0}</td>
                      <td>{item.mealPlanQuantity - item.memberQuantity}</td>
                      <td></td> {/* 펼치기 버튼 자리 비우기 */}
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default ShoppingListPage;
