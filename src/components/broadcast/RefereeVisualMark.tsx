import React from 'react';
import { BroadcastAiState } from '../../types/game';

interface RefereeVisualMarkProps {
  state: BroadcastAiState;
  size?: number;
  className?: string;
}

/**
 * DADASHMODE REFINED AI REFEREE VISUAL CHARACTER MARK (Patch 2.3)
 * Abstract digital referee with gold/white base and state halos:
 * - LISTENING = teal pulse
 * - THINKING = gold segmented ring
 * - SPEAKING = waveform
 * - REVIEW = amber scan
 * - OFFLINE = muted broken-link
 */
export const RefereeVisualMark: React.FC<RefereeVisualMarkProps> = ({
  state,
  size = 46,
  className = '',
}) => {
  const isSpeaking = state === 'SPEAKING';
  const isThinking = state === 'THINKING';
  const isListening = state === 'LISTENING';
  const isReview = state === 'REVIEW';
  const isOffline = state === 'OFFLINE';

  const accentColor = isReview
    ? '#FFB000'
    : isListening
    ? '#00C98D'
    : isOffline
    ? '#777777'
    : '#FFC400'; // Gold base for IDLE, SPEAKING, THINKING

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label={`AI Referee Visual Mark: ${state}`}
    >
      {/* 1. STATE HALOS */}
      {/* LISTENING: Teal Pulse Halo */}
      {isListening && (
        <span
          className="absolute -inset-1 rounded-full border-2 border-[#00C98D] opacity-75 animate-ping pointer-events-none"
          style={{ animationDuration: '1.2s' }}
        />
      )}

      {/* THINKING: Gold Segmented Ring Halo */}
      {isThinking && (
        <svg
          className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] animate-spin pointer-events-none"
          style={{ animationDuration: '2.4s' }}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#FFC400"
            strokeWidth="3.5"
            strokeDasharray="22 14 34 14"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* REVIEW: Amber Scanning Aura */}
      {isReview && (
        <span
          className="absolute -inset-1 rounded-full border-2 border-[#FFB000] opacity-90 animate-pulse pointer-events-none shadow-[0_0_12px_rgba(255,176,0,0.6)]"
          style={{ animationDuration: '0.8s' }}
        />
      )}

      {/* 2. CORE DIGITAL REFEREE EMBLEM (Gold/White Base) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-md"
      >
        {/* Outer Hex Shield with dark core & gold/accent border */}
        <polygon
          points="32,3 58,16 58,48 32,61 6,48 6,16"
          fill="#0D0D0D"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner subtle bevel line */}
        <polygon
          points="32,6 54,18 54,46 32,58 10,46 10,18"
          fill="#141414"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeOpacity="0.25"
        />

        {/* Stylized Referee Cap & Forehead (White/Gold Contour) */}
        <path
          d="M20 22C20 14.5 25.5 11 32 11C38.5 11 44 14.5 44 22L45 27C43 31.5 39 34.5 32 34.5C25 34.5 21 31.5 19 27L20 22Z"
          fill="#1C1C1C"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* Cap Visor Peak Peak Line */}
        <path
          d="M21 21C26 23 38 23 43 21"
          stroke="#FFC400"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Digital Referee Eye Visor */}
        <polygon
          points="23,25 41,25 39,29.5 25,29.5"
          fill={accentColor}
          fillOpacity={isOffline ? 0.3 : 0.95}
        />

        {/* Sharp Jawline / Face Profile */}
        <path
          d="M24.5 28C24.5 33.5 27.5 39.5 32 42C36.5 39.5 39.5 33.5 39.5 28"
          stroke={accentColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Referee Headset Boom & Microphone */}
        <path
          d="M42 22C44.5 22 46.5 24 46.5 27V30C46.5 32 44.5 34 42 34"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Boom extending towards mouth */}
        <path
          d="M44.5 31.5L38.5 36.5H35"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="33.5" cy="36.5" r="2.2" fill={accentColor} />

        {/* Referee Official Stripes on Collar */}
        <path d="M22 46L20 53" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M28 47.5L27 55" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M32 48.5L32 56.5" stroke="#FFC400" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M36 47.5L37 55" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M42 46L44 53" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />

        {/* 3. SPEAKING: Waveform overlay */}
        {isSpeaking && (
          <g transform="translate(19, 18)">
            <rect x="0" y="3" width="2" height="12" rx="1" fill="#FFFFFF" className="animate-pulse" style={{ animationDuration: '280ms' }} />
            <rect x="5" y="0.5" width="2" height="17" rx="1" fill="#FFC400" className="animate-pulse" style={{ animationDuration: '400ms' }} />
            <rect x="19" y="0.5" width="2" height="17" rx="1" fill="#FFC400" className="animate-pulse" style={{ animationDuration: '400ms' }} />
            <rect x="24" y="3" width="2" height="12" rx="1" fill="#FFFFFF" className="animate-pulse" style={{ animationDuration: '280ms' }} />
          </g>
        )}

        {/* 4. REVIEW: Amber Scanline */}
        {isReview && (
          <g>
            <line x1="10" y1="27" x2="54" y2="27" stroke="#FFB000" strokeWidth="2.5" className="animate-review-scan" />
            <circle cx="32" cy="14" r="2.8" fill="#FFB000" className="animate-ping" style={{ animationDuration: '900ms' }} />
          </g>
        )}

        {/* 5. OFFLINE: Muted Broken-link slash */}
        {isOffline && (
          <line
            x1="12"
            y1="52"
            x2="52"
            y2="12"
            stroke="#888888"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
        )}
      </svg>
    </div>
  );
};
