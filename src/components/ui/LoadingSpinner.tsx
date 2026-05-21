interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClass = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' }[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClass} relative animate-spin-slow`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="46" fill="white" stroke="#e5e7eb" strokeWidth="4" className="dark:fill-gray-800 dark:stroke-gray-600" />
          <path d="M4 50 Q4 4 50 4 Q96 4 96 50Z" fill="#EF4444" />
          <rect x="4" y="46" width="92" height="8" fill="#374151" />
          <circle cx="50" cy="50" r="13" fill="white" stroke="#374151" strokeWidth="4" className="dark:fill-gray-800" />
          <circle cx="50" cy="50" r="6" fill="#f3f4f6" className="dark:fill-gray-700" />
        </svg>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md">
      <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse" />
          <div className="h-5 w-14 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
