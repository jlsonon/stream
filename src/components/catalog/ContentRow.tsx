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
  isTop10?: boolean;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  items,
  onOpenDetails,
  seeAllHref,
  badge,
  progressMap,
  isTop10 = false
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
    <section className="relative py-2.5 sm:py-4 group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between px-3 sm:px-6 lg:px-8 mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <h2 className="text-base sm:text-xl font-extrabold tracking-tight text-white group-hover/row:text-cinemix-primary transition-colors">
            {title}
          </h2>
          {badge && (
            <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase bg-surface-200 text-cinemix-primary border border-white/10">
              {badge}
            </span>
          )}
        </div>

        {seeAllHref && (
          <Link 
            href={seeAllHref}
            className="text-[11px] sm:text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            Explore all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Row Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-12 bg-black/80 hover:bg-black text-white/80 hover:text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-md border-r border-white/5"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex items-start gap-3 sm:gap-4 md:gap-5 overflow-x-auto px-3 sm:px-6 lg:px-8 py-2 hide-scrollbar scroll-smooth"
        >
          {items.map((item, idx) => (
            <div key={item.id} className="relative flex items-end flex-shrink-0 group/card">
              {isTop10 && (
                <div className="relative -mr-3 sm:-mr-5 z-0 select-none pointer-events-none pb-7 sm:pb-9">
                  <span 
                    className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tighter text-transparent select-none leading-none block"
                    style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.28)' }}
                  >
                    {idx + 1}
                  </span>
                </div>
              )}
              <div className="relative z-10">
                {/* Cineby-Style Stacked Top 10 Corner Rank Badge */}
                {isTop10 && (
                  <div className="absolute top-2 left-2 z-20 px-1.5 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-center leading-none shadow-cinema pointer-events-none">
                    <span className="text-[7.5px] font-black tracking-widest text-amber-400 block">TOP</span>
                    <span className="text-[11px] sm:text-xs font-mono font-black text-white block mt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                )}
                <ContentCard
                  item={item}
                  onOpenDetails={onOpenDetails}
                  progressPercent={progressMap ? progressMap[item.id] : undefined}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-12 bg-black/80 hover:bg-black text-white/80 hover:text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-md border-l border-white/5"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>
    </section>
  );
};
