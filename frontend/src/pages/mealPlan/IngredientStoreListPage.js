import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "components/BackButton";
import "styles/mealPlan/shoppingList.css"; // CSS 파일
import axiosInstance from "api/axios";
import { STORE_IMAGE_PATH } from "config/pathConfig";
import { useLocation, useNavigate } from "react-router-dom";
import FloatingNextButton from "components/FloatingNextButton";
import RouteConfig from "routes/routeConfig";

const IngredientStoreListPage = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedIngredients = location.state?.selectedIngredients || []; // ⬅ 받은 데이터
console.log(" 선택된 재료:", selectedIngredients);
  //  API 호출: 부족 재료 보유한 상점 리스트 가져오기
  useEffect(() => {
    const fetchShoppingStoreList = async () => {
      try {
        if (selectedIngredients.length === 0) return;
         const ingredientIds = selectedIngredients.map((item) => item.mealPlanIngredientId);
         console.log(" API 요청 ingredientIds:", ingredientIds);
         
        
        const response = await axiosInstance.post(
          `/store/emptyproduct`,
          { ingredientIds },  
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
  }, [selectedIngredients]);

const formatPrice = (price) => {
  return price.toLocaleString("ko-KR") + "원";
};
const handleBefore = () => {
    navigate(RouteConfig.paths.notEnoughIngredientList);
  };

  const handleNext = () => {
    navigate(RouteConfig.paths.cart);
}
  return (
    <div className="shopping-container">
      {/* 뒤로가기 버튼 */}
      <div className="clickbutton">
        <BackButton onClick={handleBefore}/>
      </div>

      {/* 제목 */}
      <h2 className="shopping-title" style={{ textAlign: "center",marginBottom:"20px" }}>주변 스토어</h2>

      {stores.length === 0 ? (
        <p className="no-items">해당 재료를 보유한 스토어가 없습니다.</p>
      ) : (
        <table className="shopping-table">
          <thead>
            <tr>
              <th> </th>
              <th></th>
              <th>스토어</th>
              <th>정상가</th>
              <th>Pay 할인가</th>
            </tr>
          </thead>
          <tbody>
              {stores.map((stores, index) => (
              <tr key={index}>
                  <td><input type="radio" name="store" value={stores.storeName} onChange={() => setSelectedStore(stores)} /></td>
                  {/* 이미지 */}
                  <td>
                  <img src={`${STORE_IMAGE_PATH}/${stores.image}`} alt={stores.ingredientName}
                    style={{ width: "50px", height: "50px", objectFit: "contain" }}
                   />
                  </td>
                  <td style={{width:"100px", wordWrap: "break-word"}}>{stores.storeName}</td>
                  <td>{formatPrice(stores.totalPrice)}</td>
                  <td style={{color:"#f35c04"}}>{formatPrice(stores.totalDiscountPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      { /*장바구니 담고 페이지 이동 추가가*/}
      <FloatingNextButton onClick={handleNext} disabled={selectedIngredients.length === 0} >
      장바구니에 담기
      </FloatingNextButton>
    </div>
  );
};

export default IngredientStoreListPage;
