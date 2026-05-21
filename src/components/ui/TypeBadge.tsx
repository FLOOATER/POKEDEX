import { TYPE_COLORS, TYPE_TEXT_COLORS } from '../../utils/constants';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function TypeBadge({ type, size = 'md', className = '' }: TypeBadgeProps) {
  const bg = TYPE_COLORS[type] ?? '#A8A878';
  const color = TYPE_TEXT_COLORS[type] ?? '#ffffff';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-semibold',
    lg: 'px-4 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full capitalize tracking-wide ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: bg, color }}
    >
      {type}
    </span>
  );
}
