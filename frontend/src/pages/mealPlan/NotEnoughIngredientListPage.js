import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "components/BackButton";
import "styles/mealPlan/shoppingList.css"; // CSS 파일

const NotEnoughIngredientListPage = () => {
  const [ingredients, setIngredients] = useState([]);

  // 📌 API 호출: 부족한 재료 리스트 가져오기
  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/inventory/gap?startDate=2025-03-10&endDate=2025-03-16`
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

  // 📌 재료 선택을 위한 체크박스 상태 관리
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleCheckboxChange = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  return (
    <div className="shopping-container">
      {/* 뒤로가기 버튼 */}
      <div className="header">
        <BackButton />
      </div>
      {/* 제목 */}
      <h2 className="title" style={{ textAlign: "center" }}>필요한 재료 리스트</h2>

      {ingredients.length === 0 ? (
        <p className="no-items">부족한 재료가 없습니다 🎉</p>
      ) : (
        <table className="shopping-table">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>재료명</th>
              <th>현재 보유량</th>
              <th>구매 필요량</th>
            </tr>
          </thead>
          <tbody>
              {ingredients.filter((item) => item.mealPlanQuantity - item.memberQuantity > 0)
                .map((item, index) => (
              <tr key={index}>
                {/* 체크박스 */}
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(item)}
                  />
                </td>
                {/* 이미지 */}
                <td>
                  <img 
                    src={`/assets/images/ingredients/${item.image}`} 
                    alt={item.ingredientName}
                    style={{ width: "50px", height: "50px", objectFit: "contain" }}
                   />
                </td>
                {/* 재료명 */}
                <td>{item.ingredientName}</td>
                {/* 현재 보유량 */}
                <td>{item.memberQuantity ?? 0} {item.ingredientUnit}</td>
                {/* 구매 필요량 */}
                <td>{item.mealPlanQuantity - item.memberQuantity} {item.ingredientUnit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NotEnoughIngredientListPage;
