import { GameState, PublicBroadcastState, BroadcastAiState, GameRound } from '../types/game';
import { DEFAULT_ROUNDS } from '../data/challenges';

export interface DeriveOptions {
  liveStatus?: string;
  isMicActive?: boolean;
  isRefereeSpeaking?: boolean;
  isRefereeThinking?: boolean;
}

/**
 * Derives a strictly audience-safe PublicBroadcastState from internal GameState.
 * Guarantees:
 * - Hidden mystery assignments before reveal are scrubbed (outcome: null)
 * - Internal debug logs, session secrets, and manual override states are excluded
 * - Unrevealed sabotage items are excluded
 * - High-contrast player symbols (Triangle 'E' for Elias, Circle 'M' for Emad) are provided
 */
export function derivePublicBroadcastState(
  state: GameState,
  options: DeriveOptions = {}
): PublicBroadcastState {
  const {
    liveStatus = 'connected',
    isMicActive = false,
    isRefereeSpeaking = false,
    isRefereeThinking = false,
  } = options;

  const currentRound: GameRound = DEFAULT_ROUNDS[state.currentRoundIndex] || DEFAULT_ROUNDS[0];

  // Derive AI Referee Visual State
  let aiState: BroadcastAiState = 'IDLE';
  if (state.review.isUnderReview) {
    aiState = 'REVIEW';
  } else if (liveStatus === 'offline' || liveStatus === 'error') {
    aiState = 'OFFLINE';
  } else if (isRefereeSpeaking) {
    aiState = 'SPEAKING';
  } else if (isRefereeThinking) {
    aiState = 'THINKING';
  } else if (isMicActive) {
    aiState = 'LISTENING';
  }

  // Derive audience-safe mystery boxes:
  // CRITICAL: if isRevealed is false, outcome MUST be null!
  const safeMysteryBoxes = state.round3?.boxes?.map((box) => ({
    boxNumber: box.boxNumber,
    isLocked: Boolean(box.isLocked),
    isRevealed: Boolean(box.isRevealed),
    chosenBy: box.chosenBy,
    outcome: box.isRevealed ? box.outcome : null,
  }));

  // Safely extract latest public announcement if relevant
  const lastPublicEvent = state.events?.length > 0
    ? [...state.events]
        .reverse()
        .find(e =>
          e.type === 'WINNER_DECLARED' ||
          e.type === 'TIE_DECLARED' ||
          e.type === 'REVIEW_REQUESTED' ||
          e.type === 'REVIEW_RESOLVED' ||
          e.type === 'MYSTERY_BITE_REVEALED' ||
          e.type === 'SABOTAGE' ||
          e.type === 'ROUND5_RESULT' ||
          e.type === 'ROUND_START'
        )
    : null;

  return {
    showTitle: 'DADASHMODE TIME BANK',
    roundNumber: state.currentRoundIndex + 1,
    totalRounds: DEFAULT_ROUNDS.length,
    roundTitle: currentRound.title,
    roundPersianTitle: currentRound.persianTitle,
    roundRule: currentRound.rule,
    roundPersianRule: currentRound.persianRule,
    rewardSeconds: currentRound.rewardSeconds,

    timer: {
      secondsRemaining: state.validation?.isValidating
        ? state.validation.secondsRemaining
        : state.timerSecondsRemaining,
      isRunning: state.validation?.isValidating
        ? state.validation.status === 'running'
        : state.isTimerRunning,
      isValidationTimer: Boolean(state.validation?.isValidating),
      validationPlayer: state.validation?.player || null,
      isPaused: state.isPaused,
    },

    players: {
      ELIAS: {
        id: 'ELIAS',
        name: 'ELIAS',
        persianName: state.players.ELIAS.persianName,
        seconds: state.players.ELIAS.seconds,
        color: 'red',
        fouls: state.players.ELIAS.fouls,
        iconType: 'triangle',
        letterLabel: 'E',
        lockedChoice: state.players.ELIAS.lockedChoice,
      },
      EMAD: {
        id: 'EMAD',
        name: 'EMAD',
        persianName: state.players.EMAD.persianName,
        seconds: state.players.EMAD.seconds,
        color: 'green',
        fouls: state.players.EMAD.fouls,
        iconType: 'circle',
        letterLabel: 'M',
        lockedChoice: state.players.EMAD.lockedChoice,
      },
    },

    aiState,

    review: {
      isUnderReview: Boolean(state.review.isUnderReview),
      reason: state.review.reason || '',
      persianReason: state.review.persianReason || '',
      snapshotDataUrl: state.review.snapshotDataUrl,
    },

    winner: state.winner,

    mysteryBoxes: safeMysteryBoxes,

    revealedSabotage: state.activeSabotage
      ? {
          title: state.activeSabotage.title,
          persianTitle: state.activeSabotage.persianTitle,
          description: state.activeSabotage.description,
          persianDescription: state.activeSabotage.persianDescription,
          target: state.activeSabotage.target,
          revealedAt: state.activeSabotage.revealedAt,
        }
      : null,

    round6: state.round6,

    latestAnnouncement: lastPublicEvent
      ? {
          text: lastPublicEvent.persianMessage || lastPublicEvent.message,
          type: lastPublicEvent.type,
          timestamp: lastPublicEvent.timestamp,
        }
      : null,
  };
}
