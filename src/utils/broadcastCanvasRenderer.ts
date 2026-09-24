import { PublicBroadcastState } from '../types/game';
import { RecordingPreset } from '../types/recorder';

/**
 * Renders the Public Broadcast State onto a dedicated 2D Canvas for internal recording.
 * Strictly audience-facing: NO Director UI, NO event logs, NO developer tools.
 * Safe for chroma keying (#FF00FF background in overlay presets).
 */
export class BroadcastCanvasRenderer {
  /**
   * Main render method called on each animation frame / tick
   */
  public static render(
    ctx: CanvasRenderingContext2D,
    state: PublicBroadcastState,
    preset: RecordingPreset,
    timestamp: number = Date.now()
  ): void {
    const { width, height } = preset;
    const canvasState: PublicBroadcastState = {
      ...state,
      roundNumber: state.round.current,
      totalRounds: state.round.total,
      roundPersianTitle: state.round.persianTitle,
      roundTitle: state.round.title,
      roundPersianRule: state.round.persianRule,
      latestAnnouncement: state.announcement ? { text: state.announcement } : undefined,
      aiState: 'OFFLINE',
      review: { ...state.review, persianReason: state.review.reason },
    };

    // 1. Clear background (Transparent Alpha vs Opaque Background)
    ctx.save();
    if (preset.isTransparentAlpha || preset.backgroundColor === 'transparent') {
      ctx.clearRect(0, 0, width, height);
    } else {
      ctx.fillStyle = preset.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    if (preset.outputMode === 'REAL_VIDEO_OVERLAY' || preset.isTransparentAlpha || preset.isChroma) {
      this.renderRealVideoOverlayHud(ctx, canvasState, width, height, timestamp);
    } else if (preset.outputMode === 'FULL_SCREEN_SCENE' || width === 1920) {
      this.renderFullScreenEsportsScene(ctx, canvasState, width, height, timestamp);
    } else {
      this.renderFullPortrait(ctx, canvasState, width, height, timestamp);
    }

    ctx.restore();
  }

  /**
   * OUTPUT 2: REAL VIDEO OVERLAY HUD
   * - 1920x1080 transparent canvas
   * - Center area (70%) is 100% EMPTY to protect faces & hands
   * - Top-left: Round info
   * - Top-right: Dual player score bug
   * - Top-center: Sleek timer pill
   * - Bottom: Minimal sports ticker
   * - Total coverage: < 15% of screen
   */
  private static renderRealVideoOverlayHud(
    ctx: CanvasRenderingContext2D,
    state: PublicBroadcastState,
    w: number,
    h: number,
    timestamp: number
  ): void {
    const scale = w / 1920;

    // WIDGET 1: TOP-LEFT ROUND INFO CARD
    const rW = 420 * scale;
    const rH = 96 * scale;
    const rX = 60 * scale;
    const rY = 40 * scale;

    this.drawRoundedRect(
      ctx,
      rX,
      rY,
      rW,
      rH,
      20 * scale,
      'rgba(8, 13, 26, 0.92)',
      '#00A7FF',
      2 * scale
    );

    // Wolf Shield Emblem (Vector Mini)
    ctx.save();
    ctx.fillStyle = '#00A7FF';
    ctx.beginPath();
    ctx.moveTo(rX + 40 * scale, rY + 24 * scale);
    ctx.lineTo(rX + 60 * scale, rY + 40 * scale);
    ctx.lineTo(rX + 54 * scale, rY + 70 * scale);
    ctx.lineTo(rX + 40 * scale, rY + 80 * scale);
    ctx.lineTo(rX + 26 * scale, rY + 70 * scale);
    ctx.lineTo(rX + 20 * scale, rY + 40 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Round Number & Reward Tag
    ctx.font = `bold ${14 * scale}px monospace`;
    ctx.fillStyle = '#00E5FF';
    ctx.textAlign = 'left';
    ctx.fillText(
      `ROUND ${state.roundNumber}/${state.totalRounds}`,
      rX + 78 * scale,
      rY + 36 * scale
    );

    if (state.rewardSeconds) {
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`+${state.rewardSeconds}s`, rX + 220 * scale, rY + 36 * scale);
    }

    // Title
    ctx.font = `bold ${20 * scale}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(state.roundPersianTitle || state.roundTitle, rX + 78 * scale, rY + 70 * scale);

    // WIDGET 2: TOP-RIGHT DUAL PLAYER SCORE BUG
    const sW = 440 * scale;
    const sH = 96 * scale;
    const sX = w - sW - 60 * scale;
    const sY = 40 * scale;

    this.drawRoundedRect(
      ctx,
      sX,
      sY,
      sW,
      sH,
      20 * scale,
      'rgba(8, 13, 26, 0.92)',
      '#FFD700',
      2 * scale
    );

    // Player 1: ELIAS
    ctx.font = `bold ${14 * scale}px monospace`;
    ctx.fillStyle = '#FF4D6D';
    ctx.textAlign = 'left';
    ctx.fillText('▲ ELIAS', sX + 28 * scale, sY + 38 * scale);

    ctx.font = `bold ${36 * scale}px monospace`;
    ctx.fillStyle = '#FF2A55';
    ctx.fillText(`${state.players.ELIAS.seconds}s`, sX + 28 * scale, sY + 76 * scale);

    // VS Separator
    ctx.font = `bold ${16 * scale}px monospace`;
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText('VS', sX + sW / 2, sY + 54 * scale);

    // Player 2: EMAD
    ctx.font = `bold ${14 * scale}px monospace`;
    ctx.fillStyle = '#00E676';
    ctx.textAlign = 'right';
    ctx.fillText('● EMAD', sX + sW - 28 * scale, sY + 38 * scale);

    ctx.font = `bold ${36 * scale}px monospace`;
    ctx.fillStyle = '#00E676';
    ctx.fillText(`${state.players.EMAD.seconds}s`, sX + sW - 28 * scale, sY + 76 * scale);

    // WIDGET 3: TOP-CENTER SLEEK FLOATING TIMER PILL
    const tW = 200 * scale;
    const tH = 56 * scale;
    const tX = (w - tW) / 2;
    const tY = 40 * scale;

    const isValidation = state.timer.isValidationTimer;
    const isCritical = state.timer.secondsRemaining <= 5 && state.timer.isRunning;

    const timerBg = isValidation
      ? 'rgba(69, 26, 3, 0.95)'
      : isCritical
      ? 'rgba(69, 10, 10, 0.95)'
      : 'rgba(9, 14, 28, 0.95)';

    const timerBorder = isValidation ? '#FFD700' : isCritical ? '#FF2A55' : '#00A7FF';

    this.drawRoundedRect(ctx, tX, tY, tW, tH, 28 * scale, timerBg, timerBorder, 2 * scale);

    const mins = Math.floor(state.timer.secondsRemaining / 60);
    const rem = state.timer.secondsRemaining % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;

    ctx.font = `bold ${30 * scale}px monospace`;
    ctx.fillStyle = isValidation ? '#FFD700' : isCritical ? '#FF4D6D' : '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(timeStr, tX + tW / 2, tY + 40 * scale);

    // WIDGET 4: BOTTOM MINIMAL SPORTS TICKER
    const bW = 760 * scale;
    const bH = 40 * scale;
    const bX = (w - bW) / 2;
    const bY = h - bH - 35 * scale;

    this.drawRoundedRect(ctx, bX, bY, bW, bH, 14 * scale, 'rgba(0, 0, 0, 0.88)', '#262626', 1.5 * scale);

    ctx.font = `bold ${11 * scale}px monospace`;
    ctx.fillStyle = '#00E5FF';
    ctx.textAlign = 'left';
    ctx.fillText('AI REFEREE:', bX + 20 * scale, bY + 25 * scale);

    ctx.font = `bold ${13 * scale}px sans-serif`;
    ctx.fillStyle = '#E5E5E5';
    ctx.textAlign = 'right';
    const msg =
      state.latestAnnouncement?.text ||
      'مسابقه تحت نظارت داور رسمی هوش مصنوعی DADASHMODE در جریان است.';
    ctx.fillText(msg, bX + bW - 20 * scale, bY + 25 * scale);

    // AI Status Badge beside ticker
    this.renderAiBadge(ctx, state.aiState, bX - 165 * scale, bY, 150 * scale, bH, scale);

    // CENTER AREA (70% OF CANVAS) IS COMPLETELY UNTOUCHED AND TRANSPARENT
  }

  /**
   * OUTPUT 1: FULL SCREEN ESPORTS GAME SCENE
   * - 1920x1080 full background design
   * - Opaque background with cybernetic flares & grid
   * - Full battle cards, timer hero, visual diagrams, rules
   */
  private static renderFullScreenEsportsScene(
    ctx: CanvasRenderingContext2D,
    state: PublicBroadcastState,
    w: number,
    h: number,
    timestamp: number
  ): void {
    const scale = w / 1920;

    // 1. Dark Esports Background Gradient
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 100 * scale, w / 2, h / 2, w * 0.8);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#070a12');
    bgGrad.addColorStop(1, '#030408');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Cyan & Red Ambient corner glows
    ctx.fillStyle = 'rgba(0, 167, 255, 0.12)';
    ctx.beginPath();
    ctx.arc(100 * scale, 100 * scale, 320 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 42, 85, 0.12)';
    ctx.beginPath();
    ctx.arc(100 * scale, h - 100 * scale, 320 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 230, 118, 0.12)';
    ctx.beginPath();
    ctx.arc(w - 100 * scale, h - 100 * scale, 320 * scale, 0, Math.PI * 2);
    ctx.fill();

    // 2. Header
    const pad = 60 * scale;
    this.drawRoundedRect(ctx, pad, 30 * scale, w - pad * 2, 80 * scale, 24 * scale, 'rgba(11, 16, 28, 0.9)', '#00A7FF', 2 * scale);

    ctx.font = `bold ${24 * scale}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText('DADASHMODE TIME BANK', pad + 30 * scale, 80 * scale);

    ctx.font = `bold ${18 * scale}px monospace`;
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText(`ROUND ${state.roundNumber} / ${state.totalRounds}`, w / 2, 80 * scale);

    this.renderAiBadge(ctx, state.aiState, w - pad - 200 * scale, 45 * scale, 170 * scale, 50 * scale, scale);

    // 3. Battle Columns (Left Elias / Center Stage / Right Emad)
    const cardW = 380 * scale;
    const cardH = 580 * scale;
    const cardY = 150 * scale;

    // Left Column: ELIAS
    this.drawPlayerScorecard(
      ctx,
      pad,
      cardY,
      cardW,
      cardH,
      state.players.ELIAS.name,
      state.players.ELIAS.persianName,
      state.players.ELIAS.seconds,
      'triangle',
      'L',
      '#1a060a',
      '#FF2A55',
      scale,
      state.players.ELIAS.lockedChoice
    );

    // Right Column: EMAD
    this.drawPlayerScorecard(
      ctx,
      w - pad - cardW,
      cardY,
      cardW,
      cardH,
      state.players.EMAD.name,
      state.players.EMAD.persianName,
      state.players.EMAD.seconds,
      'circle',
      'M',
      '#051a10',
      '#00E676',
      scale,
      state.players.EMAD.lockedChoice
    );

    // Center Stage: Giant Countdown Timer & Rules
    const centerW = w - pad * 2 - cardW * 2 - 40 * scale;
    const centerX = pad + cardW + 20 * scale;

    // Timer Box
    const timerBoxH = 220 * scale;
    this.drawRoundedRect(ctx, centerX, cardY, centerW, timerBoxH, 30 * scale, 'rgba(10, 15, 28, 0.95)', '#00A7FF', 3 * scale);

    const mins = Math.floor(state.timer.secondsRemaining / 60);
    const rem = state.timer.secondsRemaining % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;

    ctx.font = `bold ${80 * scale}px monospace`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(timeStr, centerX + centerW / 2, cardY + 130 * scale);

    ctx.font = `bold ${18 * scale}px monospace`;
    ctx.fillStyle = '#00E5FF';
    ctx.fillText(state.timer.isValidationTimer ? 'VALIDATION 2-SEC COUNTDOWN' : 'OFFICIAL CHALLENGE TIMER', centerX + centerW / 2, cardY + 180 * scale);

    // Rules Box
    const rulesBoxY = cardY + timerBoxH + 20 * scale;
    const rulesBoxH = cardH - timerBoxH - 20 * scale;
    this.drawRoundedRect(ctx, centerX, rulesBoxY, centerW, rulesBoxH, 24 * scale, 'rgba(0, 0, 0, 0.7)', '#262626', 2 * scale);

    ctx.font = `bold ${24 * scale}px sans-serif`;
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText(state.roundPersianTitle, centerX + centerW / 2, rulesBoxY + 60 * scale);

    ctx.font = `${18 * scale}px sans-serif`;
    ctx.fillStyle = '#E5E5E5';
    ctx.fillText(state.roundPersianRule, centerX + centerW / 2, rulesBoxY + 120 * scale);

    if (state.rewardSeconds) {
      this.drawRoundedRect(ctx, centerX + centerW / 2 - 120 * scale, rulesBoxY + 180 * scale, 240 * scale, 48 * scale, 24 * scale, 'rgba(255, 215, 0, 0.15)', '#FFD700', 2 * scale);
      ctx.font = `bold ${20 * scale}px monospace`;
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`+${state.rewardSeconds} SEC REWARD`, centerX + centerW / 2, rulesBoxY + 212 * scale);
    }

    // 4. Bottom Footer Ticker
    const footY = h - 100 * scale;
    this.drawRoundedRect(ctx, pad, footY, w - pad * 2, 60 * scale, 18 * scale, 'rgba(0, 0, 0, 0.85)', '#333333', 1.5 * scale);

    ctx.font = `bold ${14 * scale}px monospace`;
    ctx.fillStyle = '#00E5FF';
    ctx.textAlign = 'left';
    ctx.fillText('LIVE VAR VERDICT:', pad + 25 * scale, footY + 36 * scale);

    ctx.font = `bold ${16 * scale}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    const tickerText = state.latestAnnouncement?.text || 'مسابقه طبق دستورالعمل‌های رسمی برگزار می‌شود.';
    ctx.fillText(tickerText, w - pad - 25 * scale, footY + 36 * scale);
  }

  /**
   * 16:9 Broadcast Overlay Renderer (Compact & Low-Power)
   */
  private static renderCompactOverlay(
    ctx: CanvasRenderingContext2D,
    state: PublicBroadcastState,
    w: number,
    h: number,
    timestamp: number
  ): void {
    const scale = w / 1280; // Scale dynamically for 1280x720 vs 960x540

    // --- TOP BAR: Header & AI Referee Badge ---
    const headerHeight = 60 * scale;
    const paddingX = 30 * scale;

    // Header Background Pill
    this.drawRoundedRect(
      ctx,
      paddingX,
      20 * scale,
      w - paddingX * 2,
      headerHeight,
      16 * scale,
      'rgba(15, 15, 15, 0.92)',
      '#262626',
      2 * scale
    );

    // Show Title
    ctx.font = `bold ${20 * scale}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText('DADASHMODE', paddingX + 20 * scale, 56 * scale);

    ctx.font = `bold ${13 * scale}px monospace`;
    ctx.fillStyle = '#EAB308'; // Amber
    ctx.fillText('TIME BANK', paddingX + 175 * scale, 55 * scale);

    // Current Round Badge
    ctx.font = `bold ${14 * scale}px sans-serif`;
    ctx.fillStyle = '#A3A3A3';
    ctx.textAlign = 'center';
    ctx.fillText(
      `ROUND ${state.roundNumber} / ${state.totalRounds}`,
      w / 2,
      56 * scale
    );

    // AI Referee Status Badge (Right side of header)
    this.renderAiBadge(ctx, state.aiState, w - paddingX - 160 * scale, 28 * scale, 140 * scale, 42 * scale, scale);

    // --- CENTER: LARGE DIGITAL TIMER ---
    const timerW = 320 * scale;
    const timerH = 110 * scale;
    const timerX = (w - timerW) / 2;
    const timerY = 100 * scale;

    const isValidation = state.timer.isValidationTimer;
    const isCritical = state.timer.secondsRemaining <= 5 && state.timer.isRunning;

    const timerBg = isValidation
      ? 'rgba(69, 26, 3, 0.95)' // Amber-950
      : isCritical
      ? 'rgba(69, 10, 10, 0.95)' // Red-950
      : 'rgba(23, 23, 23, 0.92)';

    const timerBorder = isValidation ? '#D97706' : isCritical ? '#DC2626' : '#404040';

    this.drawRoundedRect(ctx, timerX, timerY, timerW, timerH, 24 * scale, timerBg, timerBorder, 3 * scale);

    // Timer Sub-label
    ctx.font = `bold ${11 * scale}px monospace`;
    ctx.fillStyle = isValidation ? '#FBBF24' : isCritical ? '#F87171' : '#A3A3A3';
    ctx.textAlign = 'center';
    ctx.fillText(
      isValidation ? 'VALIDATION COUNTDOWN' : 'TIME REMAINING',
      timerX + timerW / 2,
      timerY + 28 * scale
    );

    // Big Tabular Timer Text
    const mins = Math.floor(Math.max(0, state.timer.secondsRemaining) / 60);
    const secs = Math.max(0, state.timer.secondsRemaining) % 60;
    const timerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    ctx.font = `bold ${52 * scale}px monospace`;
    ctx.fillStyle = isValidation ? '#FDE047' : isCritical ? '#F87171' : '#FFFFFF';
    ctx.fillText(timerText, timerX + timerW / 2, timerY + 84 * scale);

    // --- LEFT SCORECARD: ELIAS (RED, TRIANGLE, 'E') ---
    const playerCardW = 280 * scale;
    const playerCardH = 150 * scale;
    const eliasX = paddingX + 20 * scale;
    const eliasY = 100 * scale;

    this.drawPlayerScorecard(
      ctx,
      eliasX,
      eliasY,
      playerCardW,
      playerCardH,
      state.players.ELIAS.name,
      state.players.ELIAS.persianName,
      state.players.ELIAS.seconds,
      'triangle',
      'E',
      '#7F1D1D', // Dark Red bg
      '#EF4444', // Red border & accents
      scale,
      state.players.ELIAS.lockedChoice
    );

    // --- RIGHT SCORECARD: EMAD (TEAL/GREEN, CIRCLE, 'M') ---
    const emadX = w - paddingX - 20 * scale - playerCardW;
    const emadY = 100 * scale;

    this.drawPlayerScorecard(
      ctx,
      emadX,
      emadY,
      playerCardW,
      playerCardH,
      state.players.EMAD.name,
      state.players.EMAD.persianName,
      state.players.EMAD.seconds,
      'circle',
      'M',
      '#064E3B', // Dark Teal bg
      '#10B981', // Emerald border & accents
      scale,
      state.players.EMAD.lockedChoice
    );

    // --- LOWER THIRD: Current Challenge & Rule ---
    const lowerW = w - paddingX * 2;
    const lowerH = 80 * scale;
    const lowerX = paddingX;
    const lowerY = h - lowerH - 24 * scale;

    this.drawRoundedRect(
      ctx,
      lowerX,
      lowerY,
      lowerW,
      lowerH,
      18 * scale,
      'rgba(18, 18, 18, 0.94)',
      '#27272A',
      2 * scale
    );

    // Persian Title & Reward Tag
    ctx.font = `bold ${18 * scale}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    ctx.fillText(state.roundPersianTitle, lowerX + lowerW - 24 * scale, lowerY + 34 * scale);

    if (state.rewardSeconds) {
      // Reward badge
      this.drawRoundedRect(
        ctx,
        lowerX + 24 * scale,
        lowerY + 16 * scale,
        110 * scale,
        30 * scale,
        8 * scale,
        'rgba(16, 185, 129, 0.2)',
        '#10B981',
        1.5 * scale
      );
      ctx.font = `bold ${12 * scale}px monospace`;
      ctx.fillStyle = '#34D399';
      ctx.textAlign = 'center';
      ctx.fillText(`+${state.rewardSeconds}s REWARD`, lowerX + 79 * scale, lowerY + 36 * scale);
    }

    // Persian Rule text
    ctx.font = `${13 * scale}px sans-serif`;
    ctx.fillStyle = '#D4D4D8';
    ctx.textAlign = 'right';
    ctx.fillText(state.roundPersianRule, lowerX + lowerW - 24 * scale, lowerY + 62 * scale);

    // --- OVERLAYS: VAR REVIEW ACTIVE BANNER ---
    if (state.review.isUnderReview) {
      this.renderReviewOverlay(ctx, w, h, scale, state.review.persianReason || state.review.reason);
    }

    // --- OVERLAYS: WINNER CELEBRATION ---
    if (state.winner) {
      this.renderWinnerOverlay(ctx, w, h, scale, state);
    }
  }

  /**
   * 9:16 Full Portrait Broadcast Renderer
   */
  private static renderFullPortrait(
    ctx: CanvasRenderingContext2D,
    state: PublicBroadcastState,
    w: number,
    h: number,
    timestamp: number
  ): void {
    const scale = w / 720;

    // Dark clean broadcast background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
    bgGradient.addColorStop(0, '#121212');
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    const pad = 30 * scale;

    // 1. Header
    this.drawRoundedRect(ctx, pad, 40 * scale, w - pad * 2, 70 * scale, 20 * scale, '#171717', '#262626', 2 * scale);

    ctx.font = `bold ${22 * scale}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText('DADASHMODE', pad + 20 * scale, 84 * scale);

    this.renderAiBadge(ctx, state.aiState, w - pad - 160 * scale, 52 * scale, 140 * scale, 45 * scale, scale);

    // 2. Round Card
    this.drawRoundedRect(ctx, pad, 130 * scale, w - pad * 2, 120 * scale, 24 * scale, '#171717', '#262626', 2 * scale);
    ctx.font = `bold ${14 * scale}px monospace`;
    ctx.fillStyle = '#EAB308';
    ctx.textAlign = 'left';
    ctx.fillText(`ROUND ${state.roundNumber} / ${state.totalRounds}`, pad + 24 * scale, 164 * scale);

    ctx.font = `bold ${22 * scale}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    ctx.fillText(state.roundPersianTitle, w - pad - 24 * scale, 172 * scale);

    ctx.font = `${14 * scale}px sans-serif`;
    ctx.fillStyle = '#A3A3A3';
    ctx.fillText(state.roundPersianRule, w - pad - 24 * scale, 215 * scale);

    // 3. Big Central Timer
    const timerW = w - pad * 2;
    const timerH = 180 * scale;
    const timerY = 280 * scale;

    const isValidation = state.timer.isValidationTimer;
    const isCritical = state.timer.secondsRemaining <= 5 && state.timer.isRunning;
    const timerBg = isValidation ? '#451A03' : isCritical ? '#450A0A' : '#171717';
    const timerBorder = isValidation ? '#D97706' : isCritical ? '#DC2626' : '#404040';

    this.drawRoundedRect(ctx, pad, timerY, timerW, timerH, 28 * scale, timerBg, timerBorder, 3 * scale);

    ctx.font = `bold ${13 * scale}px monospace`;
    ctx.fillStyle = isValidation ? '#FBBF24' : isCritical ? '#F87171' : '#A3A3A3';
    ctx.textAlign = 'center';
    ctx.fillText(isValidation ? 'VALIDATION COUNTDOWN' : 'TIME REMAINING', w / 2, timerY + 45 * scale);

    const mins = Math.floor(Math.max(0, state.timer.secondsRemaining) / 60);
    const secs = Math.max(0, state.timer.secondsRemaining) % 60;
    const timerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    ctx.font = `bold ${84 * scale}px monospace`;
    ctx.fillStyle = isValidation ? '#FDE047' : isCritical ? '#F87171' : '#FFFFFF';
    ctx.fillText(timerText, w / 2, timerY + 135 * scale);

    // 4. Players Score Cards Row
    const cardW = (w - pad * 2 - 20 * scale) / 2;
    const cardH = 220 * scale;
    const playersY = 490 * scale;

    // Elias
    this.drawPlayerScorecard(
      ctx,
      pad,
      playersY,
      cardW,
      cardH,
      state.players.ELIAS.name,
      state.players.ELIAS.persianName,
      state.players.ELIAS.seconds,
      'triangle',
      'E',
      '#7F1D1D',
      '#EF4444',
      scale,
      state.players.ELIAS.lockedChoice
    );

    // Emad
    this.drawPlayerScorecard(
      ctx,
      pad + cardW + 20 * scale,
      playersY,
      cardW,
      cardH,
      state.players.EMAD.name,
      state.players.EMAD.persianName,
      state.players.EMAD.seconds,
      'circle',
      'M',
      '#064E3B',
      '#10B981',
      scale,
      state.players.EMAD.lockedChoice
    );

    // Overlays
    if (state.review.isUnderReview) {
      this.renderReviewOverlay(ctx, w, h, scale, state.review.persianReason || state.review.reason);
    }
    if (state.winner) {
      this.renderWinnerOverlay(ctx, w, h, scale, state);
    }
  }

  /**
   * Draw Individual Player Scorecard with Non-Color Visual Identity
   */
  private static drawPlayerScorecard(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    name: string,
    persianName: string,
    seconds: number,
    iconType: 'triangle' | 'circle',
    letterLabel: string,
    bg: string,
    accent: string,
    scale: number,
    lockedChoice?: string | null
  ): void {
    this.drawRoundedRect(ctx, x, y, w, h, 20 * scale, bg, accent, 2 * scale);

    // Top icon & label badge
    if (iconType === 'triangle') {
      // Triangle for Elias
      ctx.beginPath();
      ctx.moveTo(x + 24 * scale, y + 18 * scale);
      ctx.lineTo(x + 32 * scale, y + 32 * scale);
      ctx.lineTo(x + 16 * scale, y + 32 * scale);
      ctx.closePath();
      ctx.fillStyle = accent;
      ctx.fill();
    } else {
      // Circle for Emad
      ctx.beginPath();
      ctx.arc(x + 24 * scale, y + 25 * scale, 7 * scale, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
    }

    ctx.font = `bold ${12 * scale}px monospace`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText(`[${letterLabel}] ${name}`, x + 40 * scale, y + 29 * scale);

    // Persian Name
    ctx.font = `bold ${18 * scale}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    ctx.fillText(persianName, x + w - 18 * scale, y + 30 * scale);

    // Big Seconds Bank
    ctx.font = `bold ${48 * scale}px monospace`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(`${seconds}`, x + w / 2, y + 88 * scale);

    ctx.font = `bold ${11 * scale}px monospace`;
    ctx.fillStyle = accent;
    ctx.fillText('SECONDS BANK', x + w / 2, y + 108 * scale);

    // Bottom Choice / Status
    if (lockedChoice) {
      ctx.font = `bold ${12 * scale}px sans-serif`;
      ctx.fillStyle = '#FDE047';
      ctx.fillText(`قفل: ${lockedChoice}`, x + w / 2, y + 134 * scale);
    }
  }

