import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "api/axios";
import RouteConfig from "routes/routeConfig";

const OrderComplete = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const processOrder = async () => {
            try {
                const code = searchParams.get("code");
                console.log("code:", code);

                if (code && code.includes("FAILURE_TYPE")) {
                    sessionStorage.setItem("isPaymentProcessed", "false");
                    console.log("잘못된 요청");
                    setTimeout(() => navigate(RouteConfig.paths.cart), 10000);
                    return;
                }

                const isPaymentProcessed = sessionStorage.getItem("isPaymentProcessed") === "true";
                console.log("isPaymentProcessed:", isPaymentProcessed);

                if (isPaymentProcessed) {
                    console.log("이미 결제 요청이 처리됨. 성공 페이지로 이동합니다.");
                    setTimeout(() => navigate(RouteConfig.paths.orderSuccess), 10000);
                    return;
                }

                const isNaengPayCharge = sessionStorage.getItem("isNaengPayCharge") === "true";
                console.log("isNaengPayCharge:", isNaengPayCharge);
                
                const ordersDTO = JSON.parse(sessionStorage.getItem("ordersDTO"));
                const orderDetailDTOList = JSON.parse(sessionStorage.getItem("orderDetailDTOList"));
                
                if (!ordersDTO || !orderDetailDTOList) {
                    console.error("주문 데이터가 유실되었습니다.");
                    setTimeout(() => navigate(RouteConfig.paths.home), 10000);
                    return;
                }
                
                // isNaengPayCharge가 true이면 추가 결제 과정 수행
                if (isNaengPayCharge) {
                    const chargeAmount = sessionStorage.getItem("chargeAmount"); // 충전금액
                    const finalPrice = sessionStorage.getItem("finalPrice"); // 결제금액

                    console.log("chargeAmount:"+chargeAmount+",finalPrice:"+finalPrice);

                    // 1. 냉털잇페이 충전 API 호출
                    const chargeResponse = await axiosInstance.post("/pay/naengpay/charge", { 
                        // memberId: 3,
                        balance: chargeAmount
                     });

                    console.log(chargeResponse);
                    console.log("냉털잇페이 충전 완료!");

                    // 2. 냉털잇페이 결제 API 호출
                    const payResponse = await axiosInstance.post("/pay/naengpay", finalPrice);
                    console.log(payResponse.data);
                    console.log("냉털잇페이 결제 완료!");
                }

                // 주문 결제 요청
                console.log("주문 결제 요청 시작");
                const response = await axiosInstance.post("/orders/payment", { ordersDTO, orderDetailDTOList });

                console.log("결제 완료! 주문이 접수되었습니다.");
                sessionStorage.setItem("isPaymentProcessed", "true");
                sessionStorage.setItem("responseDtos", JSON.stringify(response.data));

                setTimeout(() => navigate(RouteConfig.paths.orderSuccess), 10000);

            } catch (error) {
                console.error("주문 처리 중 오류 발생:", error.message);
                setTimeout(() => navigate(RouteConfig.paths.home), 10000);
            }
        };

        processOrder();
    }, []);

    return <div>주문을 처리 중입니다...</div>;
};

export default OrderComplete;
