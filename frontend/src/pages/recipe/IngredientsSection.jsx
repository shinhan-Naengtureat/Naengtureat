// IngredientsSection.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import axiosInstance from 'api/axios';
import { INGREDIENT_IMAGE_PATH } from 'config/pathConfig';

function IngredientsSection({ form, setForm, open, toggleSection, touched, setTouched }) {
  // 모달 상태 및 필터링을 위한 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bigCategory, setBigCategory] = useState("");
  const [categories, setCategories] = useState([]); // DB에서 가져온 전체 카테고리 데이터
  const [filteredCategories, setFilteredCategories] = useState([]);

  // 모달 열기/닫기
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // DB에서 카테고리 데이터 가져오기 (/ingredient/categories)
  useEffect(() => {
    axiosInstance.get(`/ingredient/categories`)
      .then((res) => {
        // res.data는 CategoryResponseDTO 배열 (예: { ingredientId, bigCategory, smallCategory, ingredientUnit, standardImage })
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("카테고리 불러오기 실패:", err);
      });
  }, []);

  // bigCategory와 searchQuery에 따라 필터링
  useEffect(() => {
    let filtered = categories;
    if (bigCategory) {
      filtered = filtered.filter(item => item.bigCategory === bigCategory);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.smallCategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredCategories(filtered);
  }, [bigCategory, searchQuery, categories]);

  // 대분류 변경 핸들러
  const handleBigCategoryChange = (e) => {
    setBigCategory(e.target.value);
    setSearchQuery("");
  };

  // 검색어 변경 핸들러
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // 소분류(재료) 선택 시, form.ingredients에 추가
  const handleSelectCategory = (category) => {
    setForm(prev => {
      const newIngredients = [...prev.ingredients];
      let targetIndex = newIngredients.length - 1;
      // 만약 마지막 항목이 이미 채워져 있다면 새 항목 추가
      if (newIngredients[targetIndex].name.trim()) {
        newIngredients.push({ name: "", quantity: "", unit: "", ingredientId: null });
        targetIndex = newIngredients.length - 1;
      }
      newIngredients[targetIndex] = {
        name: category.smallCategory,
        quantity: "1", // 기본값
        unit: category.ingredientUnit,
        ingredientId: category.ingredientId,
      };
      return { ...prev, ingredients: newIngredients };
    });
    closeModal();
  };

  // 기존 재료 입력 필드 처리 (수동 입력)
  const handleIngredientChange = (index, field, value) => {
    setForm(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      // 마지막 항목에 값이 입력되면 새 항목 추가
      if (
        index === newIngredients.length - 1 &&
        (newIngredients[index].name || newIngredients[index].quantity || newIngredients[index].unit)
      ) {
        newIngredients.push({ name: "", quantity: "", unit: "", ingredientId: null });
        setTouched(prevTouched => {
          const newTouched = [...prevTouched.ingredients];
          newTouched.push({ name: false, quantity: false, unit: false });
          return { ...prevTouched, ingredients: newTouched };
        });
      }
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleIngredientBlur = (index, field) => {
    setTouched(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = { ...newIngredients[index], [field]: true };
      return { ...prev, ingredients: newIngredients };
    });
  };

  // 섹션 전체 유효성 (한 항목이라도 제대로 입력되었는지)
  const isSectionTouched = touched.ingredients.some(item => item.name || item.quantity || item.unit);
  const validCount = form.ingredients.filter(ing => ing.name.trim() && ing.quantity.trim() && ing.unit.trim()).length;
  const sectionClass = isSectionTouched ? (validCount >= 1 ? "section-valid" : "section-invalid") : "";

  return (
    <div className={`recipe-ingredients ${sectionClass}`}>
      <h2 onClick={toggleSection}>
        재료 정보 {open ? '▲' : '▼'}
      </h2>
      {open && (
        <div className="section-content">
          {/* 기존 입력 필드 */}
          {form.ingredients.map((ingredient, idx) => (
            <div key={idx} className="ingredient-entry">
              <input
                type="text"
                placeholder="재료"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                onBlur={() => handleIngredientBlur(idx, 'name')}
                className={
                  touched.ingredients[idx] && touched.ingredients[idx].name
                    ? ingredient.name.trim() ? "input-valid" : "input-invalid"
                    : ""
                }
              />
              <input
                type="text"
                placeholder="수량"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                onBlur={() => handleIngredientBlur(idx, 'quantity')}
                className={
                  touched.ingredients[idx] && touched.ingredients[idx].quantity
                    ? ingredient.quantity.trim() ? "input-valid" : "input-invalid"
                    : ""
                }
              />
              <select
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                onBlur={() => handleIngredientBlur(idx, 'unit')}
                className={
                  touched.ingredients[idx] && touched.ingredients[idx].unit
                    ? ingredient.unit.trim() ? "input-valid" : "input-invalid"
                    : ""
                }
              >
                <option value="">단위 선택</option>
                <option value="개">개</option>
                <option value="g">g</option>
                <option value="ml">ml</option>
              </select>
            </div>
          ))}
          {/* 버튼: 모달 열기 */}
          <Button variant="primary" onClick={openModal} style={{ marginTop: '10px' }}>
            재료 선택
          </Button>

          {/* 모달: 대분류 선택 + 검색 및 소분류 목록 */}
          <Modal show={isModalOpen} onHide={closeModal} centered className="small-category-modal">
            <Modal.Header closeButton>
              {/* 대분류 드롭다운 */}
              <select
                value={bigCategory}
                onChange={handleBigCategoryChange}
                style={{ marginRight: '10px' }}
              >
                <option value="">전체</option>
                <option value="과일">과일</option>
                <option value="채소">채소</option>
                <option value="고기">고기</option>
                <option value="수산물">수산물</option>
                <option value="유제품">유제품</option>
                <option value="음료">음료</option>
                <option value="조미료">조미료</option>
                <option value="기타">기타</option>
              </select>
              {/* 검색 입력창 */}
              <div className="search-container">
                <input
                  type="text"
                  placeholder="찾고싶은 재료를 검색해주세요 🔍"
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="small-category-list">
                <Row className={`filtered-row ${filteredCategories.length <= 2 ? "few-results" : ""}`}>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat, index) => (
                      <Col xs={4} key={index} className="text-center category-col" style={{ marginBottom: '10px' }}>
                        <Button
                          variant="light"
                          onClick={() => handleSelectCategory(cat)}
                          className="category-btn"
                          style={{ width: '100%' }}
                        >
                          <img
                            src={`${INGREDIENT_IMAGE_PATH}/${cat.standardImage}`}
                            alt={cat}
                            className="category-icon"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                          <div>{cat.smallCategory}</div>
                        </Button>
                      </Col>
                    ))
                  ) : (
                    <div className="no-results">검색결과가 없습니다</div>
                  )}
                </Row>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default IngredientsSection;
