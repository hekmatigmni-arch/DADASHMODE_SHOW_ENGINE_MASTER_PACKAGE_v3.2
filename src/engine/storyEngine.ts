/**
 * DADASHMODE SHOW ENGINE - STORY & SCENARIO ENGINE
 * 
 * Reusable system for managing episodes, director books, and competition scripts.
 * Allows importing new episodes dynamically via JSON or formatted script text
 * without modifying application code.
 */

import { GameRound } from '../types/game';

export interface EpisodeScenario {
  id: string;
  episodeNumber: number;
  title: string;
  persianTitle: string;
  tagline: string;
  theme: 'LIQUID_NEON_WOLF' | 'GOLDEN_VAULT' | 'CYBERPUNK_ARENA' | 'CHROMA_CLEAN';
  rounds: GameRound[];
  openingVoicePrompt: string;
  finalePrizes: string[];
  directorBook?: string;
  scenes?: Array<{ id: string; roundId: string; title: string; directions: string; dialogueIds?: string[] }>;
  dialogues?: Array<{ id: string; sceneId: string; speaker: string; text: string; emotion?: string; cue?: string }>;
}

export const BUILT_IN_EPISODES: EpisodeScenario[] = [
  {
    id: 'ep1_vault_of_seconds',
    episodeNumber: 1,
    title: 'The Vault of Seconds',
    persianTitle: 'خزانه ثانیه‌ها: نبرد اولین امتیاز',
    tagline: 'هر ثانیه طلاست — اولین دوئل رسمی الیاس و عماد',
    theme: 'LIQUID_NEON_WOLF',
    openingVoicePrompt: 'به داداش‌مد خوش آمدید! اولین نبرد الیاس و عماد در خزانه ثانیه‌ها آغاز می‌شود.',
    finalePrizes: ['کیف طلایی حاوی ۱۰۰۰ دلار', 'مدال گرگ افتخار'],
    rounds: [
      {
        id: 'r1_cup_tower',
        number: 1,
        title: 'Cup Tower Pyramid',
        persianTitle: 'برج لیوان',
        rule: 'Stack 10 cups in 1-2-3-4 order using one hand only. Must stand 2 seconds.',
        persianRule: '۱۰ لیوان • چیدمان ۱-۲-۳-۴ • فقط یک دست • ایستادن ۲ ثانیه کامل سرپا',
        defaultTimerSeconds: 30,
        rewardSeconds: 10,
        validationSeconds: 2,
      },
      {
        id: 'r2_distance_basket',
        number: 2,
        title: 'Choose the Distance',
        persianTitle: 'فاصله را انتخاب کن',
        rule: 'Lock your line: Green +5s, Yellow +10s, Red +20s. 3 attempts.',
        persianRule: 'سبز ۵+ | زرد ۱۰+ | قرمز ۲۰+ • قفل خط قبل از پرتاب اول • ۳ تلاش',
        defaultTimerSeconds: 45,
        rewardSeconds: 15,
      },
      {
        id: 'r3_mystery_bite',
        number: 3,
        title: 'Mystery Box Bite',
        persianTitle: 'لقمه مرموز',
        rule: '6 mystery boxes. Two contain +15s, one steals 5s, three are empty.',
        persianRule: '۶ جعبه مقوایی • دو جعبه ۱۵+ • یک دزدی ۵ ثانیه از حریف • سه پوچ',
        defaultTimerSeconds: 40,
        rewardSeconds: 15,
      },
      {
        id: 'r4_oven_mitts',
        number: 4,
        title: 'Oven Mitts & Wolf Emblem',
        persianTitle: 'دستکش فر و آرم گرگ',
        rule: 'Wear oven mitts, rip crate tape, assemble 4 wolf pieces, touch finish line.',
        persianRule: 'پوشیدن دستکش فر • بازکردن جعبه چسبی • چیدن ۴ قطعه آرم گرگ • لمس خط پایان',
        defaultTimerSeconds: 60,
        rewardSeconds: 15,
      },
      {
        id: 'r5_time_risk',
        number: 5,
        title: 'Time Risk Powers',
        persianTitle: 'حالت ریسک زمان',
        rule: 'Buy advantages with banked seconds or risk All-In Comeback.',
        persianRule: 'خرید راهنما، جان اضافه، کندسازی حریف، یا بازگشت همه‌یاهیچ (+۵۰ / -۳۰)',
        defaultTimerSeconds: 45,
        rewardSeconds: 25,
      },
      {
        id: 'r6_final_sequence',
        number: 6,
        title: 'The Final Sequence',
        persianTitle: 'توالی نهایی و رمز گاوصندوق',
        rule: '3 stages: Blindfold drawing, memory structure, logic deduction.',
        persianRule: 'مرحله ۱: نقاشی نابینا • مرحله ۲: ساخت از حافظه • مرحله ۳: رمز نهایی کیف طلایی',
        defaultTimerSeconds: 90,
        rewardSeconds: 50,
      },
    ],
  },
  {
    id: 'ep2_speed_reaction',
    episodeNumber: 2,
    title: 'High-Voltage Reaction Duel',
    persianTitle: 'دوئل ولتاژ بالا: جنگ صدم ثانیه‌ها',
    tagline: 'سرعت دست و تمرکز مطلق — مسابقه در چند میلی‌ثانیه رقم می‌خورد',
    theme: 'CYBERPUNK_ARENA',
    openingVoicePrompt: 'دوئل سرعتی و واکنشی داداش‌مد آغاز شد! تمرکز کنید و آماده باشید.',
    finalePrizes: ['کاپ سرعت داداش‌مد', 'کارت امتیاز طلایی'],
    rounds: [
      {
        id: 'ep2_r1',
        number: 1,
        title: 'First-to-Slam Reflexes',
        persianTitle: 'شلیک واکنش: لمس اول',
        rule: 'Watch the light. First to slam their button after the green light wins.',
        persianRule: 'صبر برای چراغ سبز • اولین لمس دکمه برنده است • خطای استارت = جریمه ۵ ثانیه',
        defaultTimerSeconds: 20,
        rewardSeconds: 10,
      },
      {
        id: 'ep2_r2',
        number: 2,
        title: 'Blind Memory Rebuild',
        persianTitle: 'بازسازی در تاریکی',
        rule: 'Look at the color pattern for 5 seconds, rebuild blindfolded.',
        persianRule: '۵ ثانیه نگاه به چیدمان رنگی • بازسازی کامل با چشمان بسته',
        defaultTimerSeconds: 45,
        rewardSeconds: 15,
      },
      {
        id: 'ep2_r3',
        number: 3,
        title: 'Precision Drop',
        persianTitle: 'پرتاب میلی‌متری',
        rule: 'Drop the ball into the cylinder from 1.5m height. 3 tries.',
        persianRule: 'رهاسازی توپ داخل استوانه از ارتفاع ۱.۵ متر • ۳ پرتاب مجاز',
        defaultTimerSeconds: 30,
        rewardSeconds: 20,
      },
      {
        id: 'ep2_r4',
        number: 4,
        title: 'The Vault Showdown',
        persianTitle: 'رمزگشایی پایانی',
        rule: 'Decrypt 3 digital combinations before the master clock expires.',
        persianRule: 'کشف ۳ رمز متوالی دیجیتال قبل از اتمام بانک زمان',
        defaultTimerSeconds: 60,
        rewardSeconds: 40,
      },
    ],
  },
  {
    id: 'ep3_giant_sabotage',
    episodeNumber: 3,
    title: 'Giant Sabotage Gauntlet',
    persianTitle: 'خرابکاری غول‌پیکر: انتقام رقیب',
    tagline: 'هر مرحله یک کارت خرابکاری به حریف تحمیل می‌شود',
    theme: 'GOLDEN_VAULT',
    openingVoicePrompt: 'اپیزود خرابکاری داداش‌مد! برنده هر چالش، حریف را فلج می‌کند.',
    finalePrizes: ['سکه طلای مسابقه', 'حذف مجازات'],
    rounds: [
      {
        id: 'ep3_r1',
        number: 1,
        title: 'Tower with Oversized Boxing Gloves',
        persianTitle: 'برج‌سازی با دستکش بوکس غول‌پیکر',
        rule: 'Build a 6-cup tower while wearing giant padded mittens.',
        persianRule: 'چیدن ۶ لیوان با دستکش‌های بادکنکی غول‌پیکر',
        defaultTimerSeconds: 45,
        rewardSeconds: 15,
      },
      {
        id: 'ep3_r2',
        number: 2,
        title: 'Sticky Tape Escape',
        persianTitle: 'فرار از چسب‌های ۵ سانتی',
        rule: 'Unwrap hands bound in tape and grab the buzzer.',
        persianRule: 'باز کردن دست‌های پیچیده شده با چسب پهن و زدن زنگ خطر',
        defaultTimerSeconds: 40,
        rewardSeconds: 20,
      },
      {
        id: 'ep3_r3',
        number: 3,
        title: 'The Golden Case Breach',
        persianTitle: 'نفوذ به کیف طلایی',
        rule: 'Final combination lock showdown using banked seconds.',
        persianRule: 'باز کردن قفل رمزی کیف طلایی با ثانیه‌های ذخیره شده',
        defaultTimerSeconds: 70,
        rewardSeconds: 40,
      },
    ],
  },
];

