/**
 * DADASHMODE SHOW ENGINE - THEME & BROADCAST AESTHETICS ENGINE
 * 
 * Manages episode visual packages, fonts, colorways, and strict Chroma-Safety.
 * Guarantees that #FF00FF is never used in UI elements.
 */

export type ThemeId = 'LIQUID_NEON_WOLF' | 'GOLDEN_VAULT' | 'CYBERPUNK_ARENA' | 'CHROMA_CLEAN';

export interface EpisodeThemeConfig {
  id: ThemeId;
  name: string;
  persianName: string;
  description: string;
  backgroundClass: string;
  cardGlassClass: string;
  primaryAccent: string;
  secondaryAccent: string;
  eliasAccent: string;
  emadAccent: string;
  timerGlowColor: string;
  fontFamily: string;
}

export const THEME_CONFIGS: Record<ThemeId, EpisodeThemeConfig> = {
  LIQUID_NEON_WOLF: {
    id: 'LIQUID_NEON_WOLF',
    name: 'Liquid Neon Wolf',
    persianName: 'گرگ نئونی (طراحی شیشه‌ای مایع)',
    description: 'تم رسمی استودیو با رنگ‌های عمیق مشکی، هایلایت‌های سرخ الیاس و زمردی عماد',
    backgroundClass: 'bg-gradient-to-br from-[#07090e] via-[#050608] to-[#0a0d16]',
    cardGlassClass: 'bg-neutral-900/80 backdrop-blur-2xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]',
    primaryAccent: '#00F0FF',
    secondaryAccent: '#FFB800',
    eliasAccent: '#FF2738',
    emadAccent: '#00C98D',
    timerGlowColor: 'rgba(0, 240, 255, 0.4)',
    fontFamily: 'Chakra Petch, Vazirmatn',
  },
  GOLDEN_VAULT: {
    id: 'GOLDEN_VAULT',
    name: 'Golden Vault',
    persianName: 'گاوصندوق طلایی (چالش فینال)',
    description: 'حس لوکس مسابقات تلویزیونی با بردرهای طلایی مات، افکت‌های فلزی و زنگ‌های کریستالی',
    backgroundClass: 'bg-gradient-to-br from-[#120e06] via-[#080704] to-[#1a1408]',
    cardGlassClass: 'bg-neutral-900/90 backdrop-blur-2xl border-amber-500/40 shadow-[0_12px_40px_rgba(245,158,11,0.2)]',
    primaryAccent: '#F59E0B',
    secondaryAccent: '#D97706',
    eliasAccent: '#EF4444',
    emadAccent: '#10B981',
    timerGlowColor: 'rgba(245, 158, 11, 0.5)',
    fontFamily: 'Chakra Petch, Vazirmatn',
  },
  CYBERPUNK_ARENA: {
    id: 'CYBERPUNK_ARENA',
    name: 'Cyberpunk Arena',
    persianName: 'آرنای سایبرپانک (دوئل سرعتی)',
    description: 'کنتراست فوق‌العاده بالا، فونت‌های دیجیتال نظامی و پالس‌های ریتمیک',
    backgroundClass: 'bg-gradient-to-br from-[#030712] via-[#0b0f19] to-[#050814]',
    cardGlassClass: 'bg-neutral-950/90 backdrop-blur-2xl border-cyan-500/50 shadow-[0_12px_40px_rgba(6,182,212,0.25)]',
    primaryAccent: '#06B6D4',
    secondaryAccent: '#8B5CF6',
    eliasAccent: '#FF1744',
    emadAccent: '#00E676',
    timerGlowColor: 'rgba(6, 182, 212, 0.6)',
    fontFamily: 'Chakra Petch, Vazirmatn',
  },
  CHROMA_CLEAN: {
    id: 'CHROMA_CLEAN',
    name: 'Chroma Clean HUD',
    persianName: 'اوورلی شفاف مخصوص OBS و پریمیر',
    description: 'بدون پس‌زمینه مات؛ مناسب برای همپوشانی مستقیم روی ویدیوی دوربین با کانال آلفا',
    backgroundClass: 'bg-transparent',
    cardGlassClass: 'bg-black/80 backdrop-blur-md border-white/20 shadow-2xl',
    primaryAccent: '#38BDF8',
    secondaryAccent: '#FBBF24',
    eliasAccent: '#FF2738',
    emadAccent: '#00C98D',
    timerGlowColor: 'rgba(56, 189, 248, 0.5)',
    fontFamily: 'Chakra Petch, Vazirmatn',
  },
};

class ThemeEngine {
  private activeTheme: ThemeId = 'LIQUID_NEON_WOLF';
  private listeners: Set<(theme: EpisodeThemeConfig) => void> = new Set();

  constructor() {
    this.loadPersistedTheme();
  }

  private loadPersistedTheme() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('dadash_active_theme') as ThemeId;
        if (saved && THEME_CONFIGS[saved]) {
          this.activeTheme = saved;
        }
      }
    } catch {
      // Ignore
    }
  }

  public getActiveTheme(): EpisodeThemeConfig {
    return THEME_CONFIGS[this.activeTheme];
  }

  public setTheme(themeId: ThemeId) {
    if (THEME_CONFIGS[themeId]) {
      this.activeTheme = themeId;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('dadash_active_theme', themeId);
        }
      } catch {
        // Ignore
      }
      this.notifyListeners();
    }
  }

  public subscribe(listener: (theme: EpisodeThemeConfig) => void): () => void {
    this.listeners.add(listener);
    listener(this.getActiveTheme());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const config = this.getActiveTheme();
    this.listeners.forEach((fn) => fn(config));
  }

  /**
   * Chroma Safety Guard: Never allow #FF00FF (pure key magenta)
   */
  public isChromaSafe(color: string): boolean {
    const normalized = color.toLowerCase().trim();
    return normalized !== '#ff00ff' && normalized !== 'rgb(255, 0, 255)' && normalized !== 'rgb(255,0,255)';
  }
}

export const themeEngine = new ThemeEngine();
