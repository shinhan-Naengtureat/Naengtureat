import React, { useState, useEffect } from "react";
import PortOne from "@portone/browser-sdk/v2";
import axiosInstance from "api/axios";
import { FRONT_API_PATH } from "config/pathConfig";
import RouteConfig from "routes/routeConfig";
import { toast, ToastContainer } from "react-toastify";
// import MoneyAnimation from "../../animations/MoneyAnimation"; // 애니메이션 추가(현재 파일 없음)
// import animationData from "./moneyAnimation.json"; // 애니메이션 추가(현재 파일 없음)

function InstantCharge() {
  const [chargeAmount, setChargeAmount] = useState(0); // 충전할 금액
  const [activeTab, setActiveTab] = useState("money");
  // const [showAnimation, setShowAnimation] = useState(false);
  const quickAmounts = [10000, 30000, 50000, 100000, 300000]; // 퀵 충전금액 버튼
  const [payInfo, setPayInfo] = useState({ // 사용자 Pay 정보
    balance: 0,
    point: 0
  });

  // 로그인한 유저의 Pay 정보 가져오기
  useEffect(() => {
    const fetchMemberInfo = async () => {
        try {
            // `/pay`와 `/member/detail`을 동시에 요청
            const [payResponse, memberResponse] = await Promise.all([
                axiosInstance.get("/pay"),
                axiosInstance.get("/member/detail")
            ]);

            // 응답 데이터를 합쳐서 상태 업데이트
            setPayInfo({
              balance: payResponse.data.balance || 0,
              point: memberResponse.data.point,
            });
        } catch (error) {
            console.error("회원 정보 불러오기 실패:", error);
        }
    };

    fetchMemberInfo();
    sessionStorage.removeItem("chargeAmount");
    sessionStorage.removeItem("isChargeProcessed");
  }, []);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // 빠른 충전 버튼 클릭
  const handleQuickCharge = (amount) => {
    setChargeAmount((prev) => prev + amount);
  };
  
  // 충전 금액 입력 핸들러
  const handleChange = (e) => {
    setChargeAmount(parseInt(e.target.value, 10)); // 올바른 경우 상태 업데이트
  };
  
  // 고유 결제 식별자 생성 함수
  const randomId = () => {
    return [...crypto.getRandomValues(new Uint32Array(2))]
    .map((word) => word.toString(16).padStart(8, "0"))
    .join("");
  };
  
  // 결제 및 충전 요청 처리
  const handleCharge = async () => {
    if (!payInfo) {
      toast.error("사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도하세요.");
      return;
    }
    
    if (chargeAmount <= 0) {
      toast.error("충전 금액을 입력해주세요!");
      return;
    }

    // 입력값이 10,000원 단위인지 확인
    if (chargeAmount % 10000 !== 0) {
      toast.error("10,000원 단위로 입력해 주세요!"); // 잘못된 입력 경고
      return;
    }
    
    try {
      const paymentId = randomId();
      
      const redirectUrl = `${FRONT_API_PATH}`+RouteConfig.paths.chargeComplete;
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
        isMobile: false
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
      {/* 최상단에 style 태그를 배치하여 .home-container 스타일을 우선 적용 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .home-container {
              width: 100% !important;
              padding: 30px 0 !important;
              margin-top: 0 !important;
              margin-bottom: 0 !important;
              max-width: none !important;
            }
          `,
        }}
      />
      <div className="home-container">
        {/* 탭 영역 */}
        <div style={styles.tabContainer}>
          <div
            style={{
              ...styles.tabItem,
              backgroundColor: activeTab === "money" ? "#fff" : "#f2f2f2",
              fontWeight: activeTab === "money" ? "bold" : "normal",
              border:
                activeTab === "money"
                  ? "2px solid #ff7f0f"
                  : "2px solid transparent",
            }}
            onClick={() => handleTabChange("money")}
          >
            페이
          </div>
          <div
            style={{
              ...styles.tabItem,
              backgroundColor: activeTab === "point" ? "#fff" : "#f2f2f2",
              fontWeight: activeTab === "point" ? "bold" : "normal",
              border:
                activeTab === "point"
                  ? "2px solid #ff7f0f"
                  : "2px solid transparent",
            }}
            onClick={() => handleTabChange("point")}
          >
            포인트
          </div>
        </div>

        {/* 잔액 정보 */}
        {payInfo && (
          <div style={styles.moneyWrap}>
            <div style={styles.moneyLabel}>
              {activeTab === "money" ? "냉털잇 페이 머니" : "포인트"}
            </div>
            <div style={styles.moneyBalance}>
              {activeTab === "money"
                ? `${payInfo?.balance?.toLocaleString() || "0"}원`
                : `${payInfo?.point?.toLocaleString() || "0"}P`}
            </div>
            {activeTab === "money" && (
              <div style={styles.buttonContainer}>
                <button style={styles.immediateChargeButton}>
                  즉시충전
                </button>
                <button style={styles.regularChargeButton}>
                  정기결제
                </button>
              </div>
            )}
          </div>
        )}

        {/* 충전 입력 */}
        <div style={styles.container}>
          <div style={styles.amountWrap}>
            <span style={styles.label}>충전금액</span>
            <input
              type="number"
              value={chargeAmount}
              onChange={handleChange}
              style={styles.input}
              // placeholder="0"
              step="10000"
            />
            <span style={{ marginLeft: 8 }}>원</span>
          </div>

          <div style={styles.quickButtonContainer}>
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuickCharge(amt)}
                style={styles.quickButton}
              >
                {`+${amt / 10000}만원`}
              </button>
            ))}
          </div>

          <div style={styles.footer}>
            <div style={styles.notice}>
              <ul>
                <li>충전 결제수단 연동은 '카드결제'만 가능합니다.</li>
                <li>1만원 단위로 충전이 가능합니다.</li>
              </ul>
            </div>
            <button style={styles.chargeButton} onClick={handleCharge}>
              충전하기
            </button>
          </div>
        </div>
      </div>
      {/* {showAnimation && <MoneyAnimation />} */}
      <ToastContainer />
    </>
  );
}

