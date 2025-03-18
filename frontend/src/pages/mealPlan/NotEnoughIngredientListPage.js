import React, { useEffect, useState } from "react";
import BackButton from "components/BackButton";
import "styles/mealPlan/shoppingList.css"; // CSS 파일
import axiosInstance from "api/axios";
import { INGREDIENT_IMAGE_PATH } from "config/pathConfig";
import useNotEnoughIngredients from "hooks/useNotEnoughIngredients";
import { useNavigate } from "react-router-dom"; 
import FloatingNextButton from "components/FloatingNextButton";
import RouteConfig from "routes/routeConfig";

const NotEnoughIngredientListPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const { notEnoughIngredients, loading } = useNotEnoughIngredients(); // 공통 훅 사용
  const navigate = useNavigate();

 //처음에 모든 재료가 선택된 상태로 초기화
  const [selectedIngredients, setSelectedIngredients] = useState(notEnoughIngredients);


//개별 체크박스 클릭 시 선택된 재료 업데이트
  const handleCheckboxChange = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  // 전체 선택/해제 기능
  const handleSelectAll = () => {
    if (selectedIngredients.length === notEnoughIngredients.length) {
      setSelectedIngredients([]); // 전부 해제
    } else {
      setSelectedIngredients(notEnoughIngredients); // 전부 선택
    }
  };


// 다음 페이지로 데이터 전달하는 함수
  const handleNextPage = () => {
    navigate("/store-shopping-container", { state: { selectedIngredients } });
  };
 const handleBefore = () => {
    navigate(RouteConfig.paths.mealPlanListDaily);
  };
  return (
    <div className="shopping-container">

      {/* 뒤로가기 버튼 */}
      <div className="clickbutton">
        <BackButton onClick={handleBefore}/>
      </div>

      {/* 제목 */}
      <h2 className="title" style={{ textAlign: "center" }}>필요한 재료 리스트</h2>

      {notEnoughIngredients.length === 0 ? (
        <p className="no-items">부족한 재료가 없습니다 🎉</p>
      ) : (
        <table className="shopping-table">
          <thead>
            <tr>
                {/*  `th` 클릭 시 전체 선택/해제 */}
                <th>
                  <input
                    type="checkbox"
                    checked={selectedIngredients.length === notEnoughIngredients.length}
                    onChange={handleSelectAll}
                  /></th>
                <th></th>
              <th>재료명</th>
              <th>현재 보유량</th>
              <th>구매 필요량</th>
            </tr>
          </thead>
          <tbody>
              {notEnoughIngredients
              .filter((item) => item.mealPlanQuantity - item.memberQuantity > 0)
                .map((item, index) => (
              <tr key={index}>
                  {/* 체크박스 */}
                  <td>
                    <input
                        type="checkbox"
                        checked={selectedIngredients.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                      />
                  </td>

                {/* 이미지 */}
                <td>
                  <img 
                    src={`${INGREDIENT_IMAGE_PATH}/${item.image}`} 
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
      <FloatingNextButton onClick={handleNextPage} disabled={selectedIngredients.length === 0} />
            다음 페이지로 이동
    </div>
  );
};

export default NotEnoughIngredientListPage;
