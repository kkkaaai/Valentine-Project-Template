// ============================================================
// CUSTOMIZE YOUR GAME HERE — This is the only file you need to edit!
// ============================================================

export const GAME_CONFIG = {
  // ── Names ──────────────────────────────────────────────────
  senderName: "Your Name",       // Your name (the person giving this game)
  recipientName: "Babe",         // Your partner's name

  // ── Stage 0 — Identity Check ──────────────────────────────
  // A fun password gate. Not real security — just a cute gatekeeper.
  password: "1234",

  // ── Stage 1 — Chicken Catch ───────────────────────────────
  chickenGameDuration: 30,       // seconds to play
  chickenCatchTarget: 50,        // chickens needed to pass
  maxChickensOnScreen: 15,       // max simultaneous chickens
  chickenSpawnInterval: 0.25,    // seconds between spawns
  chickenFallSpeedMin: 80,       // min fall speed (px/s)
  chickenFallSpeedMax: 180,      // max fall speed (px/s)
  chickenSize: 56,               // chicken size in pixels

  // ── Stage 2 — Boss Battle (tug-of-war) ────────────────────
  // Position goes 0–100, starts at 50. Player pushes toward 100, boss toward 0.
  playerPushPerTap: 3,           // how much player gains per tap
  kaiPushPerSecond: 15,          // how fast the boss pushes back
} as const;

// ── Wrong Password Messages ────────────────────────────────
// These show up when the wrong password is entered.
// Feel free to add/remove/customize these!
export const WRONG_PASSWORD_MESSAGES = [
  `You're not ${GAME_CONFIG.recipientName}! Go away!`,
  "Nice try, impostor!",
  "Hmm... that's not right",
  `${GAME_CONFIG.senderName} says: Access denied!`,
  `Only ${GAME_CONFIG.recipientName} knows the password...`,
  "Are you sure you're not a chicken?",
  `Wrong! ${GAME_CONFIG.senderName} is watching you`,
  "Wrong password! Try again~",
];

// ── Victory Message ────────────────────────────────────────
// This is the love letter shown at the end. Make it personal!
export const VICTORY_MESSAGE = `My dearest ${GAME_CONFIG.recipientName}!
Happy Valentine's Day!

You are the most amazing person in my life.
I love you more than words can say.

Every day with you is an adventure,
and I wouldn't have it any other way!

Love you forever!`;

// ── Page Title ─────────────────────────────────────────────
export const PAGE_TITLE = `Happy Valentine's Day ${GAME_CONFIG.recipientName}`;

// ── Stage Text ─────────────────────────────────────────────
// You can customize all the in-game text here.

export const TEXT = {
  // Stage 0 — Identity Check
  identityQuestion: `Are you ${GAME_CONFIG.recipientName}?`,
  identityHint: "Prove it!",
  identityWelcome: `Welcome ${GAME_CONFIG.recipientName}!`,
  identityGameStart: "Let the games begin~",

  // Stage 1 — Chicken Catch
  chickenTitle: `Make ${GAME_CONFIG.senderName} happy!`,
  chickenSubtitle: `Help ${GAME_CONFIG.senderName} catch fried chicken!`,
  chickenWinMessage: `${GAME_CONFIG.senderName} is happy!`,
  chickenLoseMessage: `${GAME_CONFIG.senderName} is still hungry...`,
  chickenLoseDetail: "Not enough, need more!",

  // Stage 2 — Boss Battle
  bossTitle: "FINAL BOSS",
  bossSubtitle: `Defeat ${GAME_CONFIG.senderName}!`,
  bossDescription: `Spam tap the button (or spacebar) to defeat ${GAME_CONFIG.senderName}. But I'm strong, you might not make it~`,
  bossLabelLeft: GAME_CONFIG.senderName,
  bossLabelRight: GAME_CONFIG.recipientName,
  bossWinMessage: `You defeated ${GAME_CONFIG.senderName}!`,
  bossWinSubtext: "Fine, you win...",
  bossLoseMessage: `${GAME_CONFIG.senderName} wins!`,
  bossLoseSubtext: "Told you I'm strong~",

  // Valentine Ask
  valentineEscapeMessages: [
    "",
    "Hey!",
    "Nope~",
    "Think again?",
    "Really?",
    "You sure?",
    "No way!",
    `${GAME_CONFIG.senderName} will cry`,
    "Please~",
    "Say yes!",
  ],

  // Victory
  victoryTitle: `Happy Valentine's Day my love!!`,
  victorySignature: `Your love, ${GAME_CONFIG.senderName}`,
} as const;