  /**
   * Draw Geometric AI Referee Status Badge
   */
  private static renderAiBadge(
    ctx: CanvasRenderingContext2D,
    aiState: string,
    x: number,
    y: number,
    w: number,
    h: number,
    scale: number
  ): void {
    let bg = 'rgba(14, 165, 233, 0.15)';
    let border = '#0EA5E9'; // Sky
    let dotColor = '#38BDF8';
    let label = 'AI REFEREE';

    if (aiState === 'SPEAKING') {
      bg = 'rgba(234, 179, 8, 0.25)';
      border = '#EAB308'; // Amber
      dotColor = '#FACC15';
      label = 'SPEAKING';
    } else if (aiState === 'THINKING') {
      bg = 'rgba(168, 85, 247, 0.25)';
      border = '#A855F7'; // Purple
      dotColor = '#C084FC';
      label = 'PROCESSING';
    } else if (aiState === 'LISTENING') {
      bg = 'rgba(16, 185, 129, 0.25)';
      border = '#10B981'; // Emerald
      dotColor = '#34D399';
      label = 'LISTENING';
    } else if (aiState === 'REVIEW') {
      bg = 'rgba(245, 158, 11, 0.35)';
      border = '#F59E0B'; // Amber
      dotColor = '#FBBF24';
      label = 'VAR REVIEW';
    } else if (aiState === 'OFFLINE') {
      bg = 'rgba(100, 116, 139, 0.25)';
      border = '#64748B'; // Slate
      dotColor = '#94A3B8';
      label = 'LOCAL MODE';
    }

    this.drawRoundedRect(ctx, x, y, w, h, 14 * scale, bg, border, 1.5 * scale);

    // Indicator Dot
    ctx.beginPath();
    ctx.arc(x + 18 * scale, y + h / 2, 4.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    ctx.font = `bold ${11 * scale}px monospace`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText(label, x + 30 * scale, y + h / 2 + 4 * scale);
  }

  /**
   * Draw VAR Review Overlay Card
   */
  private static renderReviewOverlay(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    scale: number,
    reason: string
  ): void {
    // Backdrop
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, w, h);

    const cardW = Math.min(540 * scale, w - 40 * scale);
    const cardH = 220 * scale;
    const cardX = (w - cardW) / 2;
    const cardY = (h - cardH) / 2;

    this.drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 28 * scale, '#1C1917', '#F59E0B', 4 * scale);

