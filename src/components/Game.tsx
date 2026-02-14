"use client";

import { useEffect } from "react";
import { useGameReducer } from "@/hooks/useGameReducer";
import IdentityCheck from "@/components/stages/IdentityCheck";
import ChickenCatch from "@/components/stages/ChickenCatch";
import BossBattle from "@/components/stages/BossBattle";
import ValentineAsk from "@/components/stages/ValentineAsk";
import Victory from "@/components/stages/Victory";

// ── Floating background items ──────────────────────────────
// To add your own floating photos, place images in public/images/ and
// add them to the FALLING_IMAGES array below. Otherwise emoji hearts are used.
const FALLING_IMAGES: string[] = [
  // Example: "/images/falling1.png", "/images/falling2.png",
];

const FLOATING_ITEMS: { id: number; left: string; delay: string; duration: string; emoji?: string; image?: string }[] = [
  // Emoji hearts
  ...Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    duration: `${10 + Math.random() * 10}s`,
    emoji: ["💕", "❤️", "💘", "💗", "💖", "💝"][i % 6],
  })),
  // Photo images (only if FALLING_IMAGES has entries)
  ...Array.from({ length: FALLING_IMAGES.length > 0 ? 12 : 0 }, (_, i) => ({
    id: 100 + i,
    left: `${10 + Math.random() * 80}%`,
    delay: `${Math.random() * 14}s`,
    duration: `${8 + Math.random() * 8}s`,
    image: FALLING_IMAGES[i % FALLING_IMAGES.length],
  })),
];

export default function Game() {
  const [state, dispatch] = useGameReducer();

  // Handle transition timing
  useEffect(() => {
    if (state.stage === "transition") {
      const timer = setTimeout(() => {
        dispatch({ type: "TRANSITION_COMPLETE" });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [state.stage, dispatch]);

  return (
    <div className="relative w-full max-w-lg mx-auto min-h-[100dvh] overflow-hidden">
      {/* Floating hearts + photos background */}
      {state.stage !== "chicken_catch" &&
        FLOATING_ITEMS.map((item) => (
          <div
            key={item.id}
            className="floating-heart"
            style={{
              left: item.left,
              animationDelay: item.delay,
              animationDuration: item.duration,
            }}
          >
            {item.emoji ? (
              item.emoji
            ) : (
              <img
                src={item.image}
                alt=""
                draggable={false}
                style={{ width: 40, height: 40, objectFit: "contain", opacity: 0.7 }}
              />
            )}
          </div>
        ))}

      {/* Stage content */}
      <div
        className={`relative z-10 ${
          state.stage === "transition" ? "opacity-0 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300"
        }`}
      >
        {state.stage === "identity_check" && (
          <IdentityCheck state={state.identityCheck} dispatch={dispatch} />
        )}
        {state.stage === "chicken_catch" && (
          <ChickenCatch state={state.chickenCatch} dispatch={dispatch} />
        )}
        {state.stage === "boss_battle" && (
          <BossBattle state={state.bossBattle} dispatch={dispatch} />
        )}
        {state.stage === "valentine_ask" && (
          <ValentineAsk dispatch={dispatch} />
        )}
        {state.stage === "victory" && <Victory dispatch={dispatch} />}
      </div>

      {/* Transition screen */}
      {state.stage === "transition" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-warm-100/80">
          <div className="text-4xl animate-pulse-custom">🖤</div>
        </div>
      )}
    </div>
  );
}
