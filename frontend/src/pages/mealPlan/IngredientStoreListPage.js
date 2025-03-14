import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "components/BackButton";
import "styles/mealPlan/shoppingList.css"; // CSS 파일
import axiosInstance from "api/axios";

const IngredientStoreListPage = (selectedIngredients) => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

   // 📌 테스트용 하드코딩된 `ingredientIds`
  const testIngredientIds = [4, 6, 79]; // 테스트 ID 값

  // 📌 API 호출: 부족 재료 보유한 상점 리스트 가져오기
  useEffect(() => {
    const fetchShoppingStoreList = async () => {
      try {
        if (!selectedIngredients || selectedIngredients.length === 0) return;
        const response = await axiosInstance.post(
          `/store/emptyproduct`,
          { ingredientIds: testIngredientIds }, //하드코딩용 
          // { ingredientIds: selectedIngredients.map((item) => item.id) }, // JSON Body로 전달
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.error("스토어 리스트 API 호출 오류:", error);
      }
    };
    fetchShoppingStoreList();
  }, []);


  return (
    <div className="shopping-container">
      {/* 뒤로가기 버튼 */}
      <div className="header">
        <BackButton />
      </div>
      {/* 제목 */}
      <h2 className="title" style={{ textAlign: "center" }}>판매지점 리스트</h2>

      {stores.length === 0 ? (
        <p className="no-items">해당 재료를 보유한 스토어가 없습니다.</p>
      ) : (
        <table className="shopping-table">
          <thead>
            <tr>
              <th> </th>
              <th>사진</th>
              <th>가게명</th>
              <th>가격</th>
              <th>할인된 가격</th>
            </tr>
          </thead>
          <tbody>
              {stores.map((stores, index) => (
              <tr key={index}>
                  <td><input type="radio" name="store" value={stores.storeName} onChange={() => setSelectedStore(stores)} /></td>
                  {/* 이미지 */}
                  <td>
                  <img src={`/assets/images/stores/${stores.image}.png`} alt={stores.ingredientName}
                    style={{ width: "50px", height: "50px", objectFit: "contain" }}
                   />
                  </td>
                  <td>{stores.storeName}</td>
                  <td>{stores.totalPrice}</td>
                  <td>{stores.totalDiscountPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IngredientStoreListPage;
