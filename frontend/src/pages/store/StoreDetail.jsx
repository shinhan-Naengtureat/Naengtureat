import axiosInstance from 'api/axios';
import { INGREDIENT_IMAGE_PATH } from 'config/pathConfig';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function StoreDetail() {
    const { storeId } = useParams(); // URL에서 storeId 가져오기
    const [storeProductList, setStoreProductList] = useState();

    useEffect(() => {
        // 스토어 상품 정보 가져오기
        const fetchStoreProduct = async () => {
            try {
                const storeProductDTOList = await axiosInstance.get(`/store/${storeId}/product`);
                console.log("storeProductDTOList : ", storeProductDTOList.data);
                setStoreProductList(storeProductDTOList.data);
            } catch (error) {
                console.error("스토어 상품 정보를 가져오는 중 오류 발생: ", error);
            }
        };

        fetchStoreProduct();
    }, [storeId]);

    if (!storeProductList || storeProductList.length === 0) {
        return <div>스토어 상품 정보가 없습니다.</div>;
    }

    return (
        <>
            {/* 스토어 이름 표시 */}
            <h2 className="store-name">{storeProductList[0]?.storePlaceName}</h2>

            <div className="store-detail">
                {/* 상품 카드 UI */}
                <div className="product-grid">
                    {storeProductList.map((product) => (
                        <div key={product.id} className="product-card">
                            {/* 상품 이미지 */}
                            <img src={`${INGREDIENT_IMAGE_PATH}/${product.image.split('_')[1]}`} alt={product.name} className="product-image" />
                            
                            {/* 할인율 */}

                            {/* 상품 정보 */}
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                
                                {/* 가격 정보 */}
                                <div className="prices">
                                    <span className="discount-price">
                                        {product.discountPrice ? product.discountPrice.toLocaleString() : '가격 정보 없음'}원
                                    </span>
                                    {product.productPrice && (
                                        <span className="product-price"><s>{product.productPrice.toLocaleString()}원</s></span>
                                    )}
                                </div>

                                {/* 상품 카테고리 */}
                                <div className="ingredient">{product.ingredientBigCategory}</div>
                            </div>
                            
                            {/* 장바구니에 추가하는 버튼 */}
                            <button className="add-to-cart">+</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default StoreDetail;