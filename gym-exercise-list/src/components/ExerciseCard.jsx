import { useState } from 'react';
import { categories } from '../data/exercises';

function ExerciseCard({ exercise, onAddSet }) {
  const [showDetail, setShowDetail] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const category = categories.find(c => c.id === exercise.category);

  const handleAddSet = () => {
    if (weight && reps) {
      onAddSet(exercise.id, exercise.name, parseFloat(weight), parseInt(reps));
      setWeight('');
      setReps('');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % exercise.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + exercise.images.length) % exercise.images.length);
  };

  return (
    <div className="exercise-card">
      <div className="exercise-header" onClick={() => setShowDetail(!showDetail)}>
        <div className="exercise-title">
          <span className="category-tag">{category?.icon} {category?.name}</span>
          <h3>{exercise.name}</h3>
        </div>
        <span className="expand-icon">{showDetail ? '▼' : '▶'}</span>
      </div>

      {showDetail && (
        <div className="exercise-detail">
          <p className="description">{exercise.description}</p>

          <div className="exercise-visual">
            <strong>📸 动作图解：</strong>
            <div className="image-gallery">
              <div className="image-container">
                <button className="image-nav prev" onClick={prevImage}>‹</button>
                <img
                  src={exercise.images[currentImageIndex]}
                  alt={`${exercise.name} 步骤 ${currentImageIndex + 1}`}
                  className="exercise-image"
                />
                <button className="image-nav next" onClick={nextImage}>›</button>
              </div>
              <div className="image-dots">
                {exercise.images.map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${i === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="steps">
            <strong>📋 动作步骤：</strong>
            <ol className="steps-list">
              {exercise.steps.map((step, i) => (
                <li key={i} className="step-item">
                  <span className="step-number">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          
          <div className="muscles">
            <strong>主要肌群：</strong>
            <div className="muscle-tags">
              {exercise.muscles.map((m, i) => (
                <span key={i} className="muscle-tag">{m}</span>
              ))}
            </div>
          </div>

          <div className="tips">
            <strong>动作要点：</strong>
            <ul>
              {exercise.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="training-record">
            <h4>📝 记录训练</h4>
            <div className="record-inputs">
              <div className="input-group">
                <label>重量 (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0"
                  step="0.5"
                />
              </div>
              <div className="input-group">
                <label>次数</label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="0"
                />
              </div>
              <button className="add-set-btn" onClick={handleAddSet}>
                + 添加组
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExerciseCard;
