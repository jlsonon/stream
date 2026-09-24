'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentItem } from '@/types';
import { ContentCard } from './ContentCard';

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  onOpenDetails: (item: ContentItem) => void;
  seeAllHref?: string;
  badge?: string;
  progressMap?: Record<string, number>;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  items,
  onOpenDetails,
  seeAllHref,
  badge,
  progressMap
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative py-4 group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover/row:text-cinemix-primary transition-colors">
            {title}
          </h2>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cinemix-primary/20 text-cinemix-primary border border-cinemix-primary/30">
              {badge}
            </span>
          )}
        </div>

        {seeAllHref && (
          <Link 
            href={seeAllHref}
            className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            Explore all <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Row Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 py-2 hide-scrollbar scroll-smooth"
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onOpenDetails={onOpenDetails}
              progressPercent={progressMap ? progressMap[item.id] : undefined}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </section>
  );
};
