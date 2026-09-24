import { PublicBroadcastState, PublicMysteryBoxItem } from '../types/game';

export type VisualQaStateKey =
  | 'ROUND_ACTIVE'
  | 'LAST_5_SEC'
  | 'REWARD'
  | 'PENALTY'
  | 'SABOTAGE'
  | 'MYSTERY'
  | 'REVIEW'
  | 'OFFLINE'
  | 'FINAL'
  | 'WINNER'
  | 'COMPACT_OVERLAY'
  | 'CHROMA_OVERLAY';

export interface VisualQaPresetConfig {
  key: VisualQaStateKey;
  label: string;
  persianLabel: string;
  description: string;
  defaultLayout?: 'FULL_PORTRAIT' | 'COMPACT_OVERLAY' | 'CHROMA_KEY';
  state: PublicBroadcastState;
}

const BASE_MOCK_PLAYERS = {
  ELIAS: {
    id: 'ELIAS' as const,
    name: 'ELIAS',
    persianName: 'الیاس',
    seconds: 35,
    color: 'red' as const,
    fouls: 0,
    iconType: 'triangle' as const,
    letterLabel: 'E' as const,
    lockedChoice: null,
  },
  EMAD: {
    id: 'EMAD' as const,
    name: 'EMAD',
    persianName: 'عماد',
    seconds: 40,
    color: 'green' as const,
    fouls: 0,
    iconType: 'circle' as const,
    letterLabel: 'M' as const,
    lockedChoice: null,
  },
};

const MOCK_MYSTERY_BOXES: PublicMysteryBoxItem[] = [
  { boxNumber: 1, isLocked: true, isRevealed: false, chosenBy: 'ELIAS', outcome: null },
  { boxNumber: 2, isLocked: false, isRevealed: true, chosenBy: 'EMAD', outcome: 'PLUS_15' },
  { boxNumber: 3, isLocked: false, isRevealed: false, chosenBy: null, outcome: null },
  { boxNumber: 4, isLocked: false, isRevealed: true, chosenBy: 'ELIAS', outcome: 'BLANK' },
  { boxNumber: 5, isLocked: false, isRevealed: true, chosenBy: 'EMAD', outcome: 'STEAL_5' },
  { boxNumber: 6, isLocked: false, isRevealed: false, chosenBy: null, outcome: null },
];