const styles = {
  tabContainer: {
    display: "flex",
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "4px 4px 0 0",
    overflow: "hidden",
  },
  tabItem: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    padding: "12px 0",
    cursor: "pointer",
  },
  moneyWrap: {
    width: "100%",
    height: "190px",
    background: "linear-gradient(233deg, rgb(255 147 82), rgb(255 163 48))",
    color: "#fff",
    padding: 20,
    marginBottom: 75,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  moneyLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: "10px",
  },
  moneyBalance: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "16px",
  },
  buttonContainer: {
    display: "flex",
    //marginTop: 16,
    justifyContent: "center",
  },
  immediateChargeButton: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#f76300",
    padding: "6px 20px",
    border: "none",
    borderRadius: "8px 0 0 8px",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: "bold",
    width: "160px",
    height: "47px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  regularChargeButton: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#f76300",
    padding: "6px 20px",
    border: "none",
    borderLeft: "2px solid rgba(164,107,107,0.66)",
    borderRadius: "0 8px 8px 0",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: "bold",
    width: "160px",
    height: "47px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  container: {
    width: 320,
    margin: "0 auto",
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  amountWrap: {
    display: "flex",
    height: 150,
    alignItems: "center",
    background: "linear-gradient(233deg, rgb(255 147 82), rgb(255 163 48))",
    color: "#fff",
    borderRadius: "12px",
    padding: "35px",
    marginBottom: "10px",
    boxShadow: "0 4px 8px rgba(197, 169, 169, 0.2)",
    flexWrap: "wrap",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    width: 100,
    height: 40,
    padding: "0 10px",
    fontSize: 14,
    border: "1px solid #ddd",
    borderRadius: 4,
    outline: "none",
    marginLeft: 25,
  },
  infoText: {
    fontSize: 13,
    color: "#fff",
    textAlign: "right",
    marginTop: 30,
    flexBasis: "100%",
  },
  quickButtonContainer: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  quickButton: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    border: "1px solid #ddd",
    borderRadius: 10,
    height: 36,
    fontSize: 11,
    cursor: "pointer",
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  notice: {
    fontSize: 12,
    color: "#666",
    lineHeight: 1.4,
    textAlign: "initial"
  },
  chargeButton: {
    width: "100%",
    height: 44,
    backgroundColor: "#ff7f0f",
    color: "#fff",
    fontSize: 16,
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};

export default InstantCharge;
