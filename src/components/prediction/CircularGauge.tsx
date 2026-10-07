import React from 'react';

interface CircularGaugeProps {
  probability: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  probability,
  size = 190,
  strokeWidth = 14,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270-degree arc for speedometer gauge look or full circle
  // Let's do a clean 260-degree open gauge for maximum fintech polish
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(Math.max(probability, 0), 100)) / 100;

  // Determine stroke color based on probability
  let strokeColor = '#10b981'; // green / high
  if (probability < 45) {
    strokeColor = '#ef4444'; // red / low
  } else if (probability < 70) {
    strokeColor = '#f59e0b'; // yellow / amber / medium
  }

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-135"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Dynamic value track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${strokeColor}40)`,
          }}
        />
      </svg>

      {/* Center Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Success Probability
        </span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-4xl md:text-5xl font-extrabold font-mono tracking-tight text-white">
            {probability.toFixed(1)}
          </span>
          <span className="text-xl font-bold text-slate-400">%</span>
        </div>
        <div
          className={`mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            probability >= 70
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : probability >= 45
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {probability >= 70 ? 'High Probability' : probability >= 45 ? 'Moderate Probability' : 'High Risk'}
        </div>
      </div>
    </div>
  );
};
