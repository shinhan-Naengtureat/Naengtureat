import React, { useState, useEffect } from "react";

function SearchBar({ value, onSearch }) {
  // 내부 입력값 상태를 별도로 관리하여 조합 입력 중에도 화면에 반영되도록 함
  const [inputValue, setInputValue] = useState(value);
  const [isComposing, setIsComposing] = useState(false);

  // 부모에서 전달된 value가 변경되면 내부 상태도 업데이트
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value); // 항상 로컬 상태 업데이트
    if (!isComposing) {
      onSearch(e.target.value);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e) => {
    setIsComposing(false);
    setInputValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="레시피 검색"
        value={inputValue}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
    </div>
  );
}

export default SearchBar;
