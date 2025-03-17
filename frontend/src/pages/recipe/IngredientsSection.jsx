// IngredientsSection.jsx
import React from 'react';

function IngredientsSection({ form, setForm, open, toggleSection, touched, setTouched }) {
  const handleIngredientChange = (index, field, value) => {
    setForm(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };

      // 마지막 항목에 값이 입력되면 새 항목 추가
      if (
        index === newIngredients.length - 1 &&
        (newIngredients[index].name || newIngredients[index].quantity || newIngredients[index].unit)
      ) {
        newIngredients.push({ name: "", quantity: "", unit: "" });
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

  // 섹션 전체 터치 여부: 한 항목이라도 터치되었으면 touched
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
                <option value="g">g</option>
                <option value="ml">ml</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IngredientsSection;
