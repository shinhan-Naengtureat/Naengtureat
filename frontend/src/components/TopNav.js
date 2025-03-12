import React from 'react';
import { Link } from "react-router-dom";
import "styles/common/topNav.css";

function TopNav(props) {
  return (
    <div className="top-navi">
      <button className="back-btn">←</button> {/* 뒤로 가기 버튼 */}
      <h2 className="title">테마별 레시피</h2>
      <div className="icons">
        <Link to="/bookmarks">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/bookmark-icon.png`}
            alt="북마크"
            className="icon"
          />
        </Link>
        <Link to="/mypage">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/user-icon.png`}
            alt="유저 아이콘"
            className="icon"
          />
        </Link>
      </div>
    </div>
  );
}

export default TopNav;