export type GameStage =
  | "identity_check"
  | "transition"
  | "chicken_catch"
  | "boss_battle"
  | "valentine_ask"
  | "victory";

export type StageStatus = "idle" | "playing" | "won" | "lost";

export interface IdentityCheckState {
  attempts: number;
  lastError: string | null;
  passed: boolean;
}

export interface ChickenCatchState {
  score: number;
  timeLeft: number;
  status: StageStatus;
}

export interface BossBattleState {
  position: number; // 0-100, starts at 50. Player pushes toward 100, boss toward 0.
  status: StageStatus;
}

export interface GameState {
  stage: GameStage;
  transitionTo: GameStage | null;
  identityCheck: IdentityCheckState;
  chickenCatch: ChickenCatchState;
  bossBattle: BossBattleState;
}

export type GameAction =
  | { type: "SUBMIT_PASSWORD"; password: string }
  | { type: "START_CHICKEN_GAME" }
  | { type: "CATCH_CHICKEN" }
  | { type: "CHICKEN_TICK" }
  | { type: "START_BOSS_BATTLE" }
  | { type: "BOSS_TAP" }
  | { type: "BOSS_TICK"; delta: number }
  | { type: "RETRY_STAGE" }
  | { type: "ADVANCE_STAGE" }
  | { type: "VALENTINE_YES" }
  | { type: "TRANSITION_COMPLETE" }
  | { type: "RESET" };

export interface Chicken {
  id: number;
  x: number;
  y: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  active: boolean;
  caught: boolean;
}
