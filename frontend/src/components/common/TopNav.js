import React from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import "styles/common/topNav.css";
import routeConfig from "routes/routeConfig";

function TopNav(props) {
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 경로로부터 설정된 navConfig를 찾음
  const currentNav = routeConfig.navConfig[location.pathname] || {
    title: "",
    links: [],
  };

  return (
    <div className="top-navi">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>
      <h2 className="title">{currentNav.title}</h2>
      <div className="icons">
        {currentNav.links.map((link, idx) => (
          <Link className="icon" to={link.to} key={idx}>
            <span>{link.icon}</span>
            {/*<img*/}
            {/*  src={`${process.env.PUBLIC_URL}/assets/images/${link.icon}`}*/}
            {/*  alt={link.alt}*/}
            {/*  className="icon"*/}
            {/*/>*/}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopNav;