import { GameRound, MysteryBoxResult, SabotageResult, PlayerId, MysteryBoxItem, MysteryBiteOutcome } from '../types/game';

export const DEFAULT_ROUNDS: GameRound[] = [
  {
    id: 'round_1_cup_tower',
    number: 1,
    title: 'Round 1: One-Handed Cup Tower (10 Cups)',
    persianTitle: 'راند ۱: برج ۱۰ لیوان با یک دست',
    rule: '10 cups. 1-2-3-4 pyramid stack. One hand only. Second hand = foul! Tower must stand for 2 full seconds.',
    persianRule: '۱۰ لیوان • چیدمان ۱-۲-۳-۴ • فقط یک دست • استفاده از دست دوم = خطا • برج باید ۲ ثانیه کامل سرپا بماند (+۱۰ ثانیه جایزه)',
    defaultTimerSeconds: 30,
    rewardSeconds: 10,
    validationSeconds: 2,
  },
  {
    id: 'round_2_choose_distance',
    number: 2,
    title: 'Round 2: Choose Your Distance',
    persianTitle: 'راند ۲: فاصله را انتخاب کن',
    rule: 'Choose distance before 1st throw (GREEN=+5s, YELLOW=+10s, RED=+20s). 3 attempts. Locked choice cannot be changed! Unclear basket -> request_review()',
    persianRule: 'انتخاب فاصله قبل از اولین پرتاب (سبز: ۵+ ثانیه | زرد: ۱۰+ ثانیه | قرمز: ۲۰+ ثانیه) • ۳ پرتاب • بعد از Lock شدن غیرقابل تغییر است!',
    defaultTimerSeconds: 60,
    rewardSeconds: 10,
  },
  {
    id: 'round_3_mystery_bite',
    number: 3,
    title: 'Round 3: The Mystery Bite',
    persianTitle: 'راند ۳: لقمه مرموز (جعبه‌های ۱ تا ۶)',
    rule: 'Boxes 1-6. Two = +15s, One = STEAL 5s, Three = BLANK. Pick a box -> Lock -> Eat bite -> Reveal stored outcome! Referee never knows distribution.',
    persianRule: 'شش جعبه ۱ تا ۶ • دو تا ۱۵+ ثانیه • یکی دزدیدن ۵ ثانیه از حریف • سه تا خالی • داور هرگز توزیع را نمی‌داند',
    defaultTimerSeconds: 45,
    rewardSeconds: 15,
  },
  {
    id: 'round_4_obstacle_relay',
    number: 4,
    title: 'Round 4: Obstacle Relay (TARGET → CUP STACK → CODE PUZZLE → FINISH)',
    persianTitle: 'راند ۴: رله موانع سه‌گانه (TARGET → CUP STACK → CODE PUZZLE → FINISH)',
    rule: 'Sequential obstacles: 1. TARGET -> 2. CUP STACK -> 3. CODE PUZZLE -> 4. FINISH. First brother to hit the finish line wins +30 SEC.',
    persianRule: 'مراحل چالش به ترتیب: ۱. اصابت به سیبل (TARGET) • ۲. برج لیوان (CUP STACK) • ۳. پازل کد (CODE PUZZLE) • ۴. زنگ و خط پایان (FINISH) • برنده: ۳۰+ ثانیه جایزه',
    defaultTimerSeconds: 60,
    rewardSeconds: 30,
  },
  {
    id: 'round_5_safe_vs_risk',
    number: 5,
    title: 'Round 5: Safe vs Risk (SAFE vs RISK)',
    persianTitle: 'راند ۵: امن یا ریسک (SAFE vs RISK)',
    rule: 'Choose before start: SAFE (Success +8s, Fail 0s) or RISK (Success +25s, Fail -10s). Locked immediately! Referee says: "انتخاب قفل شد."',
    persianRule: 'انتخاب قبل از شروع: حالت امن (موفقیت ۸+ ثانیه، شکست ۰) یا حالت ریسک (موفقیت ۲۵+ ثانیه، شکست ۱۰- ثانیه) • بعد از انتخاب: «انتخاب قفل شد.»',
    defaultTimerSeconds: 45,
    rewardSeconds: 25,
  },
  {
    id: 'round_6_final_sequence',
    number: 6,
    title: 'Round 6: The Final Sequence & Golden Case',
    persianTitle: 'راند ۶: توالی نهایی و کیف طلایی',
    rule: '3 Stages, 3 Codes, 1 Golden Case: 1. Blind AI Drawing (Code 1) • 2. Memory Build (Code 2) • 3. Final Logic Challenge (Code 3) • 4. Open 3-Digit Golden Case!',
    persianRule: 'سه مرحله، سه رمز، یک کیف طلایی: ۱- نقاشی با چشم بسته (رمز ۱) • ۲- ساخت از حافظه (رمز ۲) • ۳- چالش منطق نهایی (رمز ۳) • ۴- باز کردن قفل سه‌رقمی کیف طلایی!',
    defaultTimerSeconds: 120,
    rewardSeconds: 50,
  },
];

