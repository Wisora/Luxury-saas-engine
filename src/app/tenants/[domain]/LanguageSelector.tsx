'use client';

import { useState } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

export const translations = {
  en: {
    badge: 'Curated Lookbook',
    subtitle: 'An exclusive selection of personal recommendations, essential wardrobe staples, and luxury finds.',
    emptyTitle: 'No curated items available yet.',
    emptySubtitle: 'Check back soon for new additions.',
    shopBtn: 'Shop Feature',
    powered: 'Powered by Aura Luxury Pipeline',
  },
  es: {
    badge: 'Lookbook Curado',
    subtitle: 'Una selección exclusiva de recomendaciones personales, básicos de armario y hallazgos de lujo.',
    emptyTitle: 'Aún no hay artículos curados disponibles.',
    emptySubtitle: 'Vuelva a consultar pronto para ver nuevas incorporaciones.',
    shopBtn: 'Comprar Pieza',
    powered: 'Con tecnología de Aura Luxury Pipeline',
  },
  fr: {
    badge: 'Lookbook Sélectionné',
    subtitle: 'Une sélection exclusive de recommandations personnelles, d’incontournables de la garde-robe et de pièces de luxe.',
    emptyTitle: 'Aucun article sélectionné pour el moment.',
    emptySubtitle: 'Revenez bientôt pour descubrir las nouveautés.',
    shopBtn: 'Acquérir la Pièce',
    powered: 'Propulsé par Aura Luxury Pipeline',
  },
  de: {
    badge: 'Kuratiertes Lookbook',
    subtitle: 'Eine exklusive Auswahl an persönlichen Empfehlungen, Essentiellen Wardrobe-Stücken und Luxusfunden.',
    emptyTitle: 'Noch keine kuratierten Artikel verfügbar.',
    emptySubtitle: 'Schauen Sie bald wieder vorbei für neue Artikel.',
    shopBtn: 'Stück Erwerben',
    powered: 'Präsentiert von Aura Luxury Pipeline',
  },
  zh: {
    badge: '精选造型册',
    subtitle: '独家精选的个人推荐、必备衣橱单品以及奢品好物。',
    emptyTitle: '暂无精选单品。',
    emptySubtitle: '请稍后再来查看新品上架。',
    shopBtn: '获取单品',
    powered: '由 Aura Luxury Pipeline 驱动',
  },
};

interface LanguageSelectorProps {
  onLanguageChange: (lang: Language) => void;
  currentLang: Language;
}

export default function LanguageSelector({ onLanguageChange, currentLang }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-full shadow-inner">
      <span className="text-xs text-slate-400">🌐</span>
      <select
        value={currentLang}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="bg-transparent text-xs text-slate-200 font-medium uppercase tracking-wider outline-none cursor-pointer"
      >
        <option value="en" className="bg-slate-950 text-slate-200">English</option>
        <option value="es" className="bg-slate-950 text-slate-200">Español</option>
        <option value="fr" className="bg-slate-950 text-slate-200">Français</option>
        <option value="de" className="bg-slate-950 text-slate-200">Deutsch</option>
        <option value="zh" className="bg-slate-950 text-slate-200">中文</option>
      </select>
    </div>
  );
}