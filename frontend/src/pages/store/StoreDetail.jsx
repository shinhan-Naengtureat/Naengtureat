import axiosInstance from 'api/axios';
import { INGREDIENT_IMAGE_PATH, STORE_IMAGE_PATH } from 'config/pathConfig';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import 'styles/store/StoreDetail.css';

function StoreDetail() {
    const { storeId } = useParams(); // URL에서 storeId 가져오기
    const [storeProductList, setStoreProductList] = useState();
    const location = useLocation();
    const storeData = location.state; // StoreList.jsx에서 전달한 store 정보 받기
    const navigate = useNavigate();

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

    // 스토어 후기 조회
    const reviewHandler = (e, storeId) => {
        e.stopPropagation(); // 클릭 이벤트 버블링 방지

        if (!storeId) {
            console.error("유효하지 않은 storeId:", storeId);
            return;
        }

        navigate(`/store/${storeId}/review`);
    };

    if (!storeProductList || storeProductList.length === 0) {
        return <div>스토어 상품 정보가 없습니다.</div>;
    }

    return (
        <>
            <div className='store-detail-info'>
                {/* 스토어 사진 */}
                <img src={`${STORE_IMAGE_PATH}/${storeData?.image}`} alt="이미지" className='store-detail-image' />
                <div className='store-detail-header'>
                    {/* 스토어 이름 표시 */}
                    <span className="store-detail-name">{storeProductList[0]?.storePlaceName}</span>
                    {/* 별점 */}
                    <span className="rate" onClick={(e) => reviewHandler(e, storeData.id)}>
                        ⭐ {storeData.rateAvg} ({storeData.reviewCount})<b className='gt'>&gt;</b>
                    </span>
                </div>
            </div>

            {/* 검색바 */}
            <div className='store-search-bar'>
                <input type="text" placeholder='재료명을 입력하세요.' className='search-ingredient' />
            </div>

            {/* 카테고리 */}
            <div className='store-category'>
                <ul className="category-list">
                    <li className="category-item active">전체</li>
                    <li className="category-item">과일</li>
                    <li className="category-item">채소</li>
                    <li className="category-item">고기</li>
                    <li className="category-item">수산물</li>
                    <li className="category-item">유제품</li>
                    <li className="category-item">음료</li>
                    <li className="category-item">조미료</li>
                    <li className="category-item">기타</li>
                    <li className="category-item">빵류</li>
                    <li className="category-item">견과류</li>
                    <li className="category-item">곡물</li>
                </ul>
            </div>

            {/* 상품 카드 UI */}
            <div className="product-grid">
                {storeProductList.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="image-container">
                            {/* 상품 이미지 */}
                            <img src={`${INGREDIENT_IMAGE_PATH}/${product.image.split('_')[1]}`} alt={product.name} className="product-image" />
                            {/* 장바구니에 추가하는 버튼 */}
                            <button className="add-to-cart">+</button>
                        </div>

                        {/* 상품 정보 */}
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            
                            {/* 가격 정보 */}
                            <div className="prices">
                                {/* 정가 */}
                                {product.discountPrice != null && product.productPrice && (
                                    <span className="product-price"><s>{product.productPrice.toLocaleString()}원</s><br /></span>
                                )}
                                {/* 할인율 */}
                                {product.discountPrice != null && product.productPrice && product.discountPrice && (
                                    <span className="discount-rate">
                                        {Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)}%
                                    </span>
                                )}

                                {/* 할인가 */}
                                <span className="discount-price">
                                    {product.discountPrice ? product.discountPrice.toLocaleString() : product.productPrice.toLocaleString()}원
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default StoreDetail;