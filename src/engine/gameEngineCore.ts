/**
 * DADASHMODE CORE GAME ENGINE
 * 
 * Pure functions, deterministic score calculation, and journal event stream.
 * Invariant: Score calculations must strictly parse events and clamp to 0.
 */

import { PlayerId, GameState, GameRound, PublicBroadcastState } from '../types/game';
import { masterClock } from '../lib/clock';

export interface GameEvent {
  id: string;
  type: 'TIME_ADD' | 'TIME_SUBTRACT' | 'SCORE_SET' | 'ROUND_SET' | 'REVIEW_REQUEST' | 'REVIEW_RESOLVE';
  player?: PlayerId;
  delta?: number;
  newScore?: number;
  roundIndex?: number;
  reason?: string;
  timestamp: number;
}

export function calculateBankedSeconds(
  initialSeconds: number,
  events: GameEvent[],
  player: PlayerId
): number {
  let score = initialSeconds;

  for (const event of events) {
    if (event.player !== player) continue;

    if (event.type === 'TIME_ADD' && event.delta) {
      score += event.delta;
    } else if (event.type === 'TIME_SUBTRACT' && event.delta) {
      score = Math.max(0, score - event.delta);
    } else if (event.type === 'SCORE_SET' && typeof event.newScore === 'number') {
      score = Math.max(0, event.newScore);
    }
  }

  return Math.max(0, score);
}

export function createInitialGameState(rounds: GameRound[]): GameState {
  return {
    currentRoundIndex: 0,
    rounds,
    players: {
      ELIAS: {
        id: 'ELIAS',
        name: 'ELIAS',
        persianName: 'اِلیاس',
        seconds: 20,
        color: '#FF2738',
        symbol: '▲',
        letter: 'E',
      },
      EMAD: {
        id: 'EMAD',
        name: 'EMAD',
        persianName: 'عِماد',
        seconds: 20,
        color: '#00C98D',
        symbol: '●',
        letter: 'M',
      },
    },
    timerSecondsRemaining: rounds[0]?.defaultTimerSeconds || 30,
    isTimerRunning: false,
    isTimerPaused: false,
    isUnderReview: false,
  };
}

export function toPublicBroadcastState(state: GameState): PublicBroadcastState {
  const currentRound = state.rounds[state.currentRoundIndex] || {
    number: 1,
    title: 'Round 1',
    persianTitle: 'راند ۱',
  };

  return {
    round: {
      current: state.currentRoundIndex + 1,
      total: state.rounds.length,
      title: currentRound.title,
      persianTitle: currentRound.persianTitle,
      persianRule: currentRound.persianRule || '',
    },
    players: state.players,
    timer: {
      secondsRemaining: state.timerSecondsRemaining,
      isRunning: state.isTimerRunning,
      isPaused: state.isTimerPaused,
    },
    review: {
      isUnderReview: state.isUnderReview,
      reason: state.reviewReason,
    },
    announcement: state.announcement,
  };
}
