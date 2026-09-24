/**
 * DADASHMODE FEATURE MANAGER (MODULE 11)
 *
 * Central registry to enable, disable, and archive modules.
 * Inactive modules are kept safe in code, never deleted.
 */

export interface SystemModule {
  id: string;
  name: string;
  persianName: string;
  category: 'CORE' | 'GRAPHICS' | 'AUDIO' | 'LEGACY';
  enabled: boolean;
  description: string;
}

export const INITIAL_MODULES: SystemModule[] = [
  {
    id: 'audience_liquid_glass',
    name: 'Liquid Glass Audience Display',
    persianName: 'نمایشگر شیشه‌ای مایع تماشاگر',
    category: 'GRAPHICS',
    enabled: true,
    description: 'خروجی اصلی و ضبط مسابقه با گرافیک مسابقات بین‌المللی',
  },
  {
    id: 'director_live_monitor',
    name: 'Director Live Output Monitor',
    persianName: 'مانیتور زنده کارگردان',
    category: 'CORE',
    enabled: true,
    description: 'پیش‌نمایش زنده خروجی گوشی و دوربین در اتاق فرمان',
  },
  {
    id: 'player_reaction_buttons',
    name: 'Player Physical Reaction Buttons',
    persianName: 'کلیدهای فیزیکی ۳ بعدی الیاس و عماد',
    category: 'CORE',
    enabled: true,
    description: 'شمارش صدم ثانیه و تشخیص برنده واکنش دست',
  },
  {
    id: 'voice_cue_engine',
    name: 'Persian Female Voice Director',
    persianName: 'موتور صدای زنانه فارسی داور',
    category: 'AUDIO',
    enabled: true,
    description: 'اجرای دقیق اسکریپت با صدای Kore و Aoede با کش محلی آفلاین',
  },
  {
    id: 'story_scenario_importer',
    name: 'Story & Scenario Engine',
    persianName: 'موتور ورود اسکریپت و سناریو',
    category: 'CORE',
    enabled: true,
    description: 'قابلیت استفاده مجدد در اپیزودهای آینده با ورود فایل فیلمنامه',
  },
  {
    id: 'broadcast_recorder',
    name: 'Clean Broadcast Recorder',
    persianName: 'سیستم ضبط تمیز بدون میکروفون بازیکن',
    category: 'CORE',
    enabled: true,
    description: 'ضبط بومرنگی ویدیوی مسابقه برای یوتیوب با کیفیت بالا',
  },
  {
    id: 'rehearsal_mode',
    name: 'Show Rehearsal Mode',
    persianName: 'حالت تمرین و تست تجهیزات قبل از ضبط',
    category: 'CORE',
    enabled: true,
    description: 'تست تایمر، صداها و چراغ‌ها بدون ذخیره در دفترچه رسمی',
  },
  {
    id: 'legacy_rule_cards',
    name: 'Legacy Text Rule Cards',
    persianName: 'کارت‌های متنی قوانین قدیمی (آرشیو)',
    category: 'LEGACY',
    enabled: false,
    description: 'پنل‌های توضیحات متنی اولیه — غیرفعال در آرشیو',
  },
  {
    id: 'legacy_hud_counters',
    name: 'Legacy HUD Counters',
    persianName: 'شمارنده‌های تکراری قدیمی (آرشیو)',
    category: 'LEGACY',
    enabled: false,
    description: 'المان‌های نمایش قدیمی قبل از ادغام شیشه‌ای مایع',
  },
];

class FeatureManager {
  private modules: SystemModule[] = [];

  constructor() {
    this.loadModules();
  }

  private loadModules() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem('dadash_feature_modules');
        if (raw) {
          this.modules = JSON.parse(raw);
          return;
        }
      }
    } catch {
      // Ignore
    }
    this.modules = [...INITIAL_MODULES];
  }

  public getModules(): SystemModule[] {
    return this.modules;
  }

  public isEnabled(id: string): boolean {
    const mod = this.modules.find((m) => m.id === id);
    return mod ? mod.enabled : true;
  }

  public toggleModule(id: string, enabled?: boolean) {
    const mod = this.modules.find((m) => m.id === id);
    if (mod) {
      mod.enabled = typeof enabled === 'boolean' ? enabled : !mod.enabled;
      this.persist();
    }
  }

  private persist() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('dadash_feature_modules', JSON.stringify(this.modules));
      }
    } catch {
      // Ignore
    }
  }
}

export const featureManager = new FeatureManager();
