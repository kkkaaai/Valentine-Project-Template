"use client";

import { useEffect, useRef, useState } from "react";
import type { GameAction } from "@/lib/gameTypes";
import { VICTORY_MESSAGE, TEXT } from "@/lib/gameConfig";
import { fireConfettiBurst, fireHearts, fireSideCannons } from "@/lib/confettiEffects";

interface Props {
  dispatch: React.Dispatch<GameAction>;
}

const HEIGHTS = [180, 220, 260, 200, 240] as const;

// ── Gallery Images ──────────────────────────────────────────
// Add your couple photos here! Place them in public/images/ and list them below.
// Example: "/images/gallery-1.jpg", "/images/gallery-2.jpg", etc.
const GALLERY_IMAGES: string[] = [
  // "/images/gallery-1.jpg",
  // "/images/gallery-2.jpg",
  // "/images/gallery-3.jpg",
];

const CURSOR_IMG = "/images/cursor-final.png";
const CURSOR_SIZE = 80;

const HOVER_EXTRA = 80;

export default function Victory({ dispatch }: Props) {
  const cursorRef = useRef<HTMLImageElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${e.clientX - CURSOR_SIZE / 2}px, ${e.clientY - CURSOR_SIZE / 2}px, 0)`;
    };
    document.body.style.cursor = "none";
    window.addEventListener("pointermove", onMove);
    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useEffect(() => {
    fireConfettiBurst();
    fireSideCannons();

    const interval = setInterval(() => {
      fireHearts();
    }, 2500);

    const cannonTimer = setTimeout(() => fireSideCannons(), 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(cannonTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-[100dvh] px-4 py-10 animate-fade-in-up">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-black text-warm-800 mb-8 text-center">
        {TEXT.victoryTitle}
      </h1>

      {/* Photo Gallery — only shows if GALLERY_IMAGES has entries */}
      {GALLERY_IMAGES.length > 0 && (
        <div className="w-full max-w-sm mb-8">
          <div className="columns-2 gap-3 space-y-3">
            {GALLERY_IMAGES.map((src, i) => {
              const baseH = HEIGHTS[i % HEIGHTS.length];
              const h = hoveredIdx === i ? baseH + HOVER_EXTRA : baseH;
              return (
                <div
                  key={i}
                  className="break-inside-avoid relative"
                >
                  <div
                    className="overflow-hidden rounded-xl"
                    style={{
                      height: h,
                      transition: "height 0.35s ease",
                    }}
                    onPointerEnter={() => setHoveredIdx(i)}
                    onPointerLeave={() => setHoveredIdx(null)}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover block rounded-xl"
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Love message */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 max-w-sm w-full shadow-xl border border-warm-200 mb-8
        transition-transform duration-300 ease-out hover:scale-105">
        <p className="text-warm-700 font-semibold whitespace-pre-line text-center leading-relaxed">
          {VICTORY_MESSAGE}
        </p>
      </div>

      {/* Play again */}
      <button
        onPointerDown={() => dispatch({ type: "RESET" })}
        className="px-6 py-3 bg-rose hover:bg-rose-dark active:bg-rose-dark
          text-white font-bold rounded-xl transition-all active:scale-95
          shadow-lg mb-4"
      >
        Play again!
      </button>

      <p className="text-warm-400 text-sm text-center mb-6">
        {TEXT.victorySignature}
      </p>

      {/* Custom cursor — replace cursor-final.png with your own! */}
      <img
        ref={cursorRef}
        src={CURSOR_IMG}
        alt=""
        draggable={false}
        className="pointer-events-none fixed top-0 left-0 z-50"
        style={{ width: CURSOR_SIZE, height: CURSOR_SIZE, objectFit: "contain" }}
      />
    </div>
  );
}