export const QA_MOCK_STATES: Record<VisualQaStateKey, PublicBroadcastState> = {
  // 1. ROUND ACTIVE
  ROUND_ACTIVE: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 1,
    totalRounds: 5,
    roundTitle: 'ONE-HAND CUP TOWER',
    roundPersianTitle: 'برج لیوان با یک دست',
    roundRule: '12 cups, strictly 1 hand, 2s balance validation',
    roundPersianRule: '۱۲ لیوان، فقط یک دست مجاز، ۲ ثانیه تعادل پایدار',
    rewardSeconds: 10,
    timer: {
      secondsRemaining: 24,
      isRunning: true,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: false,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 20 },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 20 },
    },
    aiState: 'LISTENING',
    review: { isUnderReview: false, reason: '', persianReason: '' },
    winner: null,
  },

  // 2. LAST 5 SEC (High tension pulsating countdown)
  LAST_5_SEC: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 2,
    totalRounds: 5,
    roundTitle: 'CHOOSE YOUR DISTANCE',
    roundPersianTitle: 'فاصله را انتخاب کن',
    roundRule: '3 basketball attempts from locked distance',
    roundPersianRule: '۳ پرتاب بسکتبال از فاصله قفل‌شده',
    rewardSeconds: 20,
    timer: {
      secondsRemaining: 4,
      isRunning: true,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: false,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 25, lockedChoice: 'RED (+20s)' },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 30, lockedChoice: 'YELLOW (+10s)' },
    },
    aiState: 'SPEAKING',
    review: { isUnderReview: false, reason: '', persianReason: '' },
    winner: null,
  },

  // 3. REWARD (+Time celebration banner)
  REWARD: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 1,
    totalRounds: 5,
    roundTitle: 'ONE-HAND CUP TOWER',
    roundPersianTitle: 'برج لیوان با یک دست',
    roundRule: '12 cups, strictly 1 hand',
    roundPersianRule: 'قبولی برج لیوان با یک دست',
    rewardSeconds: 10,
    timer: {
      secondsRemaining: 0,
      isRunning: false,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: false,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 30 },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 20 },
    },
    aiState: 'SPEAKING',
    review: { isUnderReview: false, reason: '', persianReason: '' },
    winner: null,
    latestAnnouncement: {
      text: 'SUCCESS: +10 SECONDS AWARDED TO ELIAS',
      type: 'reward',
      timestamp: Date.now(),
    },
  },

  // 4. PENALTY (-10s Risk penalty)
  PENALTY: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 5,
    totalRounds: 5,
    roundTitle: 'SAFE OR RISK',
    roundPersianTitle: 'امن یا ریسک (فینال)',
    roundRule: 'RISK failure deducts 10 seconds from time bank',
    roundPersianRule: 'شکست در حالت ریسک: ۱۰ ثانیه کسر از بانک زمان',
    rewardSeconds: 25,
    timer: {
      secondsRemaining: 0,
      isRunning: false,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: false,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 25, lockedChoice: 'RISK (شکست)' },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 45, lockedChoice: 'SAFE (موفق)' },
    },
    aiState: 'SPEAKING',
    review: { isUnderReview: false, reason: '', persianReason: '' },
    winner: null,
    latestAnnouncement: {
      text: 'PENALTY: -10 SECONDS DEDUCTED FROM ELIAS',
      type: 'penalty',
      timestamp: Date.now(),
    },
  },

  // 5. SABOTAGE (Big gloves or delay sabotage drawn)
  SABOTAGE: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 2,
    totalRounds: 5,
    roundTitle: 'CHOOSE YOUR DISTANCE',
    roundPersianTitle: 'فاصله را انتخاب کن',
    roundRule: 'Sabotage active: Big Boxing Gloves',
    roundPersianRule: 'خرابکاری فعال: دستکش‌های بوکس غول‌پیکر',
    rewardSeconds: 10,
    timer: {
      secondsRemaining: 18,
      isRunning: true,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: false,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 25 },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 20 },
    },
    aiState: 'SPEAKING',
    review: { isUnderReview: false, reason: '', persianReason: '' },
    winner: null,
    revealedSabotage: {
      title: 'BIG GLOVES',
      persianTitle: 'دستکش‌های غول‌پیکر 🥊',
      description: 'Must shoot basketball wearing giant foam gloves!',
      persianDescription: 'پرتاب‌ها باید با دستکش‌های غول‌پیکر بوکس انجام شوند!',
      target: 'EMAD',
      revealedAt: Date.now(),
    },
  },

  // 6. MYSTERY (Round 3 Mystery bite boxes)
  MYSTERY: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 3,
    totalRounds: 5,
    roundTitle: 'MYSTERY BITE',
    roundPersianTitle: 'لقمه مرموز',
    roundRule: '6 hidden boxes: 2x +15s, 1x Steal 5s, 3x Blank',
    roundPersianRule: '۶ جعبه شانسی: ۲ جعبه ۱۵+ ثانیه، ۱ جعبه دزدی ۵ ثانیه، ۳ پوچ',
    rewardSeconds: 15,
    timer: {
      secondsRemaining: 12,
      isRunning: true,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: false,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 35 },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 40 },
    },
    aiState: 'THINKING',
    review: { isUnderReview: false, reason: '', persianReason: '' },
    winner: null,
    mysteryBoxes: MOCK_MYSTERY_BOXES,
  },

  // 7. REVIEW (VAR Video Review Flash)
  REVIEW: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 1,
    totalRounds: 5,
    roundTitle: 'ONE-HAND CUP TOWER',
    roundPersianTitle: 'برج لیوان با یک دست',
    roundRule: 'Checking second hand assistance via VAR',
    roundPersianRule: 'بررسی استفاده احتمالی از دست دوم در بازبینی ویدیویی',
    rewardSeconds: 10,
    timer: {
      secondsRemaining: 8,
      isRunning: false,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: true,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 20 },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 20 },
    },
    aiState: 'REVIEW',
    review: {
      isUnderReview: true,
      reason: 'VAR check: verifying hand contact on 12th cup',
      persianReason: 'بازبینی داوری VAR: بررسی تماس دست دوم روی لیوان دوازدهم',
    },
    winner: null,
  },

  // 8. OFFLINE (Graceful degraded mode badge)
  OFFLINE: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 4,
    totalRounds: 5,
    roundTitle: 'TRIPLE OBSTACLE RELAY',
    roundPersianTitle: 'رله موانع سه‌گانه',
    roundRule: 'Local rule engine active',
    roundPersianRule: 'موتور محلی داوری فعال (هوش مصنوعی آفلاین)',
    rewardSeconds: 30,
    timer: {
      secondsRemaining: 45,
      isRunning: true,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: false,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 50 },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 45 },
    },
    aiState: 'OFFLINE',
    review: { isUnderReview: false, reason: '', persianReason: '' },
    winner: null,
  },

  // 9. FINAL (Round 5 Safe or Risk final show)
  FINAL: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 5,
    totalRounds: 5,
    roundTitle: 'SAFE OR RISK - FINAL SHOWDOWN',
    roundPersianTitle: 'امن یا ریسک — فینال بزرگ',
    roundRule: 'Final round decisions locked before attempt',
    roundPersianRule: 'انتخاب قفل شد: الیاس ریسک (+25/-10)، عماد امن (+8/0)',
    rewardSeconds: 25,
    timer: {
      secondsRemaining: 30,
      isRunning: true,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: false,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 55, lockedChoice: 'RISK (+25s)' },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 60, lockedChoice: 'SAFE (+8s)' },
    },
    aiState: 'SPEAKING',
    review: { isUnderReview: false, reason: '', persianReason: '' },
    winner: null,
  },

  // 10. WINNER (Final victory reveal)
  WINNER: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 5,
    totalRounds: 5,
    roundTitle: 'CHAMPION DECLARED',
    roundPersianTitle: 'قهرمان مسابقه مشخص شد',
    roundRule: 'Match finished',
    roundPersianRule: 'پایان ۵ راند چالش هیجانی',
    rewardSeconds: 0,
    timer: {
      secondsRemaining: 0,
      isRunning: false,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: false,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 80 },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 60 },
    },
    aiState: 'SPEAKING',
    review: { isUnderReview: false, reason: '', persianReason: '' },
    winner: 'ELIAS',
  },

  // 11. COMPACT OVERLAY (Overlay layout preset)
  COMPACT_OVERLAY: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 2,
    totalRounds: 5,
    roundTitle: 'CHOOSE YOUR DISTANCE',
    roundPersianTitle: 'فاصله را انتخاب کن',
    roundRule: '3 attempts from selected distance',
    roundPersianRule: '۳ پرتاب از فاصله انتخابی',
    rewardSeconds: 20,
    timer: {
      secondsRemaining: 15,
      isRunning: true,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: false,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 35 },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 40 },
    },
    aiState: 'LISTENING',
    review: { isUnderReview: false, reason: '', persianReason: '' },
    winner: null,
  },

  // 12. CHROMA OVERLAY (Keyed overlay preset for OBS)
  CHROMA_OVERLAY: {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: 2,
    totalRounds: 5,
    roundTitle: 'CHOOSE YOUR DISTANCE',
    roundPersianTitle: 'فاصله را انتخاب کن',
    roundRule: 'Broadcast Chroma Key Canvas for OBS',
    roundPersianRule: 'خروجی پرده کروماکی بدون کادر برای میکس OBS',
    rewardSeconds: 20,
    timer: {
      secondsRemaining: 15,
      isRunning: true,
      isValidationTimer: false,
      validationPlayer: null,
      isPaused: false,
    },
    players: {
      ELIAS: { ...BASE_MOCK_PLAYERS.ELIAS, seconds: 35 },
      EMAD: { ...BASE_MOCK_PLAYERS.EMAD, seconds: 40 },
    },
    aiState: 'LISTENING',
    review: { isUnderReview: false, reason: '', persianReason: '' },
    winner: null,
  },
};

