import axiosInstance from 'api/axios';
import { INGREDIENT_IMAGE_PATH, STORE_IMAGE_PATH } from 'config/pathConfig';
import { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import routeConfig from 'routes/routeConfig';
import 'styles/store/StoreDetail.css';

function StoreDetail() {
    const { storeId } = useParams(); // URL에서 storeId 가져오기
    const [storeProductList, setStoreProductList] = useState();
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태 관리
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true); // 최초 데이터 로딩 상태 관리
    const location = useLocation();
    const storeData = location.state; // StoreList.jsx에서 전달한 store 정보 받기
    const navigate = useNavigate();

    // 카테고리 목록 배열
    const categories = ['전체', '과일', '채소', '고기', '수산물', '유제품', '음료', '조미료', '기타', '빵류', '견과류', '곡물'];

    useEffect(() => {
        // 스토어 상품 정보 가져오기
        const fetchStoreProduct = async () => {
            try {
                setLoading(true); // 데이터 로드 시작
                const storeProductDTOList = await axiosInstance.get(`/store/${storeId}/product`);
                setStoreProductList(storeProductDTOList.data);
            } catch (error) {
                console.error("스토어 상품 정보를 가져오는 중 오류 발생: ", error);
            } finally {
                setLoading(false); // 데이터 로드 완료
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

        navigate(routeConfig.paths.storeReview.replace(":storeId", storeId));
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

    // 모달 열기
    const openModalHandler = (productId) => {
        setSelectedProduct(productId);
        setOpenModal(true);
    };

    // 모달 닫기
    const closeModalHandler = () => {
        setOpenModal(false);
        setSelectedProduct(null);
    };

    // 장바구니에 상품 추가
    const addToCartHandler = async (e, productId) => {
        e.stopPropagation(); // 부모 요소 클릭 이벤트 방지

        const button = e.currentTarget;

        // 1. 복제된 flying + 만들기
        const clone = button.cloneNode(false);
        clone.classList.remove("add-to-cart");
        clone.classList.add("flying-plus");
        clone.innerText = "+";

        // 2. 버튼에 삽입
        button.appendChild(clone);

        // 3. 애니메이션 종료 후 제거
        setTimeout(() => {
            if (clone && clone.parentNode) {
            clone.parentNode.removeChild(clone);
            }
        }, 1500); // 애니메이션 길이와 맞춰서

        try {
            const cartResponse = await axiosInstance.get('/store/cart');
            const cartItems = cartResponse.data;

            if (cartItems.length > 0) {
                const currentStoreId = cartItems[0].storeId;

                if (Number(currentStoreId) !== Number(storeId)) {
                    openModalHandler(productId);

                    return;
                }
            }

            // 같은 가게의 상품이거나 장바구니가 비어있으면 추가
            const response = await axiosInstance.post(`/store/cart/${productId}`);
            // react-toastify를 통한 알림
            toast.success(response.data.message, {
                position: "top-center",
                autoClose: 2000,
            });
        } catch (error) {
            console.error("장바구니 추가 중 오류 발생", error);
            toast.error('장바구니 추가에 실패했습니다.', {
                position: "top-center",
                autoClose: 2000,
            });
        }
    }

    // 기존 장바구니 비우고 새 상품 추가
    const replaceCartWithNewItem = async () => {
        try {
            // 기존 장바구니의 productId 목록 가져오기
            const cartResponse = await axiosInstance.get('/store/cart');
            const cartItems = cartResponse.data;

            if (cartItems.length > 0) {
                const cartIdList = cartItems.map(item => item.id);
                console.log("cartIdList : ", cartIdList);

                // 기존 장바구니 삭제 요청(RequestBody로 productIds 전달)
                await axiosInstance.delete('/store/cart', {
                    data: cartIdList
                });
            }

            // 새로운 상품 추가
            await axiosInstance.post(`/store/cart/${selectedProduct}`);
            toast.success("기존 상품을 삭제하고 새 상품을 추가했습니다.", { position: "top-center", autoClose: 2000 });

            // 모달 닫기
            closeModalHandler();
        } catch (error) {
            console.error("장바구니 초기화 중 오류 발생", error);
            toast.error('장바구니를 비우는 데 실패했습니다.', { position: "top-center", autoClose: 2000 });
        }
    };

    if (loading) {
        return <div className='store-detail-spinner'>
                <Spinner animation="border" variant="warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>;
    }

    if (!storeProductList || storeProductList.length === 0) {
        return <div className='store-product-empty'>
                <img src={`${STORE_IMAGE_PATH}/StoreProductEmpty.jpg`} alt="StoreProductEmpty" />
                <b>스토어가 텅 비었어요</b>
            </div>;
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
                <input type="text" placeholder='재료(상품)명을 입력하세요.' className='search-ingredient' value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') searchProducts(); }} />
                <FaSearch className='search-icon' onClick={searchProducts} />
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
                                        {Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)}%<br />
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

            {/* 장바구니 단일 스토어의 상품들인지 확인하는 모달창 */}
            <Modal show={openModal} onHide={closeModalHandler} centered dialogClassName='cart-modal'>
                <Modal.Header>
                    <b>장바구니에는<br />같은 가게의 상품만 담을 수 있습니다.</b>
                </Modal.Header>
                <Modal.Body>
                    선택하신 상품을 장바구니에 담을 경우<br />이전에 담은 상품이 <span className='modal-delete-text'>삭제</span>됩니다.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModalHandler}>취소</Button>
                    <Button variant="success" onClick={replaceCartWithNewItem} className='modal-add-button'>담기</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </>
    );
}

export default StoreDetail;