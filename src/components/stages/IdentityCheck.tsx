"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { IdentityCheckState, GameAction } from "@/lib/gameTypes";
import { TEXT } from "@/lib/gameConfig";

interface Props {
  state: IdentityCheckState;
  dispatch: React.Dispatch<GameAction>;
}

export default function IdentityCheck({ state, dispatch }: Props) {
  const [password, setPassword] = useState("");
  const [shaking, setShaking] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (state.lastError) {
      setShaking(true);
      const timer = setTimeout(() => setShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [state.lastError, state.attempts]);

  useEffect(() => {
    if (state.passed) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        dispatch({ type: "ADVANCE_STAGE" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.passed, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    dispatch({ type: "SUBMIT_PASSWORD", password: password.trim() });
    setPassword("");
  };

  if (showWelcome) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 animate-fade-in">
        <h1 className="text-3xl font-black text-rose mb-2 text-center">
          {TEXT.identityWelcome}
        </h1>
        <p className="text-lg text-rose-light text-center">
          {TEXT.identityGameStart}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 animate-fade-in-up">
      {/* Suspicious face photo — replace with your own! */}
      <div className={`mb-6 ${shaking ? "animate-shake" : ""}`}>
        <div
          className="transition-transform duration-300"
          style={{
            transform:
              state.attempts > 0
                ? `scale(${1 + Math.min(state.attempts * 0.08, 0.4)})`
                : "scale(1)",
          }}
        >
          <div className="relative w-48 h-48 md:w-56 md:h-56 overflow-hidden rounded-2xl">
            <Image
              src="/images/suspicious.png"
              alt="Suspicious face"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-black text-warm-800 mb-2 text-center">
        {TEXT.identityQuestion}
      </h1>
      <p className="text-rose mb-6 text-center font-semibold">
        {TEXT.identityHint} 🔐
      </p>

      {/* Error message */}
      {state.lastError && (
        <div
          key={state.attempts}
          role="alert"
          aria-live="assertive"
          className="bg-warm-100 border-2 border-warm-200 rounded-xl px-4 py-2 mb-4 animate-bounce-in"
        >
          <p className="text-rose-dark font-bold text-center text-sm">
            {state.lastError}
          </p>
        </div>
      )}

      {/* Password form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <label htmlFor="password-input" className="sr-only">Password</label>
        <input
          id="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password..."
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full px-4 py-3 rounded-xl border-2 border-warm-200 bg-white
            text-center text-lg font-semibold text-warm-800
            placeholder:text-warm-300
            focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose-light/30
            transition-all"
        />
        <button
          type="submit"
          className="w-full py-3 bg-rose hover:bg-rose-dark active:bg-rose-dark
            text-white font-bold text-lg rounded-xl
            transition-all active:scale-95
            shadow-lg"
        >
          Submit
        </button>
      </form>

      {/* Attempt counter */}
      {state.attempts > 0 && (
        <p className="mt-4 text-warm-500 text-sm">
          Failed attempts: {state.attempts}
        </p>
      )}
    </div>
  );
}
