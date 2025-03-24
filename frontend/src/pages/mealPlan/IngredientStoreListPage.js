import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "components/BackButton";
import "styles/mealPlan/shoppingList.css"; // CSS 파일
import axiosInstance from "api/axios";
import { STORE_IMAGE_PATH } from "config/pathConfig";
import { useLocation, useNavigate } from "react-router-dom";
import FloatingNextButton from "components/FloatingNextButton";
import RouteConfig from "routes/routeConfig";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import 'styles/store/StoreDetail.css';


const IngredientStoreListPage = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedIngredients = location.state?.selectedIngredients || []; // ⬅ 받은 데이터
  const [selectedProduct, setSelectedProduct] = useState(null); // 선택된 상품 정보
  const [openModal, setOpenModal] = useState(false); // 모달 열림/닫힘 상태

  
  //  API 호출: 부족 재료 보유한 상점 리스트 가져오기
  useEffect(() => {
    const fetchShoppingStoreList = async () => {
      try {
        if (selectedIngredients.length === 0) return;
         const ingredientIds = selectedIngredients.map((item) => item.mealPlanIngredientId);
         console.log("API 요청 ingredientIds:", ingredientIds);
         
        
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

  const handleNext = async () => {
    if (!selectedStore) {
      return;
    }

    try {
       //기존 장바구니의 상품 조회
    const cartResponse = await axiosInstance.get("/store/cart");
      const cartItems = cartResponse.data;
         

       //장바구니가 비어있지 않다면 기존 storeId와 선택한 storeId 비교
    if (cartItems.length > 0) {
      const existingStoreId = cartItems[0].storeId; // 장바구니의 첫 번째 아이템 기준
       
      if (existingStoreId !== selectedStore.storeId) {
        console.log(" 다른 스토어 상품이 장바구니에 있음!");
         setSelectedProduct({
          ingredientIds: selectedIngredients.map(ingredient => ingredient.mealPlanIngredientId),
          storeId: selectedStore.storeId
        });
        setOpenModal(true);
        return;
      }
      }
      //  동일한 storeId면 상품 추가 가능
  await axiosInstance.post("/store/cart/add", {
  storeId: selectedStore.storeId,
  ingredients: selectedIngredients.map(item => ({
    ingredientId: item.mealPlanIngredientId,
    quantity: item.mealPlanQuantity - item.memberQuantity
  }))
});
     
      // 장바구니 페이지로 이동
      toast.success("상품이 장바구니에 추가되었습니다.", { position: "top-center", autoClose: 3000 });
    navigate(RouteConfig.paths.cart);

  } catch (error) {
    console.error(" 장바구니 추가 오류:", error);
    toast.error("장바구니에 추가하는 데 실패했습니다.", { position: "top-center", autoClose: 3000 });
  }
  };
  // 기존 장바구니 비우고 새 상품 추가
const replaceCartWithNewItem = async () => {
  try {
    //  기존 장바구니 조회
    const cartResponse = await axiosInstance.get('/store/cart');
    const cartItems = cartResponse.data;

    if (cartItems.length > 0) {
      const cartIdList = cartItems.map(item => item.id);
      console.log("cartIdList : ", cartIdList);

      //  기존 장바구니 삭제
      await axiosInstance.delete('/store/cart', {
        data: cartIdList
      });
    }

    //  새로운 상품 추가
    await axiosInstance.post("/store/cart/add", selectedProduct);
    
    toast.success("기존 상품을 삭제하고 새 상품을 추가했습니다.", { position: "top-center", autoClose: 3000 });

    // 모달 닫기 & 장바구니 페이지 이동
    setOpenModal(false);
    navigate(RouteConfig.paths.cart);
  } catch (error) {
    console.error("장바구니 초기화 중 오류 발생", error);
    toast.error("장바구니를 비우는 데 실패했습니다.", { position: "top-center", autoClose: 3000 });
  }
};
  return (

    <div className="shopping-container">
      {/* 뒤로가기 버튼 */}
      <div className="preferred-header">
        <BackButton onClick={handleBefore}/>
      </div>

      {/* 제목 */}
      <h2 className="shopping-title" style={{ textAlign: "center" }}>우리 집 주변 스토어</h2>

      {stores.length === 0 ? (
        <p className="no-items">해당 재료를 보유한 스토어가 없습니다.</p>
      ) : (
        <table className="shopping-table">
          <thead>
            <tr >
              <th> </th>
              <th></th>
              <th>주변 스토어</th>
              <th>정상가</th>
              <th style={{color:"#f35c04"}}>Pay 할인가</th>
            </tr>
          </thead>
          <tbody>
              {stores.map((stores, index) => (
              <tr key={index}>
                  <td><input type="radio" name="store" value={stores.storeName} onChange={() => setSelectedStore(stores)} /></td>
                  {/* 이미지 */}
                  <td>
                  <img src={`${STORE_IMAGE_PATH}/${stores.image}`} alt={stores.ingredientName}
                    style={{ width: "60px", height: "60px", objectFit: "contain" }}
                   />
                  </td>
                  <td style={{fontSize:"14px",wordBreak:"break-word",width:"110px"} }>{stores.storeName}</td>
                  <td>{formatPrice(stores.totalPrice)}</td>
                  <td style={{color:"#f35c04", fontWeight:"bold"}} >{formatPrice(stores.totalDiscountPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      { /*장바구니 담고 페이지 이동 추가가*/}
      <FloatingNextButton onClick={handleNext} disabled={!selectedStore} >
      장바구니에 담기
      </FloatingNextButton>
    
{/* 장바구니 단일 스토어의 상품들인지 확인하는 모달창 */}
           <Modal show={openModal} onHide={() => setOpenModal(false)} centered dialogClassName="cart-modal">
 
                <Modal.Body>
                    <h6 style={{fontWeight:"bold"}}>같은 가게의 상품만 담을 수 있습니다.</h6>
          <hr/>          
          선택하신 상품을 장바구니에 담을 경우 <br/>이전에 담은 상품이 <span style={{color:"#f35c04"}}>삭제</span>됩니다.
                </Modal.Body>
        <Modal.Footer style={{flexWrap: "nowrap"}}>
                    <Button style={{margin :"0px"}} variant="secondary" onClick={() => setOpenModal(false)}>아니오</Button>
                    <Button  className="cart-modal-button2" style={{backgroundColor:"#f35c04",borderColor:"#f35c04"}} onClick={replaceCartWithNewItem}>담기</Button>
                </Modal.Footer>
            </Modal>
  </div>
  );
};

export default IngredientStoreListPage;
