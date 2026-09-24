import React, { useState, useEffect } from 'react';

export interface DadashWolfLogoProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
  variant?: 'icon' | 'badge' | 'full';
  showSubtitle?: boolean;
  animate?: boolean;
}

const LOCAL_STORAGE_LOGO_KEY = 'dadashmode_custom_logo';

/**
 * Official DADASHMODE Esports YouTube Channel Logo:
 * - Aggressive Wolf / Husky mascot facing right
 * - Black fur coat with brilliant electric blue (#00A3FF) spine highlights
 * - Crisp white snout, cheek, inner ear & sharp white fangs
 * - Cyan glowing eye (#00E5FF) and electric blue tongue (#00A3FF)
 * - Angled dynamic text: "DADASH" in distressed WHITE + "MODE" in ELECTRIC BLUE
 * - Underline electric blue slash tail
 * - Supports custom image upload stored in localStorage for 100% exact pixel fidelity
 */
export const DadashWolfLogo: React.FC<DadashWolfLogoProps> = ({
  className = '',
  size = 48,
  glow = true,
  variant = 'icon',
  showSubtitle = false,
  animate = true,
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check if user uploaded a custom logo image
    const saved = localStorage.getItem(LOCAL_STORAGE_LOGO_KEY);
    if (saved) {
      setCustomLogoUrl(saved);
    }

    const handleStorageChange = () => {
      const updated = localStorage.getItem(LOCAL_STORAGE_LOGO_KEY);
      setCustomLogoUrl(updated);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dadashmode_logo_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dadashmode_logo_updated', handleStorageChange);
    };
  }, []);

  // If a custom image was uploaded by user, use it with high-fidelity drop-shadow
  if (customLogoUrl) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: variant === 'full' ? 'auto' : typeof size === 'number' ? `${size}px` : size,
        }}
      >
        {glow && (
          <div
            className="absolute inset-0 rounded-2xl blur-lg opacity-60 bg-cyan-500/40 pointer-events-none -z-10 animate-pulse"
            style={{ transform: 'scale(1.15)' }}
          />
        )}
        <img
          src={customLogoUrl}
          alt="DADASHMODE Official YouTube Logo"
          referrerPolicy="no-referrer"
          className={`w-full h-auto object-contain max-h-full drop-shadow-[0_4px_20px_rgba(0,163,255,0.6)] ${
            animate ? 'transition-transform duration-300' : ''
          }`}
        />
      </div>
    );
  }

  // --- FULL VECTOR LOGO (Wolf + "DADASH" (white) + "MODE" (blue)) ---
  if (variant === 'full') {
    return (
      <div
        className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
        style={{ width: typeof size === 'number' ? `${size}px` : size }}
      >
        {glow && (
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-cyan-500/30 blur-3xl rounded-full animate-pulse" />
          </div>
        )}

        <svg
          viewBox="0 0 950 680"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-[0_8px_32px_rgba(0,163,255,0.55)]"
        >
          <defs>
            {/* Primary Esports Blue Gradient */}
            <linearGradient id="esportsBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="40%" stopColor="#00A3FF" />
              <stop offset="100%" stopColor="#0066FF" />
            </linearGradient>

            <linearGradient id="furGrayGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9AAFC4" />
              <stop offset="100%" stopColor="#627589" />
            </linearGradient>

            <filter id="esportsGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* =========================================================================
              PART 1: WOLF MASCOT (FACING RIGHT - EXACT ESPORTS SILHOUETTE)
             ========================================================================= */}
          <g transform="translate(100, 20)">
            {/* 1. Heavy Black Outer Silhouette Outline */}
            <path
              d="M 120 440 L 90 400 L 150 360 L 110 320 L 180 270 L 140 230 L 220 170 L 200 130 L 320 80 L 370 120 L 410 70 L 440 120 L 510 160 L 570 200 L 640 240 L 670 290 L 610 330 L 620 370 L 540 370 L 500 420 L 410 400 L 350 450 L 280 430 L 220 460 Z"
              fill="#060911"
              stroke="#060911"
              strokeWidth="16"
              strokeLinejoin="round"
            />

            {/* 2. Electric Blue Outer Mane Spikes & Edge Accent Layers */}
            {/* Top Ear Outer Flange */}
            <polygon points="410,70 380,120 440,120" fill="url(#esportsBlue)" />
            {/* Top Crown Blue Accent */}
            <polygon points="440,120 470,140 500,130" fill="url(#esportsBlue)" />
            {/* Outer Mane Spine 1 (Top Back) */}
            <polygon points="200,130 320,80 270,160" fill="url(#esportsBlue)" />
            {/* Outer Mane Spine 2 */}
            <polygon points="140,230 220,170 190,250" fill="url(#esportsBlue)" />
            {/* Outer Mane Spine 3 */}
            <polygon points="110,320 180,270 150,340" fill="url(#esportsBlue)" />
            {/* Outer Mane Spine 4 (Bottom Back) */}
            <polygon points="90,400 150,360 130,420" fill="url(#esportsBlue)" />

            {/* Front Neck Blue Slash Flange */}
            <polygon points="410,400 480,360 450,420 380,430" fill="url(#esportsBlue)" />
            <polygon points="480,360 520,340 500,390" fill="url(#esportsBlue)" />

            {/* 3. Deep Charcoal / Black Main Fur Body */}
            <path
              d="M 160 420 L 130 380 L 180 340 L 140 300 L 210 250 L 180 200 L 250 150 L 330 100 L 380 140 L 420 90 L 440 140 L 500 180 L 530 230 L 490 260 L 430 230 L 380 260 L 340 320 L 310 380 Z"
              fill="#111622"
            />

            {/* 4. Cool Gray Shading Mid-Tone Fur Strands */}
            <polygon points="340,150 420,200 460,190 380,240 300,220" fill="url(#furGrayGrad)" />
            <polygon points="380,240 450,250 480,230 420,280 340,280" fill="url(#furGrayGrad)" />
            <polygon points="340,280 430,300 460,290 380,340 310,340" fill="url(#furGrayGrad)" />
            <polygon points="450,190 510,210 530,230 490,250" fill="url(#furGrayGrad)" />

            {/* 5. Crisp White Snout, Cheek, Eye Patch & Inner Ear */}
            {/* Inner Ear White */}
            <polygon points="415,95 385,130 430,130" fill="#FFFFFF" />

            {/* Cheek & Eye Surrounding White Mask */}
            <polygon points="460,190 530,215 560,240 520,260 480,245" fill="#FFFFFF" />
            <polygon points="430,230 480,245 460,285 410,270" fill="#FFFFFF" />
            <polygon points="460,285 520,280 500,320 440,310" fill="#FFFFFF" />

            {/* Upper Muzzle & Snout White Coat */}
            <polygon points="530,215 580,225 630,260 610,280 550,260" fill="#FFFFFF" />

            {/* Lower Jaw White Fur */}
            <polygon points="510,320 540,340 580,330 550,360 500,350" fill="#FFFFFF" />

            {/* 6. Black Nose & Snarl Details */}
            <polygon points="620,255 645,268 630,280 610,275" fill="#0A0D14" />
            <polygon points="570,245 595,255 580,265" fill="#111622" />

            {/* 7. Snarl Mouth Cavity & Vibrant Cyan Tongue */}
            {/* Deep Dark Mouth Interior */}
            <polygon points="595,275 540,275 515,300 545,325 580,315" fill="#070A10" />

            {/* Electric Blue Tongue */}
            <path
              d="M 545 295 Q 565 290 575 305 Q 560 315 545 310 Z"
              fill="url(#esportsBlue)"
              stroke="#00E5FF"
              strokeWidth="1.5"
            />

            {/* Sharp White Chrome Fangs & Teeth */}
            {/* Top Main Fang */}
            <polygon points="605,275 598,302 590,277" fill="#FFFFFF" stroke="#0A0D14" strokeWidth="1" />
            {/* Top Secondary Teeth */}
            <polygon points="588,277 583,293 577,278" fill="#FFFFFF" />
            <polygon points="575,278 571,290 565,279" fill="#FFFFFF" />
            {/* Bottom Main Fang */}
            <polygon points="575,315 570,295 564,316" fill="#FFFFFF" stroke="#0A0D14" strokeWidth="1" />
            <polygon points="562,316 558,303 553,317" fill="#FFFFFF" />

            {/* 8. Glowing Electric Cyan Eye */}
            <g filter="url(#esportsGlow)">
              {/* Fierce Angular Socket */}
              <polygon points="515,225 550,232 535,248 508,240" fill="#060911" />
              {/* Cyan Iris */}
              <polygon points="520,230 545,235 536,245 516,238" fill="#00E5FF" />
              {/* Pupil */}
              <polygon points="530,233 540,236 534,242 526,238" fill="#003366" />
              {/* Glare Specular Dot */}
              <circle cx="530" cy="235" r="1.5" fill="#FFFFFF" />
            </g>

            {/* Blue Inner Ear Accent Stripe */}
            <polygon points="405,100 395,125 415,125" fill="url(#esportsBlue)" />
          </g>

          {/* =========================================================================
              PART 2: OFFICIAL "DADASHMODE" ANGLED ESPORTS TYPOGRAPHY
              - "DADASH" in distressed WHITE
              - "MODE" in VIBRANT ELECTRIC BLUE (#00A3FF)
              - UNDERLINE BLUE LIGHTNING SLASH
             ========================================================================= */}
          <g transform="translate(140, 420) rotate(-7) skewX(-14)">
            {/* 1. Heavy Black Background Shield / Border */}
            <path
              d="M -20 120 L 30 -10 L 460 -25 L 750 -40 L 780 40 L 700 80 L 450 115 L 390 160 L 80 170 Z"
              fill="#060911"
              stroke="#060911"
              strokeWidth="22"
              strokeLinejoin="round"
            />

            {/* 2. Underlying Electric Blue Lightning Slash Banner */}
            <polygon
              points="10,135 380,110 350,150 70,165"
              fill="url(#esportsBlue)"
              filter="url(#esportsGlow)"
            />
            <polygon
              points="380,105 730,70 690,110 390,135"
              fill="url(#esportsBlue)"
            />

            {/* 3. "DADASH" - BOLD DISTRESSED WHITE BRUSH */}
            <g>
              <text
                x="0"
                y="95"
                fontFamily="'Chakra Petch', 'Impact', 'Arial Black', sans-serif"
                fontSize="115"
                fontWeight="900"
                letterSpacing="2"
                fill="#FFFFFF"
                stroke="#060911"
                strokeWidth="6"
                strokeLinejoin="bevel"
              >
                DADASH
              </text>

              {/* Distressed Slashed White Details on DADASH */}
              <path
                d="M 15 50 L 380 20 L 375 25 L 10 56 Z"
                fill="#060911"
                opacity="0.9"
              />
              <path
                d="M 35 75 L 340 55 L 335 60 L 30 81 Z"
                fill="#060911"
                opacity="0.8"
              />
              <path
                d="M 60 92 L 280 78 L 275 82 L 55 96 Z"
                fill="#060911"
                opacity="0.8"
              />
            </g>

            {/* 4. "MODE" - SOLID ELECTRIC BLUE (EXACT CHANNEL BRANDING) */}
            <g filter="url(#esportsGlow)">
              <text
                x="445"
                y="95"
                fontFamily="'Chakra Petch', 'Impact', 'Arial Black', sans-serif"
                fontSize="115"
                fontWeight="900"
                letterSpacing="2"
                fill="url(#esportsBlue)"
                stroke="#060911"
                strokeWidth="6"
                strokeLinejoin="bevel"
              >
                MODE
              </text>
            </g>

            {/* Top Light Accent on "MODE" */}
            <text
              x="445"
              y="95"
              fontFamily="'Chakra Petch', 'Impact', 'Arial Black', sans-serif"
              fontSize="115"
              fontWeight="900"
              letterSpacing="2"
              fill="none"
              stroke="#E0FFFF"
              strokeWidth="2"
              strokeLinejoin="bevel"
              opacity="0.6"
            >
              MODE
            </text>
          </g>
        </svg>

        {showSubtitle && (
          <div className="mt-2 flex items-center gap-2">
            <span className="font-mono text-xs font-black tracking-widest text-cyan-300 uppercase px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,163,255,0.4)]">
              OFFICIAL YOUTUBE CHANNEL MASCOT
            </span>
          </div>
        )}
      </div>
    );
  }

  // --- COMPACT ICON / BADGE VARIANT (For HUDs, Headers, Cards) ---
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }}
    >
      {/* Outer Pulse Glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-75 bg-gradient-to-tr from-[#00E5FF] via-[#00A3FF] to-[#0055FF] animate-pulse"
          style={{ transform: 'scale(1.2)' }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_2px_10px_rgba(0,163,255,0.7)]"
      >
        <defs>
          <linearGradient id="iconEsportsBlue" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#00A3FF" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>
        </defs>

        {/* Outer Hex Frame (If badge) */}
        {variant === 'badge' ? (
          <polygon
            points="50,3 94,25 94,75 50,97 6,75 6,25"
            fill="#060911"
            stroke="url(#iconEsportsBlue)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        ) : (
          /* Heavy Outer Black Contour */
          <path
            d="M 16 66 L 24 54 L 18 44 L 28 34 L 24 24 L 40 16 L 48 22 L 56 12 L 62 20 L 74 26 L 86 36 L 94 48 L 86 54 L 88 62 L 76 62 L 70 70 L 56 66 L 46 76 L 34 72 Z"
            fill="#060911"
            stroke="#060911"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        )}

        {/* Blue Mane Spines */}
        <polygon points="24,24 40,16 34,28" fill="url(#iconEsportsBlue)" />
        <polygon points="18,44 28,34 24,46" fill="url(#iconEsportsBlue)" />
        <polygon points="16,66 24,54 22,66" fill="url(#iconEsportsBlue)" />
        <polygon points="56,12 52,22 62,20" fill="url(#iconEsportsBlue)" />
        <polygon points="56,66 66,60 62,70" fill="url(#iconEsportsBlue)" />

        {/* Black Body Fur */}
        <polygon points="26,62 34,30 46,24 54,20 64,28 72,36 66,44 56,40 50,48 42,56" fill="#111622" />

        {/* Gray Fur Transition */}
        <polygon points="46,24 56,32 64,30 54,40 44,36" fill="#7E8B9B" />
        <polygon points="50,44 60,46 64,42 56,52 46,50" fill="#7E8B9B" />

        {/* White Snout, Cheek & Ear */}
        <polygon points="54,16 50,22 58,21" fill="#FFFFFF" />
        <polygon points="64,28 74,32 78,38 72,42 66,40" fill="#FFFFFF" />
        <polygon points="74,32 82,34 90,44 86,46 78,42" fill="#FFFFFF" />
        <polygon points="70,52 76,56 82,54 78,60 70,58" fill="#FFFFFF" />

        {/* Black Nose */}
        <polygon points="88,42 93,45 90,48 87,46" fill="#060911" />

        {/* Mouth Void & Cyan Tongue */}
        <polygon points="85,46 76,46 72,50 78,54 84,52" fill="#070A10" />
        <polygon points="76,49 80,48 81,52 76,52" fill="url(#iconEsportsBlue)" />

        {/* White Fangs */}
        <polygon points="86,46 84,52 82,47" fill="#FFFFFF" />
        <polygon points="80,52 78,48 76,52" fill="#FFFFFF" />

        {/* Glowing Cyan Eye */}
        <polygon points="68,34 74,36 71,40 66,38" fill="#060911" />
        <polygon points="69,35 73,37 71,39 67,37" fill="#00E5FF" />
        <circle cx="70" cy="36.5" r="0.8" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
