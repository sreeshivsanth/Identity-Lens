import { useEffect, useState } from 'react';

export default function ScoreRing({ score, size = 160, strokeWidth = 10, label = 'Exposure Score' }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [score]);

  const getScoreColor = (s) => {
    if (s <= 25) return '#10b981'; // green — low exposure
    if (s <= 50) return '#f59e0b'; // amber — moderate
    if (s <= 75) return '#f97316'; // orange — high
    return '#ef4444'; // red — critical
  };

  const color = getScoreColor(score);

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(100, 116, 139, 0.12)"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div className="score-ring-value">
        <span className="score-ring-number" style={{ color }}>
          {animatedScore}
        </span>
        <span className="score-ring-label">{label}</span>
      </div>
    </div>
  );
}
