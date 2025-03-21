import PortOne from '@portone/browser-sdk/v2';
import axiosInstance from 'api/axios';
import RouteConfig from 'routes/routeConfig';
import { FRONT_API_PATH } from 'config/pathConfig';
import { useEffect, useMemo, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { PiMapPinLight } from "react-icons/pi";
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "styles/store/OrderDetail.css";

function OrderDetail() {
    const location = useLocation();
    const orderItems = location.state?.orderItems || [];

    // orderItems의 각 항목에서 필요한 속성만 추출하여 cartItems 배열로 구성
    const cartItems = orderItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        count: item.count,
        productPrice: item.productPrice,
        discountPrice: item.discountPrice,
    }));

    const [paymentMethod, setPaymentMethod] = useState("pay"); // 기본값을 "pay"로 설정
    const [memberInfo, setMemberInfo] = useState({
        roadAddressName: "주소 없음",
        detailAddress: "",
        phone: "연락처 없음",
        point: 0,
        balance: 0
    });
    const [isPointInputOpen, setIsPointInputOpen] = useState(false);
    const [usePoint, setUsePoint] = useState("");
    const [discount, setDiscount] = useState(0); // 할인 금액
    const [paymentStatus, setPaymentStatus] = useState({
        status: "IDLE",
    });
    
    // 상품명에서 _ 뒤 문구만 추출하는 함수
    const extractName = (fullName) => fullName.split("_").pop();

    // 결제 수단에 따라 총 금액을 계산
    const totalPrice = useMemo(() => {
        return cartItems.reduce((sum, item) => 
            sum + (paymentMethod === "pay" ? item.discountPrice * item.count : item.productPrice * item.count), 0
        );
    }, [paymentMethod]);

    const [finalPrice, setFinalPrice] = useState(totalPrice); // 결제금액

    // 고객 정보, 페이정보 받아오기
    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                // `/pay`와 `/member/detail`을 동시에 요청
                const [payResponse, memberResponse] = await Promise.all([
                    axiosInstance.get("/pay"),
                    axiosInstance.get("/member/detail")
                ]);
    
                // 응답 데이터를 합쳐서 상태 업데이트
                setMemberInfo({
                    ...memberResponse.data,
                    balance: payResponse.data.balance || 0
                });
            } catch (error) {
                console.error("회원 정보 불러오기 실패:", error);
            }
        };
    
        fetchMemberInfo();
    }, []);

    // 결제 수단 변경 시 결제 금액 재계산
    useEffect(() => {
        setFinalPrice(totalPrice - discount);
    }, [totalPrice, discount]);

    // 포인트 적용
    const applyPoint = () => {
        let pointToUse = parseInt(usePoint, 10) || 0;

        if (pointToUse <= 0) {
            toast.warn("사용할 포인트를 입력해주세요.");
            return;
        }

        if (pointToUse > memberInfo.point) {
            toast.warn("보유 포인트보다 많이 사용할 수 없습니다.");
            return;
        }
        if (pointToUse > totalPrice) {
            toast.warn("결제 금액보다 많은 포인트를 사용할 수 없습니다.");
            return;
        }

        setDiscount(pointToUse); // 사용 포인트
        setFinalPrice(totalPrice - pointToUse); // 최종 결제 금액 업데이트
    };

    function randomId() {
        return [...crypto.getRandomValues(new Uint32Array(2))]
            .map((word) => word.toString(16).padStart(8, "0"))
            .join("");
    }

    // 결제 버튼 클릭시 처리
    const handleOrder = async () => {
        const firstItem = cartItems[0]; 
        const itemCount = cartItems.length;

        // 상품명 추출 및 변환
        const itemName = itemCount === 1
            ? extractName(firstItem.productName)
            : `${extractName(firstItem.productName)} 외 ${itemCount - 1}종`;
    
        const paymentId = randomId();

        // 주문 정보 저장
        // ordersDTO 구성
        const ordersDTO = {
            method: paymentMethod === "pay" ? "냉페" : "카드",
            pointPay: discount
        };

        // orderDetailDTOList 구성
        const orderDetailDTOList = cartItems.map(item => ({
            productId: item.productId,
            price: paymentMethod === "pay" ? item.discountPrice : item.productPrice,
            count: item.count
        }));

        sessionStorage.setItem("ordersDTO", JSON.stringify(ordersDTO));
        sessionStorage.setItem("orderDetailDTOList", JSON.stringify(orderDetailDTOList));

        const redirectUrl = `${FRONT_API_PATH}`+RouteConfig.paths.orderComplete;
        const failRedirectUrl = redirectUrl;

        const storeId = process.env.REACT_APP_PORTONE_STORE_ID;
        const channelKey = process.env.REACT_APP_PORTONE_CHANNEL_KEY;

        if(paymentMethod === "pay") {
            if(memberInfo.balance - finalPrice > 0){
                // 냉털잇페이 결제 로직
                try {
                    // 결제 처리 API 호출
                    const response = await axiosInstance.post('/pay/naengpay', parseInt(finalPrice, 10));

                    console.log(response);
                    
                    if (response.data.message.includes("완료")) {
                        // 결제 완료 후 리디렉션
                        window.location.href = redirectUrl;
                    } else {
                        console.error("결제 실패: " + response.data.message);
                    }
                } catch (error) {
                    console.error("결제 실패: " + error.message);
                }
            } else {
                console.log("페이잔액:"+memberInfo.balance+", 결제금액:"+finalPrice);

                const neededAmount = finalPrice - memberInfo.balance;
                const chargeAmount = Math.ceil(neededAmount / 10000) * 10000; // 만원 단위 올림
                console.log("부족금액:"+neededAmount+", 충전금액:"+chargeAmount);

                sessionStorage.setItem("isNaengPayCharge", "true");
                sessionStorage.setItem("finalPrice", parseInt(finalPrice, 10));
                sessionStorage.setItem("chargeAmount", parseInt(chargeAmount, 10));

                const payment = await PortOne.requestPayment({
                    storeId,
                    channelKey,
                    paymentId,
                    orderName: "페이 충전",
                    totalAmount: chargeAmount,
                    currency: "KRW",
                    payMethod: "CARD",
                    redirectUrl,
                    failRedirectUrl,
                    isMobile: false
                });
            
                if (payment.code !== undefined) {
                    setPaymentStatus({
                        status: "FAILED",
                        message: payment.message,
                    });
                    toast.error("결제 실패: " + payment.message);
                    return;
                }
            }
        } else {
            const payment = await PortOne.requestPayment({
                storeId,
                channelKey,
                paymentId,
                orderName: itemName,
                totalAmount: finalPrice,
                currency: "KRW",
                payMethod: "CARD",
                redirectUrl,
                failRedirectUrl,
                isMobile: false
            });
        
            if (payment.code !== undefined) {
                setPaymentStatus({
                    status: "FAILED",
                    message: payment.message,
                });
                toast.error("결제 실패: " + payment.message);
                return;
            }
        }
    };
    

    return (
        <div className="order-container">
            {/* 배송 주소 */}
            <div className="order-section">
                <h4 className="section-title">배송주소</h4>
                <p className="bold">
                    <PiMapPinLight style={{ fontSize: "20px" }} />
                    {memberInfo.roadAddressName}
                </p>
                <p>{memberInfo.detailAddress}</p>
            </div>

            {/* 연락처 */}
            <div className="order-section">
                <h4 className="section-title">내 연락처</h4>
                <p>{memberInfo.phone}</p>
            </div>

            {/* 결제 수단 */}
            <div className="order-section">
                <h4 className="section-title">결제수단</h4>
                <label className="payment-option">
                    <input type="radio" name="payment" value="pay" onChange={() => setPaymentMethod("pay")} checked={paymentMethod === "pay"} />
                    <span>냉털잇페이</span>
                    <div className="payment-right">{memberInfo.balance.toLocaleString()}원 보유</div>
                </label>
                {paymentMethod === "pay" && (
                    <div className='pay-info'>
                        냉털잇페이로 결제시에만 할인가 적용 <br/> 총 결제 금액의 1% 포인트로 적립
                    </div>
                )}
                <label className="payment-option">
                    <input type="radio" name="payment" value="card" onChange={() => setPaymentMethod("card")} checked={paymentMethod === "card"} />
                    <span>기타 신용/체크카드</span>
                </label>
            </div>

            {/* 포인트 */}
            <div className="order-section">
                <div className="flex-between" onClick={() => setIsPointInputOpen(!isPointInputOpen)} style={{ cursor: "pointer" }}>
                    <h4 className="section-title">포인트</h4>
                    <span className="bold amount">{memberInfo.point.toLocaleString()}원 보유 <IoIosArrowDown /></span>
                </div>
                {isPointInputOpen && (
                    <div className="point-input-container flex-between">
                        <input
                            type="number"
                            className="point-input"
                            placeholder="사용할 포인트 입력"
                            value={usePoint}
                            onChange={(e) => setUsePoint(e.target.value)}
                        />
                        <button className="use-point-btn" onClick={applyPoint}>적용</button>
                    </div>
                )}
            </div>

            {/* 결제 금액 */}
            <div className="order-section">
                <div className="flex-between">
                    <h4 className="section-title">결제금액</h4>
                    <p className="final-price amount">{finalPrice.toLocaleString()}원</p>
                </div>
                <div className="flex-between">
                    <p>총 금액:</p>
                    <span className="bold amount">{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex-between">
                    <p>할인금액:</p>
                    <span className="discount amount">-{discount.toLocaleString()}원</span>
                </div>
            </div>
            
            {/* 결제 버튼 */}
            <button className="order-button" onClick={handleOrder}>
                결제하기
            </button>

            {/* Toast 표시 */}
            <ToastContainer />
        </div>
    );
}

export default OrderDetail;