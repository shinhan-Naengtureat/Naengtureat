// OverviewSection.jsx
import React from 'react';

function OverviewSection({
  form,
  setForm,
  imagePreview,
  setImagePreview,
  open,
  toggleSection,
  touched,
  setTouched,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCookingInfoChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      cookingInfo: { ...prev.cookingInfo, [field]: value },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
      setForm((prev) => ({ ...prev, recipeImage: file }));
    }
    setTouched((prev) => ({ ...prev, recipeImage: true }));
  };

  const onBlurHandler = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // 폼 상태에서 필요한 값들
  const { recipeName, categoryBig, categorySmall, cookingInfo, recipeImage } = form;
  const { servings, cookingTime, difficulty } = cookingInfo;

  // 섹션 전체 터치 여부
  const isSectionTouched =
    touched.recipeName ||
    touched.categoryBig ||
    touched.categorySmall ||
    touched.cookingInfo.servings ||
    touched.cookingInfo.cookingTime ||
    touched.cookingInfo.difficulty ||
    touched.recipeImage;

  // 섹션 전체 유효성 (빈 값이 없어야 함)
  const isSectionValid =
    recipeName.trim() &&
    categoryBig.trim() &&
    categorySmall.trim() &&
    servings &&
    cookingTime &&
    difficulty &&
    recipeImage;

  const sectionClass = isSectionTouched ? (isSectionValid ? 'section-valid' : 'section-invalid') : '';

  return (
    <div className={`recipe-overview ${sectionClass}`}>
      <h2 onClick={toggleSection}>
        레시피 개요 {open ? '▲' : '▼'}
      </h2>
      {open && (
        <div className="section-content">
          <input 
            type="file" 
            name="recipeImage" 
            onChange={handleImageChange}
            onBlur={() => onBlurHandler('recipeImage')}
            className={touched.recipeImage ? (recipeImage ? 'input-valid' : 'input-invalid') : ''}
          />
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="레시피 미리보기" 
              style={{ width: '100%', height: 'auto', marginTop: '10px' }} 
            />
          )}
          <input
            type="text"
            name="recipeName"
            placeholder="레시피명"
            value={recipeName}
            onChange={handleInputChange}
            onBlur={() => onBlurHandler('recipeName')}
            className={touched.recipeName ? (recipeName.trim() !== '' ? 'input-valid' : 'input-invalid') : ''}
          />
          <select
            name="categoryBig"
            value={categoryBig}
            onChange={handleInputChange}
            onBlur={() => onBlurHandler('categoryBig')}
            className={touched.categoryBig ? (categoryBig.trim() !== '' ? 'input-valid' : 'input-invalid') : ''}
          >
            <option value="">카테고리 대분류 선택</option>
            <option value="채식">채식</option>
            <option value="한식">한식</option>
            <option value="양식">양식</option>
            <option value="일식">일식</option>
            <option value="중식">중식</option>
            <option value="퓨전">퓨전</option>
          </select>
          <input
            type="text"
            name="categorySmall"
            placeholder="소분류"
            value={categorySmall}
            onChange={handleInputChange}
            onBlur={() => onBlurHandler('categorySmall')}
            className={touched.categorySmall ? (categorySmall.trim() !== '' ? 'input-valid' : 'input-invalid') : ''}
          />
          <div className="recipe-cooking-info">
            <input
              type="number"
              name="servings"
              placeholder="인원"
              value={servings}
              onChange={(e) => handleCookingInfoChange('servings', e.target.value)}
              onBlur={() =>
                setTouched((prev) => ({
                  ...prev,
                  cookingInfo: { ...prev.cookingInfo, servings: true },
                }))
              }
              className={
                touched.cookingInfo.servings
                  ? servings ? 'input-valid' : 'input-invalid'
                  : ''
              }
            />
            <select
              name="cookingTime"
              value={cookingTime}
              onChange={(e) => handleCookingInfoChange('cookingTime', e.target.value)}
              onBlur={() =>
                setTouched((prev) => ({
                  ...prev,
                  cookingInfo: { ...prev.cookingInfo, cookingTime: true },
                }))
              }
              className={
                touched.cookingInfo.cookingTime
                  ? cookingTime ? 'input-valid' : 'input-invalid'
                  : ''
              }
            >
              <option value="">시간 선택</option>
              <option value="15분 이내">15분 이내</option>
              <option value="30분 이내">30분 이내</option>
              <option value="60분 이내">60분 이내</option>
              <option value="90분 이내">90분 이내</option>
              <option value="2시간 이내">2시간 이내</option>
            </select>
            <select
              name="difficulty"
              value={difficulty}
              onChange={(e) => handleCookingInfoChange('difficulty', e.target.value)}
              onBlur={() =>
                setTouched((prev) => ({
                  ...prev,
                  cookingInfo: { ...prev.cookingInfo, difficulty: true },
                }))
              }
              className={
                touched.cookingInfo.difficulty
                  ? difficulty ? 'input-valid' : 'input-invalid'
                  : ''
              }
            >
              <option value="">난이도 선택</option>
              <option value="초급">초급</option>
              <option value="중급">중급</option>
              <option value="고급">고급</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default OverviewSection;
