"use client";

import { useState, useCallback, useRef } from "react";
import type { GameAction } from "@/lib/gameTypes";
import { TEXT } from "@/lib/gameConfig";

interface Props {
  dispatch: React.Dispatch<GameAction>;
}

export default function ValentineAsk({ dispatch }: Props) {
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [escapeCount, setEscapeCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const runAway = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const padding = 80;
    const x = padding + Math.random() * (rect.width - padding * 2);
    const y = padding + Math.random() * (rect.height - padding * 2);
    setNoPos({ x, y });
    setEscapeCount((c) => c + 1);
  }, []);

  const messages = TEXT.valentineEscapeMessages;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-[100dvh] px-6 animate-fade-in-up"
    >
      {/* Replace with your own image! */}
      <img
        src="/images/valentine-ask.png"
        alt="Valentine"
        className="w-48 h-48 md:w-56 md:h-56 object-contain mb-4"
        draggable={false}
      />
      <h1 className="text-2xl md:text-3xl font-black text-warm-800 mb-3 text-center">
        One last question...
      </h1>
      <p className="text-xl md:text-2xl font-bold text-rose mb-10 text-center">
        Would you like to be my valentine?
      </p>

      {escapeCount > 0 && escapeCount < messages.length && (
        <p className="text-warm-500 text-sm mb-6 animate-fade-in">
          {messages[escapeCount]}
        </p>
      )}
      {escapeCount >= messages.length && (
        <p className="text-warm-500 text-sm mb-6 animate-fade-in">
          {messages[messages.length - 1]}
        </p>
      )}

      {/* Yes button — always centered */}
      <button
        onPointerDown={() => dispatch({ type: "VALENTINE_YES" })}
        className="px-10 py-4 bg-rose hover:bg-rose-dark active:bg-rose-dark
          text-white font-bold text-xl rounded-2xl
          transition-all active:scale-95 shadow-lg z-10"
      >
        Yes!
      </button>

      {/* No button — runs away */}
      <button
        onPointerEnter={runAway}
        onTouchStart={(e) => {
          e.preventDefault();
          runAway();
        }}
        className="px-8 py-3 bg-warm-200 hover:bg-warm-300
          text-warm-600 font-bold text-lg rounded-2xl
          transition-all shadow-sm"
        style={
          noPos
            ? {
                position: "absolute",
                left: noPos.x,
                top: noPos.y,
                transform: "translate(-50%, -50%)",
                transition: "left 0.15s ease-out, top 0.15s ease-out",
              }
            : {
                marginTop: 16,
              }
        }
      >
        No
      </button>
    </div>
  );
}
