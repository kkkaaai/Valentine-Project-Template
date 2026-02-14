import confetti from "canvas-confetti";

export function fireHearts() {
  const heart = confetti.shapeFromText({ text: "❤️", scalar: 2 });

  confetti({
    particleCount: 12,
    spread: 360,
    startVelocity: 20,
    ticks: 80,
    gravity: 0.5,
    shapes: [heart],
    scalar: 1.2,
    origin: { x: Math.random(), y: Math.random() * 0.5 },
  });
}

export function fireConfettiBurst() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#c9707d", "#e8a5ae", "#c9a96e", "#e0cb9a", "#f5ece3"],
  });
}

export function fireSideCannons() {
  const defaults = {
    particleCount: 35,
    spread: 55,
    colors: ["#c9707d", "#e8a5ae", "#c9a96e", "#e0cb9a", "#faf7f2"],
  };

  confetti({ ...defaults, angle: 60, origin: { x: 0, y: 0.7 } });
  confetti({ ...defaults, angle: 120, origin: { x: 1, y: 0.7 } });
}