export interface QaPresetButtonItem {
  key: VisualQaStateKey;
  label: string;
  persianLabel: string;
  category: 'core' | 'events' | 'layout';
}

export const QA_PRESET_BUTTONS: QaPresetButtonItem[] = [
  { key: 'ROUND_ACTIVE', label: 'ROUND ACTIVE', persianLabel: 'شروع راند', category: 'core' },
  { key: 'LAST_5_SEC', label: 'LAST 5 SEC', persianLabel: '۵ ثانیه پایانی', category: 'core' },
  { key: 'REWARD', label: 'REWARD', persianLabel: 'پاداش زمان (+10s)', category: 'events' },
  { key: 'PENALTY', label: 'PENALTY', persianLabel: 'جریمه زمان (-10s)', category: 'events' },
  { key: 'SABOTAGE', label: 'SABOTAGE', persianLabel: 'کارت خرابکاری', category: 'events' },
  { key: 'MYSTERY', label: 'MYSTERY', persianLabel: 'جعبه‌های مرموز (راند ۳)', category: 'events' },
  { key: 'REVIEW', label: 'REVIEW', persianLabel: 'بازبینی VAR', category: 'events' },
  { key: 'OFFLINE', label: 'OFFLINE', persianLabel: 'هوش مصنوعی آفلاین', category: 'core' },
  { key: 'FINAL', label: 'FINAL', persianLabel: 'راند فینال (امن/ریسک)', category: 'core' },
  { key: 'WINNER', label: 'WINNER', persianLabel: 'اعلام قهرمان', category: 'events' },
  { key: 'COMPACT_OVERLAY', label: 'COMPACT OVERLAY', persianLabel: 'کاور کوچک', category: 'layout' },
  { key: 'CHROMA_OVERLAY', label: 'CHROMA OVERLAY', persianLabel: 'پرده کروماکی', category: 'layout' },
];

