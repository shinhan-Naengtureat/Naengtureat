import React, { useState } from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import { Offcanvas, Button } from 'react-bootstrap';
import "styles/common/topNav.css";
import routeConfig from "routes/routeConfig";
import MyPage from 'pages/myPage/MyPage';

function getNavConfigForPath(pathname) {
  const navConfig = routeConfig.navConfig;
  // exact match 시도
  if (navConfig[pathname]) {
    return navConfig[pathname];
  }
  // exact match가 없으면 navConfig의 각 패턴을 순회하며 동적 경로인지 확인
  for (const pattern in navConfig) {
    // 패턴에 ":"가 있다면 동적 경로로 간주
    if (pattern.includes(":")) {
      // 예: pattern이 "/recipe/:recipeId"라면 이를 정규식으로 변환
      const regexPattern = new RegExp("^" + pattern.replace(/:[^\s/]+/g, "([\\w-]+)") + "$");
      if (regexPattern.test(pathname)) {
        return navConfig[pattern];
      }
    }
  }
  // 매칭되는 설정이 없으면 기본값 반환
  return { title: "", links: [] };
}

function TopNav(props) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Offcanvas 열림/닫힘 상태 관리
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);

  // 현재 경로로부터 설정된 navConfig를 찾음
  const currentNav = getNavConfigForPath(location.pathname);

  const hideBackButtonPaths = ["/", "/inventory", "/mealplan", "/recipes", "/store"];

  return (
    <>
      <div className="top-navi">
         {!hideBackButtonPaths.includes(location.pathname) && (
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        )}
        <h2 className="title">{currentNav.title}</h2>
        <div className="icons">
  {currentNav.links.map((link, idx) => {
    if (link.alt === "마이페이지") {
      return (
        <Button 
          className="icon" 
          variant="link" 
          onClick={handleShow} 
          key={idx}
        >
          <span>{link.icon}</span>
        </Button>
      );
    } else {
      return (
        <Link className="icon" to={link.to} key={idx}>
          <span>{link.icon}</span>
          {/*<img
            src={`${process.env.PUBLIC_URL}/assets/images/${link.icon}`}
            alt={link.alt}
            className="icon"
          />*/}
        </Link>
      );
    }
  })}
</div>

      </div>

      {/* Offcanvas 컴포넌트 */}
      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end" className="offcanvas-custom">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>마이페이지</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <MyPage handleClose={handleClose} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default TopNav;