export const MYSTERY_BOX_POOL = [
  {
    title: 'Golden Time Surge',
    persianTitle: 'طلای ناب داداش: +۱۰ ثانیه',
    description: 'Winner receives 10 bonus seconds added to their time bank!',
    persianDescription: '۱۰ ثانیه طلایی مستقیم به بانک زمان اضافه شد!',
    impactType: 'bonus_time' as const,
    timeValue: 10,
  },
  {
    title: 'Raw Onion with Hot Sriracha',
    persianTitle: 'گاز زدن پیاز خام با سس تند!',
    description: 'Player must take a bite of raw onion soaked in hot sauce without reacting.',
    persianDescription: 'باید یک گاز محکم از پیاز خام آغشته به سس تند بزنه بدون تغییر چهره!',
    impactType: 'taste_test' as const,
    timeValue: 0,
  },
  {
    title: 'Sour Lemon Juice Shot',
    persianTitle: 'شات آبلیموی خالص و نمک ترش',
    description: 'Down a full shot of pure lemon juice with sea salt in one gulp!',
    persianDescription: 'سر کشیدن یک استکان آبلیموی ترش خالص با نمک در یک نفس!',
    impactType: 'taste_test' as const,
    timeValue: 0,
  },
  {
    title: 'Time Drain Tax',
    persianTitle: 'مالیات داداشی: -۵ ثانیه',
    description: 'Deduct 5 seconds from the current player bank.',
    persianDescription: 'کسر ۵ ثانیه بی‌رحمانه از بانک زمان!',
    impactType: 'penalty_time' as const,
    timeValue: -5,
  },
  {
    title: 'Super Mustard Spoonful',
    persianTitle: 'قاشق پر از سس خردل تند دیژون',
    description: 'One big tablespoon of strong spicy mustard!',
    persianDescription: 'خوردن یک قاشق غذاخوری پر از سس خردل آتشین بدون آب!',
    impactType: 'taste_test' as const,
    timeValue: 0,
  },
  {
    title: 'Mega JackPot: +۱۵ Seconds',
    persianTitle: 'جک‌پات فوق‌العاده: +۱۵ ثانیه طلایی',
    description: 'Huge jackpot! 15 seconds added to the lucky brother!',
    persianDescription: 'شانس بزرگ! ۱۵ ثانیه طلایی مستقیم به حساب داداش خوش‌شانس رفت!',
    impactType: 'bonus_time' as const,
    timeValue: 15,
  },
  {
    title: 'Garlic Breath Challenge',
    persianTitle: 'سیر خام تند و تیز',
    description: 'Chew a raw garlic clove for 10 seconds.',
    persianDescription: 'جویدن یک حبه سیر خام تند به مدت ۱۰ ثانیه کامل!',
    impactType: 'taste_test' as const,
    timeValue: 0,
  },
];

