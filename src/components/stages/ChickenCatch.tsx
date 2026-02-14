"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ChickenCatchState, GameAction, Chicken } from "@/lib/gameTypes";
import { GAME_CONFIG, TEXT } from "@/lib/gameConfig";
import { useAnimationLoop } from "@/hooks/useAnimationLoop";
import { useCountdown } from "@/hooks/useCountdown";

interface Props {
  state: ChickenCatchState;
  dispatch: React.Dispatch<GameAction>;
}

interface FloatingScore {
  id: number;
  x: number;
  y: number;
}

const ITEM_IMG = GAME_CONFIG.catchItemImage;
const CURSOR_SIZE = 72;
const CURSOR_OFFSET = CURSOR_SIZE / 2;

const HS_KEY = "catch-game-highscore";

export default function ChickenCatch({ state, dispatch }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Chicken[]>([]);
  const nextIdRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const elapsedRef = useRef(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Chicken[]>([]);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [isHappy, setIsHappy] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const floatingIdRef = useRef(0);
  const [highScore, setHighScore] = useState(0);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HS_KEY);
    if (saved) setHighScore(Number(saved));
  }, []);

  // Update high score when game ends
  useEffect(() => {
    if (state.status === "won" || state.status === "lost") {
      if (state.score > highScore) {
        setHighScore(state.score);
        localStorage.setItem(HS_KEY, String(state.score));
      }
    }
  }, [state.status, state.score, highScore]);

  // Initialize item pool
  useEffect(() => {
    itemsRef.current = [];
    nextIdRef.current = 0;
    spawnTimerRef.current = 0;
    elapsedRef.current = 0;
  }, [state.status]);

  // Countdown timer
  useCountdown(
    state.status === "playing",
    () => dispatch({ type: "CHICKEN_TICK" })
  );

  // Show overlay when game ends
  useEffect(() => {
    if (state.status === "won" || state.status === "lost") {
      const timer = setTimeout(() => setShowOverlay(true), 300);
      return () => clearTimeout(timer);
    }
    setShowOverlay(false);
  }, [state.status]);

  // Auto-advance on win
  useEffect(() => {
    if (state.status === "won" && showOverlay) {
      const timer = setTimeout(() => {
        dispatch({ type: "ADVANCE_STAGE" });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state.status, showOverlay, dispatch]);

  // Cursor/face tracking
  const updateCursorPosition = useCallback((clientX: number, clientY: number) => {
    if (!cursorRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    cursorRef.current.style.transform = `translate3d(${x - CURSOR_OFFSET}px, ${y - CURSOR_OFFSET}px, 0)`;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    updateCursorPosition(e.clientX, e.clientY);
  }, [updateCursorPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    updateCursorPosition(e.touches[0].clientX, e.touches[0].clientY);
  }, [updateCursorPosition]);

  // Animation loop for item spawning + falling
  useAnimationLoop(
    (delta) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Track elapsed time for speed ramp-up
      elapsedRef.current += delta;
      const speedMultiplier = 1 + elapsedRef.current / GAME_CONFIG.catchGameDuration;

      // Spawn new items
      spawnTimerRef.current += delta;
      if (
        spawnTimerRef.current >= GAME_CONFIG.itemSpawnInterval &&
        itemsRef.current.filter((c) => c.active && !c.caught).length <
          GAME_CONFIG.maxItemsOnScreen
      ) {
        spawnTimerRef.current = 0;
        const baseSpeed =
          GAME_CONFIG.itemFallSpeedMin +
          Math.random() *
            (GAME_CONFIG.itemFallSpeedMax - GAME_CONFIG.itemFallSpeedMin);
        const item: Chicken = {
          id: nextIdRef.current++,
          x: Math.random() * (width - GAME_CONFIG.itemSize),
          y: -GAME_CONFIG.itemSize,
          speed: baseSpeed * speedMultiplier,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 120,
          active: true,
          caught: false,
        };
        itemsRef.current.push(item);
      }

      // Update positions
      for (const item of itemsRef.current) {
        if (!item.active || item.caught) continue;
        item.y += item.speed * delta;
        item.rotation += item.rotationSpeed * delta;
        if (item.y > height + GAME_CONFIG.itemSize) {
          item.active = false;
        }
      }

      // Clean up inactive items
      itemsRef.current = itemsRef.current.filter(
        (c) => c.active || c.caught
      );

      // Sync to React state for rendering
      setItems([...itemsRef.current.filter((c) => c.active && !c.caught)]);
    },
    state.status === "playing"
  );

  const handleCatchItem = useCallback(
    (itemId: number, x: number, y: number) => {
      const item = itemsRef.current.find((c) => c.id === itemId);
      if (!item || item.caught) return;

      item.caught = true;
      item.active = false;
      dispatch({ type: "CATCH_CHICKEN" });

      // Show +1 floating score
      const fId = floatingIdRef.current++;
      setFloatingScores((prev) => [...prev, { id: fId, x, y }]);
      setTimeout(() => {
        setFloatingScores((prev) => prev.filter((s) => s.id !== fId));
      }, 600);

      // Flash happy face
      setIsHappy(true);
      setTimeout(() => setIsHappy(false), 250);
    },
    [dispatch]
  );

  // Idle screen
  if (state.status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 animate-fade-in-up">
        <img src={ITEM_IMG} alt={GAME_CONFIG.catchItemName} className="w-20 h-20 object-contain mb-4" />
        <h1 className="text-2xl md:text-3xl font-black text-warm-800 mb-2 text-center">
          {TEXT.catchTitle}
        </h1>
        <p className="text-rose mb-2 text-center font-semibold">
          {TEXT.catchSubtitle}
        </p>
        <p className="text-warm-500 mb-6 text-center text-sm">
          Catch {GAME_CONFIG.catchTarget} in{" "}
          {GAME_CONFIG.catchGameDuration} seconds!
        </p>
        <button
          onPointerDown={() => dispatch({ type: "START_CHICKEN_GAME" })}
          className="px-8 py-4 bg-rose hover:bg-rose-dark active:bg-rose-dark
            text-white font-bold text-xl rounded-2xl
            transition-all active:scale-95
            shadow-lg
            animate-pulse-custom"
        >
          Start!
        </button>
        {highScore > 0 && (
          <p className="text-warm-400 text-xs mt-4">
            High score: {highScore}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
      className="relative w-full min-h-[100dvh] overflow-hidden select-none"
      style={{ touchAction: "none", cursor: state.status === "playing" ? "none" : "auto" }}
    >
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 py-3 bg-white/80 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="font-black text-warm-800 text-lg">
            <img src={ITEM_IMG} alt="" className="inline w-6 h-6 object-contain" /> x {state.score}
            <span className="text-warm-500 text-sm font-semibold">
              {" "}
              / {GAME_CONFIG.catchTarget}
            </span>
          </div>
          <div
            className={`font-black text-lg ${
              state.timeLeft <= 5 ? "text-rose-dark animate-pulse-custom" : "text-warm-800"
            }`}
          >
            {state.timeLeft}s
          </div>
        </div>
        {highScore > 0 && (
          <div className="text-warm-400 text-xs text-right">
            Best: {highScore}
          </div>
        )}
      </div>

      {/* Falling items */}
      {items.map((item) => (
        <div
          key={item.id}
          onPointerDown={(e) => {
            e.preventDefault();
            handleCatchItem(item.id, item.x, item.y);
          }}
          className="absolute select-none"
          style={{
            left: 0,
            top: 0,
            transform: `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.rotation}deg)`,
            width: GAME_CONFIG.itemSize,
            height: GAME_CONFIG.itemSize,
            cursor: "none",
            zIndex: 10,
            willChange: "transform",
          }}
        >
          <img
            src={ITEM_IMG}
            alt={GAME_CONFIG.catchItemName}
            draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      ))}

      {/* Floating +1 scores */}
      {floatingScores.map((score) => (
        <div
          key={score.id}
          className="absolute animate-float-up pointer-events-none z-20 font-black text-white text-2xl"
          style={{
            left: score.x,
            top: score.y,
            textShadow: "0 2px 4px rgba(0,0,0,0.5), 0 0 8px rgba(255,200,0,0.6)",
            WebkitTextStroke: "1px rgba(0,0,0,0.3)",
          }}
        >
          +1
        </div>
      ))}

      {/* Face following cursor — replace cursor-hungry.png and cursor-happy.png with your own! */}
      {state.status === "playing" && (
        <div
          ref={cursorRef}
          className="absolute z-20 pointer-events-none transition-none"
          style={{
            width: CURSOR_SIZE,
            height: CURSOR_SIZE,
            left: 0,
            top: 0,
            transform: "translate3d(-100px, -100px, 0)",
          }}
        >
          <img
            src={isHappy ? "/images/cursor-happy.png" : "/images/cursor-hungry.png"}
            alt="cursor"
            draggable={false}
            className={`w-full h-full object-contain rounded-full transition-all duration-100
              ${isHappy ? "scale-125" : ""}`}
          />
        </div>
      )}

      {/* Win/Lose overlay */}
      {showOverlay && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-warm-800/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 mx-4 text-center animate-bounce-in shadow-2xl">
            {state.status === "won" ? (
              <>
                <div className="text-5xl mb-3 flex items-center justify-center gap-2">😋<img src={ITEM_IMG} alt="" className="w-12 h-12 object-contain" /></div>
                <h2 className="text-2xl font-black text-warm-800 mb-2">
                  {TEXT.catchWinMessage}
                </h2>
                <p className="text-rose font-semibold">
                  Score: {state.score} <img src={ITEM_IMG} alt="" className="inline w-5 h-5 object-contain" />
                </p>
                {state.score >= highScore && highScore > 0 && (
                  <p className="text-gold font-black text-sm mt-1">New record!</p>
                )}
                <p className="text-warm-500 text-sm mt-2">
                  Next stage...
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3">😢</div>
                <h2 className="text-2xl font-black text-warm-800 mb-2">
                  {TEXT.catchLoseMessage}
                </h2>
                <p className="text-rose font-semibold mb-1">
                  Only caught {state.score} — {TEXT.catchLoseDetail}
                </p>
                {state.score >= highScore && highScore > 0 && (
                  <p className="text-gold font-black text-sm mb-3">New record!</p>
                )}
                {state.score < highScore && (
                  <p className="text-warm-400 text-xs mb-3">Best: {highScore}</p>
                )}
                <button
                  onPointerDown={() => dispatch({ type: "RETRY_STAGE" })}
                  className="px-6 py-3 bg-rose hover:bg-rose-dark active:bg-rose-dark
                    text-white font-bold rounded-xl transition-all active:scale-95
                    shadow-lg"
                >
                  Try again!
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
