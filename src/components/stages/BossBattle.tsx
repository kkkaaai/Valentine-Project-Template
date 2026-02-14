"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { BossBattleState, GameAction } from "@/lib/gameTypes";
import { GAME_CONFIG, TEXT } from "@/lib/gameConfig";
import { useAnimationLoop } from "@/hooks/useAnimationLoop";

interface Props {
  state: BossBattleState;
  dispatch: React.Dispatch<GameAction>;
}

export default function BossBattle({ state, dispatch }: Props) {
  const [isShaking, setIsShaking] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const tapCountRef = useRef(0);

  // Boss auto-pushes back
  useAnimationLoop(
    (delta) => {
      dispatch({ type: "BOSS_TICK", delta });
    },
    state.status === "playing"
  );

  const handleTap = useCallback(() => {
    if (state.status !== "playing") return;
    dispatch({ type: "BOSS_TAP" });
    tapCountRef.current += 1;

    if (tapCountRef.current % 5 === 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 150);
    }
  }, [state.status, dispatch]);

  // Keyboard handler for spacebar
  useEffect(() => {
    if (state.status !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handleTap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.status, handleTap]);

  // Show overlay on end
  useEffect(() => {
    if (state.status === "won" || state.status === "lost") {
      const timer = setTimeout(() => setShowOverlay(true), 500);
      return () => clearTimeout(timer);
    }
    setShowOverlay(false);
  }, [state.status]);

  // Auto-advance on win
  useEffect(() => {
    if (state.status === "won" && showOverlay) {
      const timer = setTimeout(() => {
        dispatch({ type: "ADVANCE_STAGE" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.status, showOverlay, dispatch]);

  // Idle screen
  if (state.status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 animate-fade-in-up">
        <div className="text-6xl mb-4">👾</div>
        <h1 className="text-2xl md:text-3xl font-black text-warm-800 mb-2 text-center">
          {TEXT.bossTitle}
        </h1>
        <p className="text-rose mb-2 text-center font-semibold">
          {TEXT.bossSubtitle}
        </p>
        <p className="text-warm-500 mb-6 text-center text-sm max-w-xs">
          {TEXT.bossDescription}
        </p>
        <button
          onPointerDown={() => dispatch({ type: "START_BOSS_BATTLE" })}
          className="px-8 py-4 bg-rose hover:bg-rose-dark active:bg-rose-dark
            text-white font-bold text-xl rounded-2xl
            transition-all active:scale-95
            shadow-lg
            animate-pulse-custom"
        >
          Fight!
        </button>
      </div>
    );
  }

  const playerPercent = state.position;
  const bossPercent = 100 - state.position;

  return (
    <div
      className={`flex flex-col items-center min-h-[100dvh] px-4 pt-6 pb-8
        select-none ${isShaking ? "animate-screen-shake" : ""}`}
      style={{ touchAction: "manipulation" }}
    >
      {/* Labels */}
      <div className="w-full max-w-sm mb-2 mt-4">
        <div className="flex justify-between text-sm font-black">
          <span className="text-warm-600">{TEXT.bossLabelLeft}</span>
          <span className="text-rose">{TEXT.bossLabelRight}</span>
        </div>
      </div>

      {/* Tug-of-war bar */}
      <div className="w-full max-w-sm mb-6">
        <div className="relative h-10 rounded-full overflow-hidden border-2 border-warm-200 bg-rose">
          {/* Boss side fills from left */}
          <div
            className="absolute left-0 top-0 h-full bg-warm-600"
            style={{ width: `${bossPercent}%` }}
          />
          {/* Center marker */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/30 -translate-x-1/2 z-10" />
        </div>
        {/* Sword at the boundary */}
        <div className="relative w-full h-0">
          <div
            className="absolute text-xl"
            style={{
              left: `${bossPercent}%`,
              top: -28,
              transform: "translateX(-50%)",
            }}
          >
            ⚔️
          </div>
        </div>
        <div className="flex justify-between text-xs text-warm-400 mt-2 font-semibold">
          <span>{Math.round(bossPercent)}%</span>
          <span>{Math.round(playerPercent)}%</span>
        </div>
      </div>

      {/* Boss portrait card — replace boss-kai.png with your own photo! */}
      <div
        className={`mb-4 flex flex-col items-center ${isShaking ? "animate-screen-shake" : ""}`}
        style={{
          filter: `drop-shadow(0 0 ${Math.max(0, (bossPercent - 50) / 50) * 20}px rgba(220,50,50,${Math.max(0, (bossPercent - 50) / 50) * 0.8}))`,
        }}
      >
        <div className="relative">
          {/* Outer ring */}
          <div
            className="w-52 h-52 rounded-full p-1"
            style={{
              background: `linear-gradient(135deg, #8b5e3c, #c9707d, ${bossPercent > 50 ? `rgba(220,50,50,${(bossPercent - 50) / 50})` : "#c9a96e"}, #8b5e3c)`,
            }}
          >
            {/* Inner photo circle */}
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-warm-800/30">
              <img
                src="/images/boss.png"
                alt="Boss"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>
          {/* BOSS tag */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-warm-800 text-white text-xs font-black px-3 py-0.5 rounded-full tracking-wider">
            BOSS
          </div>
        </div>
      </div>

      {/* Tap button */}
      {state.status === "playing" && (
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              handleTap();
            }}
            className="w-full max-w-sm min-h-[120px] bg-rose
              hover:bg-rose-dark
              active:bg-rose-dark
              text-white font-black text-3xl rounded-3xl
              transition-all active:scale-95
              shadow-xl
              border-b-4 border-rose-dark active:border-b-0"
          >
            TAP!
          </button>
          <p className="text-warm-500 text-sm mt-3 text-center">
            Tap the button or press spacebar!
          </p>
        </div>
      )}

      {/* Win/Lose overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-warm-800/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 mx-4 text-center animate-bounce-in shadow-2xl">
            {state.status === "won" ? (
              <>
                <h2 className="text-2xl font-black text-warm-800 mb-2">
                  {TEXT.bossWinMessage}
                </h2>
                <p className="text-rose font-semibold">
                  {TEXT.bossWinSubtext}
                </p>
                <p className="text-warm-500 text-sm mt-2">
                  One last surprise...
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black text-warm-800 mb-2">
                  {TEXT.bossLoseMessage}
                </h2>
                <p className="text-rose font-semibold mb-4">
                  {TEXT.bossLoseSubtext}
                </p>
                <button
                  onPointerDown={() => {
                    tapCountRef.current = 0;
                    dispatch({ type: "RETRY_STAGE" });
                  }}
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