export const SABOTAGE_POOL = [
  {
    id: 'big_gloves',
    title: 'BIG GLOVES',
    persianTitle: 'دستکش‌های غول‌پیکر (BIG GLOVES)',
    description: 'Player must wear oversized big gloves for the challenge!',
    persianDescription: 'بازیکن باید دستکش‌های غول‌پیکر و بزرگ دستش کند!',
    penaltySeconds: 0,
  },
  {
    id: '5_sec_delay',
    title: '5 SEC DELAY',
    persianTitle: '۵ ثانیه تأخیر (5 SEC DELAY)',
    description: 'Player must wait a 5-second delay before beginning their attempt!',
    persianDescription: 'بازیکن باید در ابتدای کار ۵ ثانیه تأخیر کامل داشته باشد و دیرتر شروع کند!',
    penaltySeconds: 5,
  },
  {
    id: 'only_2_attempts',
    title: 'ONLY 2 ATTEMPTS',
    persianTitle: 'فقط ۲ تلاش (ONLY 2 ATTEMPTS)',
    description: 'Player is restricted to only 2 attempts instead of 3!',
    persianDescription: 'فرصت بازیکن به جای ۳ بار، فقط به ۲ تلاش یا پرتاب محدود می‌شود!',
    penaltySeconds: 0,
  },
];

export function getRandomMysteryBox(): MysteryBoxResult {
  const randomIndex = Math.floor(Math.random() * MYSTERY_BOX_POOL.length);
  const item = MYSTERY_BOX_POOL[randomIndex];
  return {
    id: `box_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: item.title,
    persianTitle: item.persianTitle,
    description: item.description,
    persianDescription: item.persianDescription,
    impactType: item.impactType,
    timeValue: item.timeValue,
    revealedAt: Date.now(),
  };
}

export function getRandomSabotage(targetPlayer: PlayerId): SabotageResult {
  const randomIndex = Math.floor(Math.random() * SABOTAGE_POOL.length);
  const item = SABOTAGE_POOL[randomIndex];
  return {
    id: `sab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: item.title,
    persianTitle: item.persianTitle,
    description: item.description,
    persianDescription: item.persianDescription,
    target: targetPlayer,
    penaltySeconds: item.penaltySeconds,
    revealedAt: Date.now(),
  };
}

/**
 * ROUND 3: لقمه مرموز (Mystery Bite)
 * Exactly 6 boxes:
 * - two = +15 SEC
 * - one = STEAL 5 SEC
 * - three = BLANK
 * Shuffled locally - Gemini must NOT know or choose the distribution!
 */
export function generateRound3Boxes(): MysteryBoxItem[] {
  const pool: MysteryBiteOutcome[] = [
    'PLUS_15',
    'PLUS_15',
    'STEAL_5',
    'BLANK',
    'BLANK',
    'BLANK',
  ];

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.map((outcome, idx) => ({
    boxNumber: idx + 1,
    outcome,
    chosenBy: null,
    isLocked: false,
    isEaten: false,
    isRevealed: false,
  }));
}

/**
 * ROUND 5: فروشگاه قدرت زمان (TIME RISK POWER SHOP)
 * Three categories: HELP, ATTACK, RISK
 */
export interface TimePowerItem {
  id: string;
  category: 'HELP' | 'ATTACK' | 'RISK';
  name: string;
  persianName: string;
  costSeconds: number;
  effect: string;
  persianEffect: string;
  isComebackAllIn?: boolean;
}

