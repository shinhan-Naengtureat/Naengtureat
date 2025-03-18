import React, { useState } from "react";

function InstantCharge() {
  // 예시용 사용자 정보
  const userName = "홍길동";
  const userLoginId = "hong123";
  const payBalance = "7,377원"; // 실제 잔액 예시
  const points = "1,000P";     // 실제 포인트 예시

  const [chargeAmount, setChargeAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("money"); 

  const quickAmounts = [10000, 30000, 50000, 100000, 300000];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleQuickCharge = (amount) => {
    setChargeAmount((prev) => prev + amount);
  };

  const handleChange = (e) => {
    setChargeAmount(parseInt(e.target.value, 10) || 0);
  };

  const handleCharge = () => {
    if (chargeAmount > 0) {
      alert(`${chargeAmount.toLocaleString()}원 충전 시도합니다!`);
      // 실제 충전 로직(서버 API 호출 등)을 여기에 추가하세요.
    } else {
      alert("충전 금액을 입력해주세요!");
    }
  };

  return (
    <>
      {/* 외부 CSS보다 우선 적용하도록 .home-container 오버라이드 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .home-container {
              width: 100% !important;
              padding: 30px 0 !important;
              max-width: none !important;
            }
          `,
        }}
      />
      <div className="home-container">
        {/* 커스텀 탭 영역 */}
        <div style={styles.tabContainer}>
  <div
    style={{
      ...styles.tabItem,
      backgroundColor: activeTab === "money" ? "#fff" : "#f2f2f2",
      fontWeight: activeTab === "money" ? "bold" : "normal",
      border: activeTab === "money" ? "2px solid #ff7f0f" : "2px solid transparent",
    }}
    onClick={() => handleTabChange("money")}
  >
    머니
  </div>
  <div
    style={{
      ...styles.tabItem,
      backgroundColor: activeTab === "point" ? "#fff" : "#f2f2f2",
      fontWeight: activeTab === "point" ? "bold" : "normal",
      border: activeTab === "point" ? "2px solid #ff7f0f" : "2px solid transparent",
    }}
    onClick={() => handleTabChange("point")}
  >
    포인트
  </div>
</div>


        {/* 탭 내용 영역 - 전체 가로 100% */}
        {activeTab === "money" && (
          <div style={styles.moneyWrap}>
            <div style={styles.moneyLabel}>냉털잇 페이 머니</div>
            <div style={styles.moneyBalance}>{payBalance}</div>
            <div style={styles.buttonContainer}>
      <button style={styles.immediateChargeButton}>즉시충전</button>
      <button style={styles.regularChargeButton}>정기결제</button>
    </div>

          </div>
        )}
        {activeTab === "point" && (
          <div style={styles.moneyWrap}>
            <div style={styles.moneyLabel}>포인트</div>
            <div style={styles.moneyBalance}>{points}</div>
          </div>
        )}

        

        {/* 아래쪽: 기존 충전금액 입력, 빠른 충전 버튼, 안내문구, 충전하기 버튼 */}
        <div style={styles.container}>
          <div style={styles.amountWrap}>
            <span style={styles.label}>충전금액</span>
            <input
              type="number"
              value={chargeAmount}
              onChange={handleChange}
              style={styles.input}
              placeholder="0"
              step="10000"
            />
            <span style={{ marginLeft: 8 }}>원</span>
            <div style={styles.infoText}> * 1만원 단위로 충전이 가능합니다.</div>
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
              • 즉시 충전 결제수단 연동은 '내 통장결제'만 가능합니다다.
              <br />
              • 포인트 월 한도는 월 10,000만 포인트 입니다.
            </div>
            <button style={styles.chargeButton} onClick={handleCharge}>
              충전하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}



const styles = {

  immediateChargeButton: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#f76300',
    padding: "8px 16px",  // 수직 패딩 줄이고 좌우 패딩 늘림
    border: "none",
    borderRadius: "8px 0 0 8px",  // 왼쪽 버튼: 왼쪽 모서리만 둥글게
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 'bold',
    width: '150px',
    height : '50px',
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  regularChargeButton: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#f76300',
    padding: "8px 16px",
    border: "none",
    borderLeft: "2.7px solid rgb(164 107 107 / 66%)", // 두 버튼 사이에 직선 구분선 추가
    borderRadius: "0 8px 8px 0",  // 오른쪽 버튼: 오른쪽 모서리만 둥글게
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 'bold',
    width: '150px',
    height : '50px',
     boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },


  // 탭 영역: 전체 너비를 사용하며 두 탭이 좌우로 균등 분할됨.
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
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
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
    //margin: 15,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    width : 100,
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
