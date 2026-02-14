import { useReducer } from "react";
import type { GameState, GameAction } from "@/lib/gameTypes";
import { GAME_CONFIG, WRONG_PASSWORD_MESSAGES } from "@/lib/gameConfig";

const initialState: GameState = {
  stage: "identity_check",
  transitionTo: null,
  identityCheck: {
    attempts: 0,
    lastError: null,
    passed: false,
  },
  chickenCatch: {
    score: 0,
    timeLeft: GAME_CONFIG.chickenGameDuration,
    status: "idle",
  },
  bossBattle: {
    position: 50,
    status: "idle",
  },
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (state.stage) {
    case "identity_check":
      return handleIdentityCheck(state, action);
    case "chicken_catch":
      return handleChickenCatch(state, action);
    case "boss_battle":
      return handleBossBattle(state, action);
    case "valentine_ask":
      return handleValentineAsk(state, action);
    case "transition":
      return handleTransition(state, action);
    case "victory":
      if (action.type === "RESET") return initialState;
      return state;
    default:
      return state;
  }
}

function handleIdentityCheck(
  state: GameState,
  action: GameAction
): GameState {
  if (action.type === "SUBMIT_PASSWORD") {
    if (action.password.toLowerCase() === GAME_CONFIG.password.toLowerCase()) {
      return {
        ...state,
        identityCheck: { ...state.identityCheck, passed: true },
      };
    }
    const attempts = state.identityCheck.attempts + 1;
    const msgIndex = (attempts - 1) % WRONG_PASSWORD_MESSAGES.length;
    return {
      ...state,
      identityCheck: {
        attempts,
        lastError: WRONG_PASSWORD_MESSAGES[msgIndex],
        passed: false,
      },
    };
  }
  if (action.type === "ADVANCE_STAGE") {
    return {
      ...state,
      stage: "transition",
      transitionTo: "chicken_catch",
    };
  }
  return state;
}

function handleChickenCatch(state: GameState, action: GameAction): GameState {
  const cc = state.chickenCatch;

  switch (action.type) {
    case "START_CHICKEN_GAME":
      return {
        ...state,
        chickenCatch: {
          score: 0,
          timeLeft: GAME_CONFIG.chickenGameDuration,
          status: "playing",
        },
      };
    case "CATCH_CHICKEN":
      if (cc.status !== "playing") return state;
      return {
        ...state,
        chickenCatch: { ...cc, score: cc.score + 1 },
      };
    case "CHICKEN_TICK": {
      if (cc.status !== "playing") return state;
      const newTime = cc.timeLeft - 1;
      if (newTime <= 0) {
        const won = cc.score >= GAME_CONFIG.chickenCatchTarget;
        return {
          ...state,
          chickenCatch: {
            ...cc,
            timeLeft: 0,
            status: won ? "won" : "lost",
          },
        };
      }
      return {
        ...state,
        chickenCatch: { ...cc, timeLeft: newTime },
      };
    }
    case "RETRY_STAGE":
      return {
        ...state,
        chickenCatch: {
          score: 0,
          timeLeft: GAME_CONFIG.chickenGameDuration,
          status: "idle",
        },
      };
    case "ADVANCE_STAGE":
      return {
        ...state,
        stage: "transition",
        transitionTo: "boss_battle",
      };
    default:
      return state;
  }
}

function handleBossBattle(state: GameState, action: GameAction): GameState {
  const bb = state.bossBattle;

  switch (action.type) {
    case "START_BOSS_BATTLE":
      return {
        ...state,
        bossBattle: { position: 50, status: "playing" },
      };
    case "BOSS_TAP": {
      if (bb.status !== "playing") return state;
      const newPos = Math.min(bb.position + GAME_CONFIG.playerPushPerTap, 100);
      if (newPos >= 100) {
        return {
          ...state,
          bossBattle: { position: 100, status: "won" },
        };
      }
      return {
        ...state,
        bossBattle: { ...bb, position: newPos },
      };
    }
    case "BOSS_TICK": {
      if (bb.status !== "playing") return state;
      const newPos = Math.max(bb.position - GAME_CONFIG.kaiPushPerSecond * action.delta, 0);
      if (newPos <= 0) {
        return {
          ...state,
          bossBattle: { position: 0, status: "lost" },
        };
      }
      return {
        ...state,
        bossBattle: { ...bb, position: newPos },
      };
    }
    case "RETRY_STAGE":
      return {
        ...state,
        bossBattle: { position: 50, status: "idle" },
      };
    case "ADVANCE_STAGE":
      return {
        ...state,
        stage: "transition",
        transitionTo: "valentine_ask",
      };
    default:
      return state;
  }
}

function handleValentineAsk(state: GameState, action: GameAction): GameState {
  if (action.type === "VALENTINE_YES") {
    return {
      ...state,
      stage: "transition",
      transitionTo: "victory",
    };
  }
  return state;
}

function handleTransition(state: GameState, action: GameAction): GameState {
  if (action.type === "TRANSITION_COMPLETE" && state.transitionTo) {
    return {
      ...state,
      stage: state.transitionTo,
      transitionTo: null,
    };
  }
  return state;
}

export function useGameReducer() {
  return useReducer(gameReducer, initialState);
}
