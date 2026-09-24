import React, { useEffect, useState } from 'react';
import { getImage, MEDIA_CHANGED } from '../../engine/mediaLibrary';

interface WolfBrandLogoProps {
  variant?: 'hud' | '3d' | 'watermark' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const WolfBrandLogo: React.FC<WolfBrandLogoProps> = ({
  variant = 'badge',
  size = 'md',
  className = '',
  showText = true,
}) => {
  const [customUrl, setCustomUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    let url: string | null = null;
    const load = async () => {
      try {
        const image = await getImage('brand-logo');
        if (!active) return;
        const next = image ? URL.createObjectURL(image.blob) : null;
        setCustomUrl(next);
        if (url) URL.revokeObjectURL(url);
        url = next;
      } catch { /* Browser without IndexedDB uses built-in logo. */ }
    };
    load();
    window.addEventListener(MEDIA_CHANGED, load);
    return () => {
      active = false;
      window.removeEventListener(MEDIA_CHANGED, load);
      if (url) URL.revokeObjectURL(url);
    };
  }, []);
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  const dim = sizeMap[size].split(' ').slice(0, 2).join(' ');

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Wolf Head SVG Emblem */}
      <div
        className={`relative ${dim} rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
          variant === '3d'
            ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 shadow-[0_8px_25px_rgba(245,158,11,0.4)] border border-amber-300'
            : variant === 'hud'
            ? 'bg-black/60 border border-white/20 backdrop-blur-md shadow-lg'
            : variant === 'watermark'
            ? 'bg-transparent opacity-40'
            : 'bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-md'
        }`}
      >
        {customUrl ? <img src={customUrl} alt="لوگوی آپلودی داداش‌مد" className="w-full h-full object-contain" /> : <svg
          viewBox="0 0 100 100"
          className="w-[70%] h-[70%]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized Geometric Wolf Head (Chroma-safe, pure amber/cyan/white) */}
          <path
            d="M50 15L65 35L85 30L78 58L88 78L50 92L12 78L22 58L15 30L35 35L50 15Z"
            fill={variant === '3d' ? '#1a1408' : '#ffffff'}
            stroke={variant === '3d' ? '#FBBF24' : '#00F0FF'}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Wolf Eyes */}
          <polygon
            points="38,48 44,52 38,56"
            fill={variant === '3d' ? '#EF4444' : '#00F0FF'}
          />
          <polygon
            points="62,48 56,52 62,56"
            fill={variant === '3d' ? '#EF4444' : '#00F0FF'}
          />
          {/* Muzzle Ridge */}
          <path
            d="M50 35L50 75"
            stroke={variant === '3d' ? '#FBBF24' : '#ffffff'}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>}
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-['Chakra_Petch'] font-black tracking-wider text-white uppercase text-sm sm:text-base">
            DADASH<span className="text-amber-400">MODE</span>
          </span>
          <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
            SHOW ENGINE
          </span>
        </div>
      )}
    </div>
  );
};
