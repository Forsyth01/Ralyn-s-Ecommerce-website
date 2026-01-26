"use client";

import { motion } from "framer-motion";
import { formatPrice } from "@/app/lib/utils";

export function BarChart({ data, title, height = 200 }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
    >
      {title && <h3 className="font-semibold mb-6">{title}</h3>}
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="w-full bg-gradient-to-t from-black to-neutral-600 dark:from-white dark:to-neutral-400 rounded-t-lg min-h-[4px]"
            />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function LineChart({ data, title, height = 200 }) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.value / maxValue) * 100,
  }));

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
    >
      {title && <h3 className="font-semibold mb-6">{title}</h3>}
      <div style={{ height }} className="relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* Area */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            d={areaD}
            fill="url(#gradient)"
            fillOpacity="0.2"
          />
          {/* Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.5 + i * 0.05 }}
              cx={p.x}
              cy={p.y}
              r="1.5"
              fill="black"
              className="dark:fill-white"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#000" className="dark:stop-color-white" />
              <stop offset="100%" stopColor="#666" className="dark:stop-color-gray" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-4">
        {data.map((item, index) => (
          <span
            key={index}
            className="text-xs text-neutral-500 dark:text-neutral-400"
          >
            {item.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function DonutChart({ data, title, centerValue, centerLabel }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let currentAngle = 0;

  const colors = [
    "#000000",
    "#404040",
    "#737373",
    "#a3a3a3",
    "#d4d4d4",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
    >
      {title && <h3 className="font-semibold mb-6">{title}</h3>}
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {data.map((item, index) => {
              const angle = (item.value / total) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;

              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
              const largeArc = angle > 180 ? 1 : 0;

              return (
                <motion.path
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                  className="dark:opacity-80"
                />
              );
            })}
            <circle cx="50" cy="50" r="25" className="fill-white dark:fill-neutral-900" />
          </svg>
          {(centerValue || centerLabel) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {centerValue && (
                <span className="text-lg font-bold">{centerValue}</span>
              )}
              {centerLabel && (
                <span className="text-xs text-neutral-500">{centerLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-neutral-600 dark:text-neutral-400">
                  {item.label}
                </span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
