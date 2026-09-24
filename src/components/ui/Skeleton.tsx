import React from 'react';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  variant = 'rectangular', 
  width, 
  height, 
  className = '', 
  style, 
  ...rest 
}) => {
  const baseStyles = 'skeleton bg-surface-200';
  
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <Skeleton variant="rectangular" className="aspect-[2/3] w-full" />
    <Skeleton variant="text" height="1.25rem" className="w-3/4 mt-2" />
    <Skeleton variant="text" height="1rem" className="w-1/2" />
  </div>
);

export const SkeletonRow: React.FC<{ count?: number, className?: string }> = ({ count = 5, className = '' }) => (
  <div className={`flex gap-4 overflow-hidden ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} className="flex-none w-32 sm:w-40 md:w-48 lg:w-56" />
    ))}
  </div>
);
