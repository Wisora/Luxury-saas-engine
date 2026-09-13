'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProductProps {
  id: string;
  title: string;
  brand: string;
  price?: string;
  imageUrl: string;
  affiliateUrl: string;
  category?: string;
}

export const LuxuryProductCard = ({
  title,
  brand,
  price,
  imageUrl,
  affiliateUrl,
  category,
}: ProductProps) => {
  const handleOutboundClick = () => {
    // Fire outbound telemetry event before redirecting
    fetch('/api/telemetry/click', {
      method: 'POST',
      body: JSON.stringify({ affiliateUrl, timestamp: new Date() }),
    }).catch(() => {});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-amber-500/40 transition-colors duration-500"
    >
      {/* Editorial 3:4 Aspect Ratio Image Wrapper */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

        {/* Category Pill */}
        {category && (
          <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/10 text-amber-400 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full">
            {category}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div>
          {/* Brand Name */}
          <p className="text-amber-500/90 text-xs font-semibold tracking-[0.2em] uppercase mb-1">
            {brand}
          </p>

          {/* Product Title - High Luxury Serif */}
          <h3 className="font-serif text-xl font-normal text-white group-hover:text-amber-200 transition-colors duration-300 line-clamp-1">
            {title}
          </h3>
        </div>

        {/* Price & Action Button */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-slate-300 text-sm font-medium tracking-wide">
            {price || 'View Details'}
          </span>

          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOutboundClick}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-amber-400 hover:text-amber-300 uppercase transition-all duration-300 group/btn"
          >
            <span>Shop Item</span>
            <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">
              →
            </span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};