export const TIME_POWER_ITEMS: TimePowerItem[] = [
  // HELP
  {
    id: 'HINT',
    category: 'HELP',
    name: 'HINT',
    persianName: 'راهنما (HINT)',
    costSeconds: 15,
    effect: 'AI Referee gives 1 hint',
    persianEffect: 'داور هوش مصنوعی یک راهنمایی به بازیکن می‌دهد',
  },
  {
    id: 'EXTRA_LIFE',
    category: 'HELP',
    name: 'EXTRA LIFE',
    persianName: 'جان اضافه (EXTRA LIFE)',
    costSeconds: 25,
    effect: 'One failure is ignored',
    persianEffect: 'یک شکست یا خطا نادیده گرفته می‌شود',
  },
  // ATTACK
  {
    id: 'SLOW_DOWN',
    category: 'ATTACK',
    name: 'SLOW DOWN',
    persianName: 'کندسازی حریف (SLOW DOWN)',
    costSeconds: 20,
    effect: 'Opponent starts 5 seconds late',
    persianEffect: 'حریف ۵ ثانیه دیرتر چالش را شروع می‌کند',
  },
  {
    id: 'HARD_MODE',
    category: 'ATTACK',
    name: 'HARD MODE',
    persianName: 'حالت سخت برای حریف (HARD MODE)',
    costSeconds: 30,
    effect: 'Opponent gets a physical restriction',
    persianEffect: 'حریف یک محدودیت فیزیکی (دست مخالف یا چشمان بسته) می‌گیرد',
  },
  // RISK
  {
    id: 'DOUBLE_OR_NOTHING',
    category: 'RISK',
    name: 'DOUBLE OR NOTHING',
    persianName: 'دو برابر یا هیچ (DOUBLE OR NOTHING)',
    costSeconds: 20,
    effect: 'Success = 2x banked bet, Fail = bet burned',
    persianEffect: 'موفقیت: دو برابر شدن زمان شرط، شکست: سوختن زمان شرط',
  },
  {
    id: 'COMEBACK_ALL_IN',
    category: 'RISK',
    name: 'COMEBACK ALL-IN',
    persianName: 'بازگشت طلایی (ALL-IN)',
    costSeconds: 30,
    effect: 'Trailing player only: Success = +50s, Fail = -30s (once per game)',
    persianEffect: 'فقط برای بازیکن عقب‌تر: موفقیت ۵۰+ ثانیه، شکست ۳۰- ثانیه (فقط ۱ بار)',
    isComebackAllIn: true,
  },
];

/**
 * ROUND 6: توالی نهایی (THE FINAL SEQUENCE)
 */
export interface FinalStageConfig {
  stageNumber: number;
  id: string;
  name: string;
  persianName: string;
  description: string;
  persianDescription: string;
  codeOutput: string;
  scoringCriteria?: {
    item: string;
    persianItem: string;
    weight: number;
  }[];
}

export const FINAL_SEQUENCE_STAGES: FinalStageConfig[] = [
  {
    stageNumber: 1,
    id: 'BLIND_DRAWING',
    name: 'Blind AI Drawing',
    persianName: 'مرحله ۱: نقاشی با چشم بسته',
    description: 'Reference image displayed briefly, drawn blindfolded from memory.',
    persianDescription: 'تصویر چند ثانیه نمایش داده می‌شود، سپس با چشم بسته از حافظه کشیده می‌شود.',
    codeOutput: 'CODE_1',
    scoringCriteria: [
      { item: 'Design Readability', persianItem: 'خوانایی طرح', weight: 40 },
      { item: 'Key Elements', persianItem: 'اجزای کلیدی', weight: 30 },
      { item: 'Proportions & Layout', persianItem: 'نسبت‌ها و چیدمان', weight: 20 },
      { item: 'Blindfold Integrity', persianItem: 'رعایت چشم‌بستگی', weight: 10 },
    ],
  },
  {
    stageNumber: 2,
    id: 'MEMORY_BUILD',
    name: 'Memory Build',
    persianName: 'مرحله ۲: ساخت از حافظه',
    description: 'Pattern displayed briefly, reconstructed precisely from memory.',
    persianDescription: 'الگو کوتاه نمایش داده می‌شود و باید دقیقاً از حافظه بازسازی شود.',
    codeOutput: 'CODE_2',
  },
  {
    stageNumber: 3,
    id: 'FINAL_LOGIC',
    name: 'Final Logic Challenge',
    persianName: 'مرحله ۳: چالش منطق نهایی',
    description: 'Problem solvable only by combining clues from stages 1 & 2.',
    persianDescription: 'مسئله‌ای که فقط با ترکیب اطلاعات دو مرحله قبل حل می‌شود.',
    codeOutput: 'CODE_3',
  },
  {
    stageNumber: 4,
    id: 'GOLDEN_CASE',
    name: 'Golden Locked Case',
    persianName: 'مرحله ۴: کیف طلایی داداش مد',
    description: 'Enter the 3 unlocked digits to open the Golden Case & win the Champion Kit!',
    persianDescription: 'وارد کردن ۳ رمز در قفل سه‌رقمی کیف طلایی و دریافت کیت قهرمانی داداش مد!',
    codeOutput: 'CHAMPION_KIT',
  },
];


