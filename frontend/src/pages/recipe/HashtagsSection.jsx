// HashtagsSection.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axiosInstance from 'api/axios';

function HashtagsSection({ form, setForm, open, toggleSection, touched, setTouched }) {
  const [options, setOptions] = useState([]);

  // DB에서 해시태그 목록 가져오기
  useEffect(() => {
  axiosInstance.get(`/recipe/hashtag`)
    .then((response) => {
      const opts = response.data.map(ht => ({
        value: ht.id,
        label: ht.keyword,
      }));
      setOptions(opts);
    })
    .catch((error) => {
      console.error("해시태그 데이터 가져오기 실패:", error);
    });
}, []);


  // react-select onChange 핸들러: 선택된 옵션 배열을 form.hashtags에 저장
  const handleChange = (selectedOptions) => {
    setForm(prev => ({ ...prev, hashtags: selectedOptions }));
    setTouched(prev => ({ ...prev, hashtags: true }));
  };

  // 선택된 옵션에 따라 유효성 검사 (1개 이상 선택되면 valid)
  const isValid = form.hashtags && form.hashtags.length > 0;
  const sectionClass = touched.hashtags ? (isValid ? 'section-valid' : 'section-invalid') : '';

  return (
    <div className={`recipe-hashtags ${sectionClass}`}>
      <h2 onClick={toggleSection}>
        해시태그 {open ? '▲' : '▼'}
      </h2>
      {open && (
        <div className="section-content">
          <Select
            isMulti
            options={options}
            value={form.hashtags}
            onChange={handleChange}
            placeholder="해시태그 선택"
            /* ↓↓↓ 핵심 설정 ↓↓↓ */
            menuPortalTarget={document.body}
            styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            />
        </div>
      )}
    </div>
  );
}

export default HashtagsSection;
