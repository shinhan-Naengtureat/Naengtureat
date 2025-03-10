import React from "react";
import { NavLink } from "react-router-dom";
import { FaUtensils, FaCalendarAlt, FaHome, FaBook, FaStore } from "react-icons/fa";
import "styles/common/BottomNav.css"; // 스타일 적용

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/inventory" className="nav-item">
        <FaUtensils />
        <span>재료</span>
      </NavLink>
      <NavLink to="/mealplan" className="nav-item">
        <FaCalendarAlt />
        <span>식단</span>
      </NavLink>
      <NavLink to="/" className="nav-item home">
        <FaHome />
      </NavLink>
      <NavLink to="/recipes" className="nav-item">
        <FaBook />
        <span>레시피</span>
      </NavLink>
      <NavLink to="/store" className="nav-item">
        <FaStore />
        <span>스토어</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;