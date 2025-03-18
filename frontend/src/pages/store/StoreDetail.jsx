import axiosInstance from 'api/axios';
import { INGREDIENT_IMAGE_PATH, STORE_IMAGE_PATH } from 'config/pathConfig';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'styles/store/StoreDetail.css';

function StoreDetail() {
    const { storeId } = useParams(); // URL에서 storeId 가져오기
    const [storeProductList, setStoreProductList] = useState();
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태 관리
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const location = useLocation();
    const storeData = location.state; // StoreList.jsx에서 전달한 store 정보 받기
    const navigate = useNavigate();

    // 카테고리 목록 배열
    const categories = ['전체', '과일', '채소', '고기', '수산물', '유제품', '음료', '조미료', '기타', '빵류', '견과류', '곡물'];

    useEffect(() => {
        // 스토어 상품 정보 가져오기
        const fetchStoreProduct = async () => {
            try {
                const storeProductDTOList = await axiosInstance.get(`/store/${storeId}/product`);
                console.log("스토어 상품 목록 : ", storeProductDTOList.data);
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

    // 검색어를 기반으로 상품 검색 요청
    const searchProducts = async () => {
        if (searchKeyword.trim() === '') {
            try {
                const response = await axiosInstance.get(`/store/${storeId}/product`);
                setStoreProductList(response.data);
            } catch (error) {
                console.error("스토어 상품 정보를 가져오는 중 오류 발생: ", error);
            }
            return;
        }

        try {
            const response = await axiosInstance.get(`/store/product/${searchKeyword}`);
            console.log("키워드 기반 검색 결과 : ", response.data);
            setStoreProductList(response.data);
        } catch (error) {
            console.error("키워드 기반 검색 결과 가져오는 중 오류 발생: ", error);
        }
    };

    // 카테고리 별 필터링: selectedCategory가 '전체'이면 전체를, 아니면 선택한 카테고리에 맞는 상품만 반환
    const filteredProducts = useMemo(() => {
        if (selectedCategory === '전체') return storeProductList;

        return storeProductList.filter(
            product => product.ingredientBigCategory === selectedCategory
        );
    }, [storeProductList, selectedCategory]);

    // 장바구니에 상품 추가
    const addToCartHandler = async (e, productId) => {
        e.stopPropagation(); // 부모 요소 클릭 이벤트 방지

        try {
            const response = await axiosInstance.post(`/store/cart/${productId}`);
            // react-toastify를 통한 알림
            toast.success(response.data.message, {
                position: "top-center",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("장바구니 추가 중 오류 발생", error);
            toast.error('장바구니 추가에 실패했습니다.', {
                position: "top-center",
                autoClose: 3000,
            });
        }
    }

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
                <input type="text" placeholder='재료명을 입력하세요.' className='search-ingredient' value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') searchProducts(); }} />
            </div>

            {/* 카테고리 */}
            <div className='store-category'>
                <ul className="category-list">
                    {categories.map((category) => (
                        <li key={category} className={`category-item ${selectedCategory === category ? 'active' : ''}`} onClick={() => setSelectedCategory(category)}>
                            {category}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 상품 카드 UI */}
            <div className="product-grid">
                {filteredProducts.map((product) => (
                // {storeProductList.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="image-container">
                            {/* 상품 이미지 */}
                            <img src={`${INGREDIENT_IMAGE_PATH}/${product.image.split('_')[1]}`} alt={product.name} className="product-image" />
                            {/* 장바구니에 추가하는 버튼 */}
                            <button className="add-to-cart" onClick={(e) => addToCartHandler(e, product.id)}>+</button>
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
            <ToastContainer />
        </>
    );
}

export default StoreDetail;