class StoryEngine {
  private currentEpisode: EpisodeScenario = BUILT_IN_EPISODES[0];
  private customEpisodes: EpisodeScenario[] = [];

  constructor() {
    this.loadPersistedEpisodes();
  }

  private loadPersistedEpisodes() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem('dadash_custom_episodes');
        if (raw) {
          this.customEpisodes = JSON.parse(raw);
        }
      }
    } catch {
      // Ignore
    }
  }

  public getEpisodes(): EpisodeScenario[] {
    return [...BUILT_IN_EPISODES, ...this.customEpisodes];
  }

  public getCurrentEpisode(): EpisodeScenario {
    return this.currentEpisode;
  }

  public setEpisode(id: string): EpisodeScenario | null {
    const ep = this.getEpisodes().find((e) => e.id === id);
    if (ep) {
      this.currentEpisode = ep;
      return ep;
    }
    return null;
  }

  /**
   * Import scenario from JSON or Markdown text
   */
  public importScenarioFromText(text: string): { success: boolean; episode?: EpisodeScenario; error?: string } {
    try {
      const trimmed = text.trim();
      if (trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed.title !== 'string' || !Array.isArray(parsed.rounds) || !parsed.rounds.length)
          return { success: false, error: 'JSON باید عنوان و دست‌کم یک راند معتبر داشته باشد.' };
        if (parsed.rounds.some((r: any) => !r.persianTitle || !r.persianRule || !Number.isFinite(Number(r.defaultTimerSeconds)) || Number(r.defaultTimerSeconds) <= 0))
          return { success: false, error: 'برای هر راند persianTitle، persianRule و defaultTimerSeconds مثبت الزامی است.' };
        if (parsed.scenes && (!Array.isArray(parsed.scenes) || parsed.scenes.some((s: any) => !s.id || !s.roundId || !s.title)))
          return { success: false, error: 'صحنه‌ها باید id، roundId و title داشته باشند.' };
        if (parsed.dialogues && (!Array.isArray(parsed.dialogues) || parsed.dialogues.some((d: any) => !d.id || !d.sceneId || !d.speaker || !d.text)))
          return { success: false, error: 'دیالوگ‌ها باید id، sceneId، speaker و text داشته باشند.' };
        const roundIds = new Set(parsed.rounds.map((r: any, idx: number) => r.id || `custom_r${idx + 1}`));
        const scenes = parsed.scenes || [];
        if (scenes.some((scene: any) => !roundIds.has(scene.roundId)))
          return { success: false, error: 'یک صحنه به راند ناموجود ارجاع می‌دهد.' };
        const sceneIds = new Set(scenes.map((scene: any) => scene.id));
        if ((parsed.dialogues || []).some((dialogue: any) => !sceneIds.has(dialogue.sceneId)))
          return { success: false, error: 'یک دیالوگ به صحنهٔ ناموجود ارجاع می‌دهد.' };
        const newEp: EpisodeScenario = {
          id: `ep_custom_${Date.now()}`,
          episodeNumber: this.getEpisodes().length + 1,
          title: parsed.title,
          persianTitle: parsed.persianTitle || parsed.title,
          tagline: parsed.tagline || 'سناریوی اختصاصی استودیو',
          theme: parsed.theme || 'LIQUID_NEON_WOLF',
          openingVoicePrompt: parsed.openingVoicePrompt || 'راند جدید شروع شد.',
          finalePrizes: parsed.finalePrizes || ['جایزه طلایی مسابقه'],
          directorBook: typeof parsed.directorBook === 'string' ? parsed.directorBook : '',
          scenes,
          dialogues: parsed.dialogues || [],
          rounds: parsed.rounds.map((r: any, idx: number) => ({
            id: r.id || `custom_r${idx + 1}`,
            number: idx + 1,
            title: r.title || `Round ${idx + 1}`,
            persianTitle: r.persianTitle || `راند ${idx + 1}`,
            rule: r.rule || 'Complete the challenge.',
            persianRule: r.persianRule || 'قانون این راند را رعایت کنید.',
            defaultTimerSeconds: Number(r.defaultTimerSeconds) || 30,
            rewardSeconds: Number(r.rewardSeconds) || 10,
          })),
        };

        this.customEpisodes.push(newEp);
        this.currentEpisode = newEp;
        this.saveCustomEpisodes();
        return { success: true, episode: newEp };
      }

      // Markdown parser fallback
      const lines = trimmed.split('\n');
      let title = 'سناریوی جدید';
      const extractedRounds: GameRound[] = [];
      let currentRoundObj: Partial<GameRound> | null = null;

      for (const line of lines) {
        if (line.startsWith('# ')) {
          title = line.replace('# ', '').trim();
        } else if (line.startsWith('## Round') || line.startsWith('## راند')) {
          if (currentRoundObj) {
            extractedRounds.push(currentRoundObj as GameRound);
          }
          currentRoundObj = {
            id: `md_round_${extractedRounds.length + 1}`,
            number: extractedRounds.length + 1,
            title: line.replace('##', '').trim(),
            persianTitle: line.replace('##', '').trim(),
            rule: 'Perform round challenge',
            persianRule: 'توضیحات استخراج شده از فیلمنامه',
            defaultTimerSeconds: 30,
            rewardSeconds: 15,
          };
        } else if (currentRoundObj && line.includes('ثانیه')) {
          const numMatch = line.match(/\d+/);
          if (numMatch) {
            currentRoundObj.defaultTimerSeconds = parseInt(numMatch[0], 10);
          }
        }
      }

      if (currentRoundObj) {
        extractedRounds.push(currentRoundObj as GameRound);
      }

      if (extractedRounds.length === 0) {
        return { success: false, error: 'هیچ راندی در متن اسکریپت یافت نشد.' };
      }

      const newEp: EpisodeScenario = {
        id: `ep_custom_${Date.now()}`,
        episodeNumber: this.getEpisodes().length + 1,
        title,
        persianTitle: title,
        tagline: 'استخراج مستقیم از فیلمنامه کارگردان',
        theme: 'LIQUID_NEON_WOLF',
        openingVoicePrompt: 'سناریوی جدید بارگذاری شد. شروع مسابقه!',
        finalePrizes: ['کیف نهایی'],
        directorBook: trimmed,
        rounds: extractedRounds,
      };

      this.customEpisodes.push(newEp);
      this.currentEpisode = newEp;
      this.saveCustomEpisodes();
      return { success: true, episode: newEp };
    } catch (err: any) {
      return { success: false, error: err?.message || 'خطا در خواندن فایل سناریو' };
    }
  }

  private saveCustomEpisodes() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('dadash_custom_episodes', JSON.stringify(this.customEpisodes));
      }
    } catch {
      // Ignore
    }
  }
}

export const storyEngine = new StoryEngine();
