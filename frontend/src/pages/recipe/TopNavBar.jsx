import React from "react";
import { FiArrowLeft, FiEdit, FiUser, FiSearch } from "react-icons/fi";

function TopNavBar({ onSearchButtonClick }) {
  return (
    <div className="top-nav">
      <FiArrowLeft size={24} />

      <h2>레시피</h2>
      <div className="nav-buttons">
        <FiEdit size={24} />

        <FiUser size={24} />

        <FiSearch size={24} onClick={onSearchButtonClick} />
      </div>
    </div>
  );
}

export default TopNavBar;
