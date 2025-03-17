// StepsSection.jsx
import React from 'react';

function StepsSection({ form, setForm, open, toggleSection, touched, setTouched }) {
  const handleStepChange = (index, field, value) => {
    setForm(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], [field]: value };

      if (
        index === newSteps.length - 1 &&
        (newSteps[index].content || newSteps[index].imagePreview)
      ) {
        newSteps.push({ content: "", image: null, imagePreview: null });
        setTouched(prevTouched => {
          const newTouched = [...prevTouched.steps];
          newTouched.push({ content: false, image: false });
          return { ...prevTouched, steps: newTouched };
        });
      }
      return { ...prev, steps: newSteps };
    });
  };

  const handleStepBlur = (index, field) => {
    setTouched(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], [field]: true };
      return { ...prev, steps: newSteps };
    });
  };

  const handleStepImageChange = (index, e) => {
    handleStepBlur(index, 'image');
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setForm(prev => {
        const newSteps = [...prev.steps];
        newSteps[index] = { ...newSteps[index], image: file, imagePreview: previewURL };
        if (
          index === newSteps.length - 1 &&
          (newSteps[index].content || newSteps[index].imagePreview)
        ) {
          newSteps.push({ content: "", image: null, imagePreview: null });
          setTouched(prevTouched => {
            const newTouched = [...prevTouched.steps];
            newTouched.push({ content: false, image: false });
            return { ...prevTouched, steps: newTouched };
          });
        }
        return { ...prev, steps: newSteps };
      });
    }
  };

  const isSectionTouched = touched.steps.some(item => item.content);
  const validCount = form.steps.filter(step => step.content.trim()).length;
  const sectionClass = isSectionTouched ? (validCount >= 1 ? "section-valid" : "section-invalid") : "";

  return (
    <div className={`recipe-steps ${sectionClass}`}>
      <h2 onClick={toggleSection}>
        요리 순서 {open ? '▲' : '▼'}
      </h2>
      {open && (
        <div className="section-content">
          {form.steps.map((step, idx) => (
            <div key={idx} className="step-entry">
              <div className="step-content">
                <textarea
                  placeholder={`순서 ${idx + 1}`}
                  value={step.content}
                  onChange={(e) => handleStepChange(idx, 'content', e.target.value)}
                  onBlur={() => handleStepBlur(idx, 'content')}
                  className={
                    touched.steps[idx] && touched.steps[idx].content
                      ? step.content.trim() ? "input-valid" : "input-invalid"
                      : ""
                  }
                />
              </div>
              <div className="step-image">
                <input
                  type="file"
                  onChange={(e) => handleStepImageChange(idx, e)}
                  onBlur={() => handleStepBlur(idx, 'image')}
                  className={touched.steps[idx] && touched.steps[idx].image ? "input-valid" : ""}
                />
                {step.imagePreview && (
                  <img
                    src={step.imagePreview}
                    alt={`순서 ${idx + 1} 이미지 미리보기`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StepsSection;
