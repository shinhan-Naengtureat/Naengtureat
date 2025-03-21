import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteConfig from 'routes/routeConfig';
import "styles/store/OrderSuccess.css";

function OrderSuccess() {
    const navigate = useNavigate();
    const [storeName, setStoreName] = useState(""); // 상점 이름
    const [orderDate, setOrderDate] = useState(""); // 주문 일시
    const [totalPrice, setTotalPrice] = useState(0); // 총 금액
    const [pointPay, setPointPay] = useState(0); // 포인트 사용액
    const [finalPrice, setFinalPrice] = useState(0); // 결제 금액
    const [orderItems, setOrderItems] = useState([]); // 상품정보
    const [recipient, setRecipient] = useState(""); // 수령인
    const [phone, setPhone] = useState(""); // 휴대폰
    const [address, setAddress] = useState(""); // 주소

    useEffect(() => {
        const storedData = sessionStorage.getItem("responseDtos");

        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                
                if (parsedData.length > 0) {
                    const firstOrder = parsedData[0];

                    // 주문 기본 정보
                    setStoreName(firstOrder.storePlaceName || "");
                    setOrderDate(firstOrder.ordersPaymentDate || "");

                    // 주문 상품 목록
                    setOrderItems(parsedData);
                    setPointPay(firstOrder.ordersPointPay || 0);

                    // 총 결제 금액 계산 (ordersDetailPrice 합계)
                    const calculatedTotalPrice = parsedData.reduce((sum, item) => {
                        return sum + (item.ordersDetailPrice * item.ordersDetailCount || 0);
                    }, 0);
                    setTotalPrice(calculatedTotalPrice);
                    setFinalPrice(calculatedTotalPrice - (firstOrder.ordersPointPay || 0));

                    // 배송 정보
                    setRecipient(firstOrder.memberName || "");
                    setPhone(firstOrder.memberPhone || "");
                    setAddress(firstOrder.memberRoadAddressName || "");
                }
            } catch (error) {
                console.error("JSON 파싱 오류:", error);
            }
        }

        // 주문 완료 후 sessionStorage 정리
        sessionStorage.removeItem("ordersDTO");
        sessionStorage.removeItem("orderDetailDTOList");

    }, []);

    const nextButtonHandler = () => {
        // 주문 완료 후 sessionStorage 정리
        navigate(RouteConfig.paths.home); // 메인으로 이동
        sessionStorage.removeItem("isPaymentProcessed");
        sessionStorage.removeItem("responseDtos");
        sessionStorage.removeItem("finalPrice");
    }

    return (
        <div className="order-success">
            <div>
                <h3 className="text-center">결제완료</h3>
            </div>

            <div>
                <h4 className="order-success-title">주문 상세</h4>

            </div>

            <hr />
            {/* 가게 정보 */}
            <div className="store-info">
                <h4 className="order-success-title">{storeName}</h4>
                <p>주문일시: {orderDate}</p>
            </div>

            <hr />

            {/* 상품 정보 */}
            <div className="order-items">
                <h4 className="order-success-title">상품 정보</h4>
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>상품명</th>
                            <th>수량</th>
                            <th>금액</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.productName || "상품 없음"}</td>
                                <td>{item.ordersDetailCount || 0}</td>
                                <td>{item.ordersDetailPrice ? item.ordersDetailPrice.toLocaleString() : "0"}원</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <table className="order-table">
                    <tbody>
                        <tr>
                            <td className="order-success-price">결제 금액</td>
                            <td className="order-success-price">{orderItems.length}</td>
                            <td className="order-success-price">{finalPrice ? finalPrice.toLocaleString() : "0"}원</td>
                        </tr>
                        <tr>
                            <td className='text-sm'>총 금액</td>
                            <td></td>
                            <td>{totalPrice ? totalPrice.toLocaleString() : "0"}원</td>
                        </tr>
                        <tr>
                            <td>할인금액</td>
                            <td></td>
                            <td>-{pointPay ? pointPay.toLocaleString() : "0"}원</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <hr />
            <div className="delivery-info">
                <h4 className="order-success-title">배송 정보</h4>
                <table className="order-delivery-table">
                    <tbody>
                        <tr>
                            <td>수령인</td>
                            <td>{recipient || "정보 없음"}</td>
                        </tr>
                        <tr>
                            <td>휴대폰</td>
                            <td>{phone || "정보 없음"}</td>
                        </tr>
                        <tr>
                            <td>주소</td>
                            <td>{address || "정보 없음"}</td>
                        </tr>
                    </tbody>
                </table>
                <button className="okay-button" onClick={nextButtonHandler}>
                    확인
                </button>
            </div>
        </div>
    );
}

export default OrderSuccess;
