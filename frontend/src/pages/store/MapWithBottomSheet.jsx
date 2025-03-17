import React, { useState, useRef } from "react";
import KakaoMap from "pages/store/KakaoMap";
import StoreList from "pages/store/StoreList";
import "styles/store/MapWithBottomSheet.css";

function MapWithBottomSheet({ setPlaces, places }) {
    // 뷰포트 높이의 30%를 기본값으로 사용
    const defaultSheetHeight = window.innerHeight * 0.3;
    // 초기 바텀 시트 높이 (픽셀 단위)
    const [sheetHeight, setSheetHeight] = useState(defaultSheetHeight);
    const sheetRef = useRef(null);
    const startYRef = useRef(0);         // 드래그 시작 시점의 y 좌표
    const startHeightRef = useRef(0);    // 드래그 시작 시점의 시트 높이
    const topNavHeight = 170; // 상단 네비게이션 바 높이(px)

    // 드래그 시작 이벤트 (마우스 또는 터치)
    const handleDragStart = (e) => {
        const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
        startYRef.current = clientY;
        startHeightRef.current = sheetHeight;

        // 드래그 이동 및 종료 이벤트 리스너 추가
        window.addEventListener("mousemove", handleDragMove);
        window.addEventListener("touchmove", handleDragMove, { passive: false });
        window.addEventListener("mouseup", handleDragEnd);
        window.addEventListener("touchend", handleDragEnd);
    };

    // 드래그 이동 이벤트
    const handleDragMove = (e) => {
        e.preventDefault(); // 터치 스크롤 방지
        const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
        const diff = startYRef.current - clientY;
        // 최소 높이를 100px로 제한하고, 최대 높이는 뷰포트 높이에서 상단 네비게이션 바 높이를 뺀 값으로 제한
        const maxHeight = window.innerHeight - topNavHeight;
        const newHeight = Math.min(maxHeight, Math.max(50, startHeightRef.current + diff));
        setSheetHeight(newHeight);
    };

    // 드래그 종료 이벤트
    const handleDragEnd = () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("touchmove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchend", handleDragEnd);
    };

    return (
        <div className="map-container">
            {/* 지도 컴포넌트. setPlaces를 통해 KakaoMap에서 검색 결과가 업데이트됩니다. */}
            <KakaoMap setPlaces={setPlaces} />
            
            {/* 바텀 시트 영역 */}
            <div className="store-bottom-sheet" style={{ height: `${sheetHeight}px` }} ref={sheetRef}>
                {/* 드래그 핸들 영역 */}
                <div className="drag-handle" onMouseDown={handleDragStart} onTouchStart={handleDragStart}>
                    <div className="handle-bar"></div>
                </div>

                {/* 실제 콘텐츠 영역 (StoreList) */}
                <div className="sheet-content">
                    <StoreList places={places} />
                </div>
            </div>
        </div>
    );
}

export default MapWithBottomSheet;