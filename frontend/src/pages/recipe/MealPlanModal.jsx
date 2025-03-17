// MealPlanModal.jsx
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "api/axios";
import { API_PATH } from "config/pathConfig";

function MealPlanModal({ 
  show, 
  onHide, 
  selectedDate, 
  setSelectedDate, 
  selectedMealType, 
  setSelectedMealType, 
  handleSaveMealPlan 
}) {
  // 확인 모달 상태
  const [showConfirm, setShowConfirm] = useState(false);
  // 기존 식단 데이터 (확인을 위해 받아온 데이터; 필요시 로그 확인용)
  const [existingMealPlans, setExistingMealPlans] = useState([]);

  // 오늘 포함, 이번 주 일요일까지 선택 가능하도록 계산
  const today = new Date();
  const weekEnd = new Date(today);
  if (today.getDay() !== 0) {
    weekEnd.setDate(today.getDate() + (7 - today.getDay()));
  }
  const minDate = today.toISOString().split("T")[0];
  const maxDate = weekEnd.toISOString().split("T")[0];

  // 날짜 형식 변환: "YYYY-MM-DD" → "YYYYMMDD"
  const formatDateForAPI = (dateStr) => {
    return dateStr.replace(/-/g, "");
  };

  // 사용자가 모달 내에서 "저장" 버튼을 누르면, 먼저 해당 날짜의 식단 데이터를 조회
  const handleInitialSave = () => {
    const formattedDate = formatDateForAPI(selectedDate);
    axiosInstance.get(`${API_PATH}/mealplan/daily/${formattedDate}`)
      .then((response) => {
        const plans = response.data; // 식단 DTO 배열
        // 선택한 식단 유형과 같은 데이터가 있는지 필터링
        const existing = plans.filter(plan => plan.type === selectedMealType);
        if (existing.length > 0) {
          // 기존 식단이 있으면 확인 모달을 띄움
          setExistingMealPlans(existing);
          setShowConfirm(true);
        } else {
          // 없으면 바로 저장 API 호출
          handleSaveMealPlan();
        }
      })
      .catch((error) => {
        console.error("일간 식단 조회 에러:", error);
        // 에러 발생 시에도 저장을 진행하거나, 에러 메시지를 띄울 수 있음
        handleSaveMealPlan();
      });
  };

  // 확인 모달에서 "저장" 버튼을 누르면 기존 식단 삭제 후 저장 API 호출
  const handleConfirmSave = () => {
    setShowConfirm(false);
    // 기존 식단 삭제 후 저장 로직은 handleSaveMealPlan에 포함되어 있다고 가정
    handleSaveMealPlan();
  };

  // 확인 모달에서 "취소" 버튼을 누르면 확인 모달 닫기
  const handleConfirmCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered className="mealplan-modal">
        <Modal.Header closeButton>
          <Modal.Title>내 식단에 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-row">
            <label>추가할 날짜</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDate}
              max={maxDate}
            />
          </div>
          <div className="modal-row">
            <label>식단 유형</label>
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
            >
              <option value="아침">아침</option>
              <option value="점심">점심</option>
              <option value="저녁">저녁</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>취소</Button>
          <Button 
           variant="primary" 
           onClick={handleInitialSave}
           style={{ backgroundColor: "#ff7f50", borderColor: "#ff7f50" }}
           >
          저장
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 확인 모달 */}
      <Modal show={showConfirm} onHide={handleConfirmCancel} centered className="confirm-modal">
        <Modal.Body>
          <p style={{color : "red"}}>현재 선택한 날짜에 기존식단이 존재합니다.</p>
          <p>
            기존식단을 삭제하고 추가하시려면 <strong style={{ color: "#ff7f50" }}>저장</strong>을, 다른 날짜를 선택하려면 <strong>취소</strong>를 눌러주세요.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmCancel}>취소</Button>
          <Button 
           variant="primary" 
           onClick={handleConfirmSave}
           style={{ backgroundColor: "#ff7f50", borderColor: "#ff7f50" }}
           >
          저장
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MealPlanModal;
