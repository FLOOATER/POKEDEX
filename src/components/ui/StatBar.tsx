import { useEffect, useRef, useState } from 'react';
import { STAT_FULL_NAMES, STAT_COLORS, MAX_STAT } from '../../utils/constants';

interface StatBarProps {
  statName: string;
  value: number;
  maxValue?: number;
  showLabel?: boolean;
  compareValue?: number;
  animate?: boolean;
}

export default function StatBar({
  statName,
  value,
  maxValue = MAX_STAT,
  showLabel = true,
  compareValue,
  animate = true,
}: StatBarProps) {
  const [width, setWidth] = useState(0);
  const [compareWidth, setCompareWidth] = useState(0);
  const mounted = useRef(false);

  const pct = Math.min((value / maxValue) * 100, 100);
  const comparePct = compareValue !== undefined ? Math.min((compareValue / maxValue) * 100, 100) : 0;
  const color = STAT_COLORS[statName] ?? '#94a3b8';
  const label = STAT_FULL_NAMES[statName] ?? statName;

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (animate) {
        requestAnimationFrame(() => {
          setWidth(pct);
          setCompareWidth(comparePct);
        });
      } else {
        setWidth(pct);
        setCompareWidth(comparePct);
      }
    } else {
      setWidth(pct);
      setCompareWidth(comparePct);
    }
  }, [pct, comparePct, animate]);

  const statColor =
    value >= 100 ? 'text-green-500' :
    value >= 60 ? 'text-yellow-500' :
    'text-red-500';

  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <span className="w-20 text-right text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">
          {label}
        </span>
      )}
      <span className={`w-8 text-right text-sm font-bold shrink-0 ${statColor}`}>{value}</span>
      <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
      {compareValue !== undefined && (
        <>
          <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${compareWidth}%`,
                backgroundColor: compareValue > value ? '#22c55e' : compareValue < value ? '#ef4444' : color,
              }}
            />
          </div>
          <span
            className={`w-8 text-sm font-bold shrink-0 ${
              compareValue > value ? 'text-green-500' : compareValue < value ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {compareValue}
          </span>
        </>
      )}
    </div>
  );
}