export type QaViewportPreset = 'PORTRAIT_390_844' | 'COMPACT_560_320' | 'LANDSCAPE_1280_720' | 'RESPONSIVE';

export interface QaViewportDimension {
  id: QaViewportPreset;
  label: string;
  width: number | '100%';
  height: number | '100%';
  aspectRatioLabel: string;
  suggestedMode: 'FULL_PORTRAIT' | 'COMPACT_OVERLAY' | 'CHROMA_KEY';
}

export const QA_VIEWPORT_PRESETS: Record<QaViewportPreset, QaViewportDimension> = {
  PORTRAIT_390_844: {
    id: 'PORTRAIT_390_844',
    label: 'Portrait 390×844',
    width: 390,
    height: 844,
    aspectRatioLabel: '9:16 Mobile',
    suggestedMode: 'FULL_PORTRAIT',
  },
  COMPACT_560_320: {
    id: 'COMPACT_560_320',
    label: 'Compact 560×320',
    width: 560,
    height: 320,
    aspectRatioLabel: 'PIP Overlay',
    suggestedMode: 'COMPACT_OVERLAY',
  },
  LANDSCAPE_1280_720: {
    id: 'LANDSCAPE_1280_720',
    label: 'Landscape 1280×720',
    width: 1280,
    height: 720,
    aspectRatioLabel: '16:9 Broadcast',
    suggestedMode: 'FULL_PORTRAIT',
  },
  RESPONSIVE: {
    id: 'RESPONSIVE',
    label: 'Responsive Full',
    width: '100%',
    height: '100%',
    aspectRatioLabel: 'Full Screen',
    suggestedMode: 'FULL_PORTRAIT',
  },
};