    ctx.font = `bold ${14 * scale}px monospace`;
    ctx.fillStyle = '#F59E0B';
    ctx.textAlign = 'center';
    ctx.fillText('VAR OFFICIAL REVIEW IN PROGRESS', w / 2, cardY + 45 * scale);

    ctx.font = `bold ${26 * scale}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('بازبینی صحنه توسط داور', w / 2, cardY + 88 * scale);

    ctx.font = `${15 * scale}px sans-serif`;
    ctx.fillStyle = '#D4D4D8';
    ctx.fillText(reason || 'بررسی وضعیت چالش و خطای احتمالی', w / 2, cardY + 128 * scale);

    ctx.font = `bold ${13 * scale}px monospace`;
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('SCORES FROZEN • بازی موقتاً متوقف است', w / 2, cardY + 175 * scale);
  }

  /**
   * Draw Final Winner Card
   */
  private static renderWinnerOverlay(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    scale: number,
    state: PublicBroadcastState
  ): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, w, h);

    const cardW = Math.min(520 * scale, w - 40 * scale);
    const cardH = 240 * scale;
    const cardX = (w - cardW) / 2;
    const cardY = (h - cardH) / 2;

    this.drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 30 * scale, '#171717', '#EAB308', 4 * scale);

    ctx.font = `bold ${13 * scale}px monospace`;
    ctx.fillStyle = '#EAB308';
    ctx.textAlign = 'center';
    ctx.fillText('CHAMPION OF DADASH MODE', w / 2, cardY + 45 * scale);

    const winnerName =
      state.winner === 'TIE'
        ? 'مسابقه مساوی شد!'
        : `برنده: ${state.players[state.winner === 'EMAD' ? 'EMAD' : 'ELIAS'].persianName}`;

    ctx.font = `bold ${32 * scale}px sans-serif`;
    ctx.fillStyle = state.winner === 'ELIAS' ? '#EF4444' : state.winner === 'EMAD' ? '#10B981' : '#FFFFFF';
    ctx.fillText(winnerName, w / 2, cardY + 98 * scale);

    ctx.font = `bold ${18 * scale}px monospace`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(
      `ELIAS: ${state.players.ELIAS.seconds}s  |  EMAD: ${state.players.EMAD.seconds}s`,
      w / 2,
      cardY + 160 * scale
    );
  }

  /**
   * Helper: Rounded Rectangle with Fill & Stroke
   */
  private static drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    fill: string,
    stroke?: string,
    strokeWidth?: number
  ): void {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fillStyle = fill;
    ctx.fill();

    if (stroke && strokeWidth) {
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }

  /**
   * Chroma Safety Verification
   * Verifies that no key visual component or text uses exact chroma #FF00FF
   */
  public static isColorChromaSafe(hexColor: string): boolean {
    const normalized = hexColor.toUpperCase().trim();
    return normalized !== '#FF00FF' && normalized !== 'RGB(255, 0, 255)';
  }
}
