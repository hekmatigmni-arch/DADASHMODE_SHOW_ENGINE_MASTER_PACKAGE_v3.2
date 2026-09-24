/**
 * DADASHMODE SHOW ENGINE - PRODUCTION MODULE MANAGER
 * 
 * Manages active production modules vs inactive legacy components.
 * Inactive modules are disabled by default to eliminate clutter,
 * but preserved and imported in inactiveModules.ts (conforming to Rule 9).
 */

export type ModuleCategory = 
  | 'AUDIENCE_DISPLAY' 
  | 'GAME_ENGINE' 
  | 'DIRECTOR_CONTROL_ROOM' 
  | 'VOICE_ENGINE' 
  | 'VFX_SFX_ENGINE'
  | 'INACTIVE_LEGACY';

export interface ShowModule {
  id: string;
  name: string;
  persianName: string;
  category: ModuleCategory;
  priority: number;
  isActive: boolean;
  description: string;
}

export const SHOW_MODULES_REGISTRY: Record<string, ShowModule> = {
  // PRIORITY 1: AUDIENCE DISPLAY
  audience_display: {
    id: 'audience_display',
    name: 'Audience Display',
    persianName: 'نمایشگر تماشاگران و شرکت‌کنندگان',
    category: 'AUDIENCE_DISPLAY',
    priority: 1,
    isActive: true,
    description: 'خروجی‌های حرفه‌ای شامل صفحه گوشی شرکت‌کنندگان، اورلی شفاف ۱۶:۹ و صحنه کامل برودکست',
  },

  // PRIORITY 2: GAME ENGINE
  game_engine: {
    id: 'game_engine',
    name: 'Game Engine',
    persianName: 'موتور قوانین و بانک زمان',
    category: 'GAME_ENGINE',
    priority: 2,
    isActive: true,
    description: 'تایمر قطعی بر پایه performance.now()، محاسبه دقیق ثانیه‌ها بدون کانترهای جعلی، ژورنال رخدادها',
  },

  // PRIORITY 3: DIRECTOR CONTROL ROOM
  director_control_room: {
    id: 'director_control_room',
    name: 'Director Control Room',
    persianName: 'اتاق فرمان کارگردان',
    category: 'DIRECTOR_CONTROL_ROOM',
    priority: 3,
    isActive: true,
    description: 'پیش‌نمایش زنده خروجی گوشی/دوربین و دکمه‌های بزرگ تولید (START, STOP, PAUSE, RESET, NEXT)',
  },

  // PRIORITY 4: VOICE ENGINE
  voice_engine: {
    id: 'voice_engine',
    name: 'Voice Engine',
    persianName: 'موتور اعلان صوتی زنانه',
    category: 'VOICE_ENGINE',
    priority: 4,
    isActive: true,
    description: 'سیستم فرمان‌های صوتی واقعی با انتخاب صدای زنانه، احساسات، سرعت، مکث، پیش‌نمایش و ذخیره',
  },

  // PRIORITY 5: VFX/SFX ENGINE
  vfx_sfx_engine: {
    id: 'vfx_sfx_engine',
    name: 'VFX / SFX Engine',
    persianName: 'موتور افکت‌های صوتی و تصویری',
    category: 'VFX_SFX_ENGINE',
    priority: 5,
    isActive: true,
    description: 'سنتز صوت وب آدیو (سوت، بوق، چایم)، انیمیشن‌های سینمایی و افکت‌های چالش یوتیوب',
  },

  // INACTIVE / DISABLED MODULES (Preserved, not deleted)
  old_text_explainer: {
    id: 'old_text_explainer',
    name: 'Old Text Explainer Panels',
    persianName: 'پنل‌های توضیحی متنی قدیمی',
    category: 'INACTIVE_LEGACY',
    priority: 99,
    isActive: false,
    description: 'مودال‌ها و پنل‌های متنی طولانی غیرضروری در حین اجرای زنده',
  },

  unused_rule_cards: {
    id: 'unused_rule_cards',
    name: 'Unused Rule Cards',
    persianName: 'کارت‌های قوانین استفاده‌نشده',
    category: 'INACTIVE_LEGACY',
    priority: 99,
    isActive: false,
    description: 'کارت‌ها و چیپ‌های متنی تکراری در برودکست',
  },

  duplicate_hud_elements: {
    id: 'duplicate_hud_elements',
    name: 'Duplicate HUD Elements',
    persianName: 'المان‌های تکراری HUD',
    category: 'INACTIVE_LEGACY',
    priority: 99,
    isActive: false,
    description: 'نوارهای تست دود و دکمه‌های کنترلی تکراری',
  },

  old_screens: {
    id: 'old_screens',
    name: 'Old Screens & Modals',
    persianName: 'صفحات و پنجره‌های قدیمی',
    category: 'INACTIVE_LEGACY',
    priority: 99,
    isActive: false,
    description: 'صفحات خروجی و لاگ‌های قدیمی که با ساختار جدید یکپارچه شده‌اند',
  },
};

class ModuleManager {
  private modules: Map<string, ShowModule> = new Map();

  constructor() {
    Object.values(SHOW_MODULES_REGISTRY).forEach((m) => {
      this.modules.set(m.id, { ...m });
    });
    this.loadState();
  }

  private loadState() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('dadashmode_modules_config');
      if (saved) {
        const parsed: Record<string, boolean> = JSON.parse(saved);
        Object.entries(parsed).forEach(([id, isActive]) => {
          const mod = this.modules.get(id);
          if (mod) mod.isActive = isActive;
        });
      }
    } catch {}
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      const stateObj: Record<string, boolean> = {};
      this.modules.forEach((mod, id) => {
        stateObj[id] = mod.isActive;
      });
      localStorage.setItem('dadashmode_modules_config', JSON.stringify(stateObj));
    } catch {}
  }

  public isModuleActive(id: string): boolean {
    return this.modules.get(id)?.isActive ?? false;
  }

  public setModuleActive(id: string, active: boolean) {
    const mod = this.modules.get(id);
    if (mod) {
      mod.isActive = active;
      this.saveState();
    }
  }

  public getAllModules(): ShowModule[] {
    return Array.from(this.modules.values());
  }

  public getActiveModules(): ShowModule[] {
    return Array.from(this.modules.values()).filter((m) => m.isActive);
  }

  public getInactiveModules(): ShowModule[] {
    return Array.from(this.modules.values()).filter((m) => !m.isActive);
  }

  public resetToDefault() {
    Object.values(SHOW_MODULES_REGISTRY).forEach((m) => {
      this.modules.set(m.id, { ...m });
    });
    this.saveState();
  }
}

export const moduleManager = new ModuleManager();
