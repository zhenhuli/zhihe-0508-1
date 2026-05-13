import { useState, useEffect } from 'react';
import { exercises } from './data/exercises';
import CategoryNav from './components/CategoryNav';
import ExerciseCard from './components/ExerciseCard';
import TrainingLog from './components/TrainingLog';
import './App.css';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [trainingSets, setTrainingSets] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('trainingSets');
    if (saved) {
      setTrainingSets(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('trainingSets', JSON.stringify(trainingSets));
  }, [trainingSets]);

  const filteredExercises = activeCategory === 'all'
    ? exercises
    : exercises.filter(e => e.category === activeCategory);

  const handleAddSet = (exerciseId, exerciseName, weight, reps) => {
    const newSet = {
      id: Date.now(),
      exerciseId,
      exerciseName,
      weight,
      reps,
      timestamp: new Date().toISOString()
    };
    setTrainingSets(prev => [...prev, newSet]);
  };

  const handleRemoveSet = (setId) => {
    setTrainingSets(prev => prev.filter(s => s.id !== setId));
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有训练记录吗？')) {
      setTrainingSets([]);
    }
  };

  const totalVolume = trainingSets.reduce((sum, set) => sum + set.weight * set.reps, 0);
  const totalSets = trainingSets.length;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>🏋️ 健身动作库</h1>
            <p className="subtitle">按部位浏览动作，科学记录训练</p>
          </div>
          <button className="log-summary-btn" onClick={() => setShowLogModal(true)}>
            <span className="btn-icon">📊</span>
            <span className="btn-text">训练记录</span>
            {totalSets > 0 && (
              <span className="set-count-badge">{totalSets}</span>
            )}
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="exercise-section">
          <CategoryNav
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <div className="exercise-list">
            {filteredExercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onAddSet={handleAddSet}
              />
            ))}
          </div>
        </div>

        <div className="log-section">
          <TrainingLog
            trainingSets={trainingSets}
            onRemoveSet={handleRemoveSet}
            onClearAll={handleClearAll}
          />
        </div>
      </main>

      {showLogModal && (
        <div className="log-modal-overlay" onClick={() => setShowLogModal(false)}>
          <div className="log-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📊 训练记录汇总</h2>
              <button className="close-btn" onClick={() => setShowLogModal(false)}>✕</button>
            </div>
            
            <div className="modal-stats">
              <div className="stat-card">
                <div className="stat-value">{totalSets}</div>
                <div className="stat-label">总组数</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{totalVolume.toFixed(1)}</div>
                <div className="stat-label">总容量 (kg)</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{new Set(trainingSets.map(s => s.exerciseName)).size}</div>
                <div className="stat-label">动作数量</div>
              </div>
            </div>

            <TrainingLog
              trainingSets={trainingSets}
              onRemoveSet={handleRemoveSet}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
