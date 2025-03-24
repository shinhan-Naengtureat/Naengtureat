import React, { useState, useEffect } from "react";
import PortOne from "@portone/browser-sdk/v2";
import axiosInstance from "api/axios";
import { FRONT_API_PATH } from "config/pathConfig";
import RouteConfig from "routes/routeConfig";
import { toast, ToastContainer } from "react-toastify";
import "styles/mypage/InstantCharge.css";
import { PROFILE_IMAGE_PATH } from 'config/pathConfig';

function InstantCharge() {
  const [chargeAmount, setChargeAmount] = useState(0);
  const quickAmounts = [10000, 30000, 50000, 100000, 300000];
  const [payInfo, setPayInfo] = useState({
    name: "",
    balance: 0,
    userImageUrl: `${PROFILE_IMAGE_PATH}/`,
    point : 0
  });

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const [payResponse, memberResponse] = await Promise.all([
          axiosInstance.get("/pay"),
          axiosInstance.get("/member/detail"),
        ]);
        setPayInfo({
          name: memberResponse.data.name,
          balance: payResponse.data.balance || 0,
          userImageUrl: `${PROFILE_IMAGE_PATH}/` + memberResponse.data.image,
          point : memberResponse.data.point
        });
      } catch (error) {
        console.error("회원 정보 불러오기 실패:", error);
      }
    };

    fetchMemberInfo();
    sessionStorage.removeItem("chargeAmount");
    sessionStorage.removeItem("isChargeProcessed");
  }, []);

  const handleQuickCharge = (amount) => {
    setChargeAmount((prev) => prev + amount);
  };

  const handleChange = (e) => {
    setChargeAmount(parseInt(e.target.value, 10));
  };

  const randomId = () => {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, "0"))
      .join("");
  };

  const handleCharge = async () => {
    if (!payInfo) {
      toast.error("사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도하세요.");
      return;
    }

    if (chargeAmount <= 0) {
      toast.error("충전 금액을 입력해주세요!");
      return;
    }

    if (chargeAmount % 10000 !== 0) {
      toast.error("10,000원 단위로 입력해 주세요!");
      return;
    }

    try {
      const paymentId = randomId();
      const redirectUrl = `${FRONT_API_PATH}${RouteConfig.paths.chargeComplete}`;
      const failRedirectUrl = redirectUrl;

      const storeId = process.env.REACT_APP_PORTONE_STORE_ID;
      const channelKey = process.env.REACT_APP_PORTONE_CHANNEL_KEY;

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
        isMobile: false,
      });

      if (payment.code !== undefined) {
        toast.error("결제 실패: " + payment.message);
        return;
      }
    } catch (error) {
      console.error("충전 중 오류 발생", error);
      toast.error("충전 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
    <style
        dangerouslySetInnerHTML={{
          __html: `
            .home-container {
              width: 100% !important;
              padding : 55px 0px;
            }

          `,
        }}
      />
      <div className="instantcharge-home-container">

        {/* 사용자 정보 및 페이머니 표시 */}
        {payInfo && (
          <div className="instantcharge-money-wrap">
            <div className="mypage-header">
              <img
                src={payInfo.userImageUrl}
                alt="User"
                className="instantcharge-profile-img"
              />
              <div className="instantcharge-user-name">
                {payInfo.name} 님의 페이머니
                <span className="instantcharge-highlightUnderline"></span>
              </div>
            </div>

            <div className="instantcharge-money">
              <span className="instantcharge-money-balance">
                {payInfo?.balance?.toLocaleString() || "0"}원
              </span>
              <p className="instantcharge-point" style={{ fontFamily: "var(--font-nanum)" }}>
              {payInfo?.point?.toLocaleString() || "0"}P
              </p>
            </div>

            <div className="instantcharge-adver-bar"></div>
          </div>
        )}

        {/* 충전 입력 영역 */}
        <div className="instantcharge-container">
          <div className="instantcharge-amount-wrap">
            <span className="instantcharge-label">충전금액</span>
            <input
              type="number"
              value={chargeAmount}
              onChange={handleChange}
              className="instantcharge-input"
              step="10000"
            />
            <span style={{ marginLeft: 8 }}> 원</span>
          </div>

          <div className="instantcharge-quick-btn-container">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuickCharge(amt)}
                className="instantcharge-quick-btn"
              >
                {`+${amt / 10000}만원`}
              </button>
            ))}
          </div>

          <div className="instantcharge-footer">
            <div className="instantcharge-notice">
              <ul>
                <li>충전 결제수단 연동은 '카드결제'만 가능합니다.</li>
                <li>1만원 단위로 충전이 가능합니다.</li>
              </ul>
            </div>
            <button className="instantcharge-charge-btn" onClick={handleCharge}>
              충전하기
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default InstantCharge;
