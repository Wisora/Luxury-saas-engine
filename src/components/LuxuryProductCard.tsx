'use client';

import React from "react";
import Image from "next/image";
import { LuxuryItem } from "../types";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

interface LuxuryProductCardProps {
  item: LuxuryItem;
  onSelect?: (item: LuxuryItem) => void;
}

export const LuxuryProductCard: React.FC<LuxuryProductCardProps> = ({ item, onSelect }) => {
  return (
    <div className="relative group bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between">
      {/* Visual Header / Image Container */}
      <div className="relative h-56 w-full bg-slate-950 overflow-hidden flex items-center justify-center">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-slate-700 font-serif text-4xl select-none">AURA</div>
        )}
        
        {/* Anchored Feather / Trust Score Badge */}
        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
          <ShieldCheck className="w-3 h-3 text-amber-400" />
          <span>{item.score ?? 98}% Verified</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-amber-500/80 uppercase">
            {item.brand}
          </span>
          <h3 className="font-serif text-lg font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            Provenance certified via {item.network || "Aura Protocol"}.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-500 block">ESTIMATED VALUATION</span>
            <span className="font-serif text-base font-semibold text-amber-400">
              {item.currency} {item.price.toLocaleString()}
            </span>
          </div>

          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};