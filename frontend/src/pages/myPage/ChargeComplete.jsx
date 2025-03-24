import axiosInstance from 'api/axios';
import { GIF_IMAGE_PATH } from 'config/pathConfig';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RouteConfig from 'routes/routeConfig';
import 'styles/mypage/ChargeComplete.css';

function ChargeComplete(props) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const processCharge = async () => {
            try {
                const code = searchParams.get("code");
                console.log("code:", code);

                if (code && code.includes("FAILURE_TYPE")) {
                    sessionStorage.setItem("isChargeProcessed", "false");
                    console.log("잘못된 요청");
                    setTimeout(() => navigate(RouteConfig.paths.home), 10000);
                    return;
                }

                const isChargeProcessed = sessionStorage.getItem("isChargeProcessed") === "true";
                console.log("isChargeProcessed:", isChargeProcessed);

                if (isChargeProcessed) {
                    console.log("이미 페이 충전 요청이 처리됨. 성공 페이지로 이동합니다.");
                    setTimeout(() => navigate(RouteConfig.paths.chargeSuccess), 10000);
                    return;
                }

                // 페이 충전 요청
                console.log("페이 충전 요청 시작");
                const chargeAmount = sessionStorage.getItem("chargeAmount");

                const response = await axiosInstance.post("/pay/naengpay/charge", {
                    balance: chargeAmount 
                });

                if (response.data?.status !== "PAID") {
                    throw new Error("서버 업데이트 실패");
                }

                // MoneyAnimation을 3초 동안 표시(아직 안되는 애니메이션)
                /*
                setShowAnimation(true);
                setTimeout(() => {
                    setShowAnimation(false);
                }, 3000);
                */

                console.log(response);
                console.log("결제 완료! 페이잔액이 충전되었습니다.");
                sessionStorage.setItem("isChargeProcessed", "true");

                setTimeout(() => navigate(RouteConfig.paths.chargeSuccess), 10000);

            } catch (error) {
                console.error("페이 충전 처리 중 오류 발생:", error.message);
                setTimeout(() => navigate(RouteConfig.paths.home), 10000);
            }
        };

        processCharge();
    },[]);

    return (
        <div className='charge-inprogress'>
            <img src={`${GIF_IMAGE_PATH}/ChargeInProgress.gif`} alt="ChargeInProgress" />
            페이 잔액 충전 중
        </div>
    );
}

export default ChargeComplete;