import axiosInstance from 'api/axios';
import { INGREDIENT_IMAGE_PATH, STORE_IMAGE_PATH } from 'config/pathConfig';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import routeConfig from 'routes/routeConfig';
import 'styles/store/Cart.css';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const cartDTOList = await axiosInstance.get('/store/cart');

                // 모든 항목을 기본적으로 선택 상태로 변경
                const checkedCartItems = cartDTOList.data.map(item => ({ ...item, isCheck: true }));

                setCartItems(checkedCartItems);
                setCheckAll(true);
            } catch (error) {
                console.log('장바구니 정보를 가져오는 중 오류 발생 : ', error);
                toast.error('장바구니 정보를 가져오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        sessionStorage.removeItem("ordersDTO");
        sessionStorage.removeItem("orderDetailDTOList");
        sessionStorage.removeItem("isPaymentProcessed");
        sessionStorage.removeItem("responseDtos");
        sessionStorage.removeItem("isNaengPayCharge");
        sessionStorage.removeItem("finalPrice");
        sessionStorage.removeItem("chargeAmount");

        fetchCartItems();
    }, []);

    // 전체 선택 체크박스 변경 시 처리
    const checkAllHandler = (e) => {
        const isChecked = e.target.checked;
        setCheckAll(isChecked);

        setCartItems((prevItems) => prevItems.map((item) => ({
            ...item,
            isCheck: isChecked
        })));
    };

    // 선택 삭제 버튼 클릭 시 처리
    const deleteCheckedHandler = () => {
        // 체크된 상품의 id 목록
        const checkedIds = cartItems.filter((item) => item.isCheck).map((item) => item.id);

        if (checkedIds.length === 0) {
            // 선택된 항목이 없을 경우, 필요한 경우 경고 메시지 등을 표시
            toast.error('선택된 상품이 없습니다.', {
                position: "top-center",
                autoClose: 3000,
            });

            return;
        }

        // DB의 cart 테이블에서 삭제
        axiosInstance.delete('/store/cart', {
            data: checkedIds
        })
        .then(() => {
            // 체크된 아이템 제거
            setCartItems((prevItems) => prevItems.filter((item) => !checkedIds.includes(item.id)));
            setCheckAll(false);
        })
        .catch((error) => {
            console.error("선택 항목 삭제 중 오류 발생 : ", error);
        })
    };

    // 개별 체크 박스
    const checkHandler = (itemId) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map((item) => {
                if (item.id === itemId) {
                    return { ...item, isCheck: !item.isCheck };
                }
                return item;
            });

            // 모든 아이템이 체크되어 있으면 checkAll도 true, 아니면 false
            const allChecked = updatedItems.every((item) => item.isCheck);
            setCheckAll(allChecked);
            
            return updatedItems;
        });
    };

    // X 버튼 클릭 시 처리
    function deleteItemHandler(itemId) {
        axiosInstance.delete('/store/cart', { data: [itemId] })
        .then(() => {
            // 삭제 후 로컬 state 업데이트
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        })
        .catch((error) => {
            console.error("상품 삭제 중 오류 발생 : ", error);
        })
    }

    // 수량 조절
    function countHandler(itemId, operation) {
        axiosInstance.put(`/store/cart/count/${itemId}/${operation}`)
        .then((response) => {
            // 요청 성공 시, 로컬 상태 업데이트 (예시: cartItems state 업데이트)
            setCartItems((prevItems) => prevItems.map((item) => 
                item.id === itemId ? { 
                    ...item,
                    count: operation === 'increment' ? item.count + 1 : item.count > 1 ? item.count - 1 : 1, // 최소 1개 이하로 내려가지 않도록 처리
                } : item
            ));
        })
        .catch((error) => {
            console.error("수량 업데이트 실패 : ", error);
        })
    }

    // 주문하기 버튼 클릭 핸들러
    const orderHandler = () => {
        // 체크박스가 활성화된 항목들만 필터링
        const selectedItems = cartItems.filter(item => item.isCheck);
        
        if (selectedItems.length === 0) {
            toast.error("선택된 상품이 없습니다.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        // 선택된 항목에서 필요한 속성만 추출
        const orderItems = selectedItems.map(item => ({
            productId: item.productId,
            productName: item.productName,
            count: item.count,
            productPrice: item.productPrice,
            discountPrice: item.discountPrice ?? item.productPrice // ?? : 널 병합 연산자, null 또는 undefined인 경우에만 오른쪽 값을 반환하는 연산자
        }));
        console.log('orderItems : ', orderItems);

        // OrderDetail.jsx 컴포넌트로 state를 함께 전달
        navigate(routeConfig.paths.orderDetail, { state: { orderItems } });
    };

    if (loading) {
        return <div>장바구니 로딩 중...</div>
    }

    return (
        <div className="cart-container">
            <ToastContainer />
            {cartItems.length === 0 ? (
                <p>장바구니가 비어있습니다.</p>
            ) : (
                <>
                    <div className='cart-store-info'>
                        <img src={`${STORE_IMAGE_PATH}/${cartItems[0]?.storeImage}`} alt="이미지" className='store-img' />
                        <span className='cart-store-name'>{cartItems[0]?.storePlaceName}</span>
                    </div>

                    <div className="check-actions">
                        {/* 전체 선택 체크박스 */}
                        <div className="check-all-div">
                            <input type="checkbox" className="check-all-checkbox" checked={checkAll} onChange={checkAllHandler} />
                            전체 선택
                        </div>

                        {/* 선택 삭제 버튼 */}
                        <button className="delete-checked-button" onClick={deleteCheckedHandler}>선택 삭제</button>
                    </div>

                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                {/* 상품 정보 */}
                                <div className="product-info">
                                    <div className='product-name-price'>
                                        <span className='productName'>{item.productName}</span>
                                        <button className='cart-delete-button' onClick={() => deleteItemHandler(item.id)}>X</button>
                                    </div>

                                    <div className="middle-row">
                                        {/* 체크 박스 */}
                                        <input type="checkbox" className="cart-checkbox" checked={item.isCheck} onChange={() => checkHandler(item.id)} />
                                        <img src={`${INGREDIENT_IMAGE_PATH}/${item.productImage.split('_')[1]}`} alt={item.productName} className='cart-product-image'/>
                                        <div className='name-price'>
                                            <span className='product-name'>{item.productName}</span><br />
                                            {/* 할인율 */}
                                            {item.discountPrice != null && item.productPrice && item.discountPrice && (
                                                <span className="cart-discount-rate">
                                                    {Math.round(((item.productPrice - item.discountPrice) / item.productPrice) * 100)}%
                                                </span>
                                            )}
                                            <span>
                                                {item.discountPrice ? (
                                                    <>
                                                        <span className='cart-discount-price'>{item.discountPrice.toLocaleString()}원</span>
                                                        <s className='cart-product-price'>{item.productPrice.toLocaleString()}원</s>
                                                    </>
                                                ) : (
                                                    <span>
                                                        {item.productPrice.toLocaleString()}원
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <span className='discountPrice'>
                                            {item.discountPrice ? (
                                                <>
                                                    <span>{(item.discountPrice * item.count).toLocaleString()}원</span>
                                                </>
                                            ) : (
                                                <span>{(item.productPrice * item.count).toLocaleString()}원</span>
                                            )}
                                        </span>
                                    </div>

                                    <div className='quantity-container'>
                                        <div className="cart-quantity">
                                            <button className="quantity-button" onClick={() => countHandler(item.id, 'decrement')}>-</button>
                                            <span className="quantity-value">{item.count}</span>
                                            <button className="quantity-button" onClick={() => countHandler(item.id, 'increment')}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className='order-button' onClick={orderHandler}>주문하기</button>
                </>
            )}
        </div>
    );
}

export default Cart;