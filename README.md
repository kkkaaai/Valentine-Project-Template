# Valentine's Day Puzzle Game

A 4-stage Valentine's Day puzzle game you can customize and send to your partner. Built with Next.js, fully client-side, and deployable to Vercel in minutes.

**[Live Demo](https://valentine-project-template.vercel.app)** (with placeholder images)

## What It Looks Like

Your partner will play through 4 stages:

1. **Identity Check** — A password gate with a suspicious face photo that grows bigger with each wrong attempt
2. **Chicken Catch** — A falling-object catching game where your face follows their cursor/finger
3. **Boss Battle** — A tug-of-war where they spam-tap to defeat you (the boss)
4. **Valentine Ask** — "Will you be my valentine?" with a "No" button that runs away
5. **Victory** — Confetti hearts, your love letter, and a photo gallery

## 5-Minute Setup

### 1. Use This Template

Click the green **"Use this template"** button above, or:

```bash
git clone https://github.com/kkkaaai/Valentine-Project-Template.git my-valentine-game
cd my-valentine-game
npm install
npm run dev
```

### 2. Add Your Photos

Drop your images into `public/images/` and replace the placeholders:

| File | What It's For |
|------|--------------|
| `suspicious.png` | Your suspicious/funny face (Stage 1 — Identity Check) |
| `chicken.png` | The falling object to catch (Stage 2) |
| `cursor-hungry.png` | Your face as the cursor — hungry expression (Stage 2) |
| `cursor-happy.png` | Your face as the cursor — happy expression (Stage 2) |
| `boss.png` | Your boss portrait photo (Stage 3 — Boss Battle) |
| `valentine-ask.png` | Image shown during "Be my valentine?" (Stage 4) |
| `cursor-final.png` | Custom cursor on the victory screen |
| `gallery-1.jpg`, `gallery-2.jpg`, ... | Couple photos for the victory gallery (optional) |
| `falling1.png`, `falling2.png`, ... | Small images that float in the background (optional) |

**Tips:**
- Use PNG with transparent backgrounds for cursor/face images (looks way better)
- Gallery images can be any format (jpg, png, webp)
- Recommended size: 400x400 for face photos, any size for gallery

### 3. Customize Your Game

Open **`src/lib/gameConfig.ts`** — this is the only file you need to edit:

```typescript
// ── Names ──────────────────────────────────────
senderName: "Your Name",      // Your name
recipientName: "Babe",        // Your partner's name

// ── Password ───────────────────────────────────
password: "1234",             // Something only they would know
```

You can also customize:
- **Wrong password messages** — funny responses when wrong password is entered
- **Victory message** — your love letter shown at the end
- **All in-game text** — every label and message is in the `TEXT` object
- **Game difficulty** — chicken speed, catch target, boss strength, etc.

### 4. Add Gallery Photos (Optional)

To add a photo gallery on the victory screen, open `src/components/stages/Victory.tsx` and add your images:

```typescript
const GALLERY_IMAGES: string[] = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  // ... add as many as you want
];
```

### 5. Add Floating Background Images (Optional)

To add floating photos in the background, open `src/components/Game.tsx` and add your images:

```typescript
const FALLING_IMAGES: string[] = [
  "/images/falling1.png",
  "/images/falling2.png",
  // ... small transparent PNGs work best
];
```

### 6. Deploy to Vercel

The easiest way:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kkkaaai/Valentine-Project-Template)

Or manually:
1. Push your customized repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Click Deploy — that's it!

Send the URL to your partner and wait for the reaction.

## Game Difficulty Tuning

All difficulty settings are in `src/lib/gameConfig.ts`:

| Setting | Default | What It Does |
|---------|---------|-------------|
| `chickenGameDuration` | 30 | Seconds to play the chicken catch game |
| `chickenCatchTarget` | 50 | Chickens needed to win |
| `maxChickensOnScreen` | 15 | Max simultaneous chickens |
| `chickenSpawnInterval` | 0.25 | Seconds between new chicken spawns |
| `chickenFallSpeedMin` | 80 | Minimum fall speed (px/s) |
| `chickenFallSpeedMax` | 180 | Maximum fall speed (px/s) |
| `playerPushPerTap` | 3 | How much the player gains per tap in boss battle |
| `kaiPushPerSecond` | 15 | How fast the boss pushes back per second |

**Want it easier?** Lower `chickenCatchTarget` and `kaiPushPerSecond`.
**Want it harder?** Raise them and lower `chickenGameDuration`.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **canvas-confetti** for victory effects
- All animations are pure CSS `@keyframes` + `requestAnimationFrame`
- No database, no backend — 100% client-side
- Mobile-first responsive design

## Project Structure

```
src/
  lib/
    gameConfig.ts     <-- THE file to customize (names, messages, difficulty)
    gameTypes.ts      <-- TypeScript types
    confettiEffects.ts
  hooks/
    useGameReducer.ts <-- Core game state machine
    useAnimationLoop.ts
    useCountdown.ts
  components/
    Game.tsx           <-- Top-level orchestrator
    stages/
      IdentityCheck.tsx
      ChickenCatch.tsx
      BossBattle.tsx
      ValentineAsk.tsx
      Victory.tsx
public/
  images/             <-- Drop your photos here
```

## License

MIT — Use it, customize it, make someone smile.

---

Made with love. Originally built by [@kkkaaai](https://github.com/kkkaaai).
