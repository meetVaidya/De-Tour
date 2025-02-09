"use client";

import { motion } from "framer-motion";

interface SpeedometerProps {
  positivePercentage: number;
  totalReviews: number;
}

export function Speedometer({ positivePercentage, totalReviews }: SpeedometerProps) {
  const percentage = Math.round(positivePercentage * 100);

  // Convert percentage to degrees (0-180 degree scale)
  const rotation = (percentage * 180) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-forest-200"
    >
      <h3 className="text-xl font-semibold text-forest-800 mb-4 text-center">
        Sentiment Overview
      </h3>

      <div className="flex flex-col items-center">
        {/* SVG Speedometer */}
        <div className="relative w-64 h-32">
          <svg
            viewBox="0 0 200 100"
            className="w-full h-full"
          >
            {/* Background Arc */}
            <path
              d="M20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Colored Arc */}
            <path
              d={`M20 90 A 80 80 0 0 1 ${20 + (160 * percentage) / 100} 90`}
              fill="none"
              stroke={percentage > 50 ? "#22c55e" : "#ef4444"}
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Needle */}
            <g transform={`rotate(${rotation - 90}, 100, 90)`}>
              <line
                x1="100"
                y1="90"
                x2="160"
                y2="90"
                stroke="#1f2937"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle
                cx="100"
                cy="90"
                r="8"
                fill="#1f2937"
              />
            </g>

            {/* Percentage Text */}
            <text
              x="100"
              y="70"
              textAnchor="middle"
              className="text-2xl font-bold"
              fill="#1f2937"
            >
              {percentage}%
            </text>
          </svg>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-8 w-full max-w-xs mt-6">
          <div className="text-center">
            <div className="text-sm text-forest-600">Positive</div>
            <div className="text-2xl font-bold text-green-600">
              {percentage}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-forest-600">Negative</div>
            <div className="text-2xl font-bold text-red-600">
              {100 - percentage}%
            </div>
          </div>
        </div>

        {/* Total Reviews */}
        <div className="mt-4 text-center">
          <p className="text-forest-700 font-medium">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Sentiment Scale */}
        <div className="w-full mt-6 px-4">
          <div className="flex justify-between text-sm text-forest-600">
            <span>Very Negative</span>
            <span>Neutral</span>
            <span>Very Positive</span>
          </div>
          <div className="h-2 mt-1 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
        </div>
      </div>
    </motion.div>
  );
}

// Optional: Add color segments version
export function SpeedometerWithSegments({ positivePercentage, totalReviews }: SpeedometerProps) {
  const percentage = Math.round(positivePercentage * 100);
  const rotation = (percentage * 180) / 100;

  // Create segment colors
  const segments = [
    { color: "#ef4444", label: "Very Negative" },
    { color: "#f97316", label: "Negative" },
    { color: "#facc15", label: "Neutral" },
    { color: "#84cc16", label: "Positive" },
    { color: "#22c55e", label: "Very Positive" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-forest-200"
    >
      <h3 className="text-xl font-semibold text-forest-800 mb-4 text-center">
        Sentiment Overview
      </h3>

      <div className="flex flex-col items-center">
        <div className="relative w-64 h-32">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Segment Arcs */}
            {segments.map((segment, index) => {
              const startAngle = (index * 36) - 90;
              const endAngle = ((index + 1) * 36) - 90;
              const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 90 + 80 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 90 + 80 * Math.sin((endAngle * Math.PI) / 180);

              return (
                <path
                  key={index}
                  d={`M 100 90 L ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                  opacity={0.2}
                />
              );
            })}

            {/* Needle */}
            <g transform={`rotate(${rotation - 90}, 100, 90)`}>
              <line
                x1="100"
                y1="90"
                x2="160"
                y2="90"
                stroke="#1f2937"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle
                cx="100"
                cy="90"
                r="8"
                fill="#1f2937"
              />
            </g>

            {/* Percentage Text */}
            <text
              x="100"
              y="70"
              textAnchor="middle"
              className="text-2xl font-bold"
              fill="#1f2937"
            >
              {percentage}%
            </text>
          </svg>
        </div>

        {/* Rest of the component remains the same */}
        {/* ... */}
      </div>
    </motion.div>
  );
}
