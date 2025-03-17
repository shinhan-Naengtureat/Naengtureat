// HashtagsSection.jsx
import React from 'react';

function HashtagsSection({ form, setForm, open, toggleSection, touched, setTouched }) {
  const handleHashtagsChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`recipe-hashtags ${
      touched.hashtags ? (form.hashtags.trim() ? 'section-valid' : 'section-invalid') : ''
    }`}>
      <h2 onClick={toggleSection}>
        해시태그 {open ? '▲' : '▼'}
      </h2>
      {open && (
        <div className="section-content">
          <input
            type="text"
            placeholder="해시태그"
            name="hashtags"
            value={form.hashtags}
            onChange={handleHashtagsChange}
            onBlur={() => setTouched(prev => ({ ...prev, hashtags: true }))}
            className={touched.hashtags ? (form.hashtags.trim() ? 'input-valid' : 'input-invalid') : ''}
          />
        </div>
      )}
    </div>
  );
}

export default HashtagsSection;
