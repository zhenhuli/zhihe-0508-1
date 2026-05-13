function TrainingLog({ trainingSets, onRemoveSet, onClearAll }) {
  const totalVolume = trainingSets.reduce((sum, set) => sum + set.weight * set.reps, 0);
  const totalSets = trainingSets.length;

  const groupedByExercise = trainingSets.reduce((groups, set) => {
    if (!groups[set.exerciseName]) {
      groups[set.exerciseName] = [];
    }
    groups[set.exerciseName].push(set);
    return groups;
  }, {});

  if (trainingSets.length === 0) {
    return (
      <div className="training-log empty">
        <h2>📊 今日训练记录</h2>
        <p className="empty-text">还没有记录任何训练组，开始你的训练吧！</p>
      </div>
    );
  }

  return (
    <div className="training-log">
      <div className="log-header">
        <h2>📊 今日训练记录</h2>
        <div className="log-stats">
          <span className="stat">总组数: <strong>{totalSets}</strong></span>
          <span className="stat">总容量: <strong>{totalVolume.toFixed(1)}</strong> kg</span>
        </div>
        <button className="clear-btn" onClick={onClearAll}>清空记录</button>
      </div>

      <div className="log-content">
        {Object.entries(groupedByExercise).map(([exerciseName, sets]) => (
          <div key={exerciseName} className="exercise-group">
            <h4 className="exercise-group-title">{exerciseName}</h4>
            <div className="sets-list">
              {sets.map((set, index) => (
                <div key={set.id} className="set-item">
                  <span className="set-number">第{index + 1}组</span>
                  <span className="set-detail">
                    {set.weight}kg × {set.reps}次
                  </span>
                  <button
                    className="remove-set-btn"
                    onClick={() => onRemoveSet(set.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainingLog;
