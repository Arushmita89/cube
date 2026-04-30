import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types & constants ──────────────────────────────────────────────────────────
type FaceKey = "U" | "D" | "L" | "R" | "F" | "B";
type Sticker = "W" | "Y" | "O" | "R" | "B" | "G";
type CubeState = Record<FaceKey, Sticker[]>;

const STICKER_COLORS: Record<Sticker, string> = {
  W: "oklch(0.95 0.01 90)",
  Y: "oklch(0.88 0.17 95)",
  O: "oklch(0.74 0.18 55)",
  R: "oklch(0.62 0.22 25)",
  B: "oklch(0.55 0.18 250)",
  G: "oklch(0.65 0.16 150)",
};

const FACE_LABEL: Record<FaceKey, string> = {
  U: "Up", D: "Down", L: "Left", R: "Right", F: "Front", B: "Back",
};

const FACE_COLOR: Record<FaceKey, { sticker: Sticker; label: string }> = {
  U: { sticker: "W", label: "white" },
  D: { sticker: "Y", label: "yellow" },
  L: { sticker: "O", label: "orange" },
  R: { sticker: "R", label: "red" },
  F: { sticker: "G", label: "green" },
  B: { sticker: "B", label: "blue" },
};

const SOLVED: CubeState = {
  U: Array(9).fill("W") as Sticker[],
  D: Array(9).fill("Y") as Sticker[],
  L: Array(9).fill("O") as Sticker[],
  R: Array(9).fill("R") as Sticker[],
  F: Array(9).fill("G") as Sticker[],
  B: Array(9).fill("B") as Sticker[],
};

const SOLUTION_SEQUENCE = [
  { face: "R" as FaceKey, ccw: false },
  { face: "U" as FaceKey, ccw: false },
  { face: "R" as FaceKey, ccw: true },
  { face: "U" as FaceKey, ccw: true },
];

// ── Cube logic ─────────────────────────────────────────────────────────────────
function clone(s: CubeState): CubeState {
  return { U: [...s.U], D: [...s.D], L: [...s.L], R: [...s.R], F: [...s.F], B: [...s.B] };
}
function rotateCW(arr: Sticker[]): Sticker[] {
  return [arr[6], arr[3], arr[0], arr[7], arr[4], arr[1], arr[8], arr[5], arr[2]];
}
function cycle(state: CubeState, groups: Array<{ face: FaceKey; idx: [number, number, number] }>) {
  const tmp = groups[3].idx.map((i) => state[groups[3].face][i]) as Sticker[];
  for (let g = 3; g > 0; g--) {
    const from = groups[g - 1];
    const to = groups[g];
    to.idx.forEach((i, k) => { state[to.face][i] = state[from.face][from.idx[k]]; });
  }
  groups[0].idx.forEach((i, k) => { state[groups[0].face][i] = tmp[k]; });
}
function turnCW(state: CubeState, face: FaceKey): CubeState {
  const s = clone(state);
  s[face] = rotateCW(s[face]);
  switch (face) {
    case "U": cycle(s, [{ face: "F", idx: [0, 1, 2] }, { face: "L", idx: [0, 1, 2] }, { face: "B", idx: [0, 1, 2] }, { face: "R", idx: [0, 1, 2] }]); break;
    case "D": cycle(s, [{ face: "F", idx: [6, 7, 8] }, { face: "R", idx: [6, 7, 8] }, { face: "B", idx: [6, 7, 8] }, { face: "L", idx: [6, 7, 8] }]); break;
    case "F": cycle(s, [{ face: "U", idx: [6, 7, 8] }, { face: "R", idx: [0, 3, 6] }, { face: "D", idx: [2, 1, 0] }, { face: "L", idx: [8, 5, 2] }]); break;
    case "B": cycle(s, [{ face: "U", idx: [2, 1, 0] }, { face: "L", idx: [0, 3, 6] }, { face: "D", idx: [6, 7, 8] }, { face: "R", idx: [8, 5, 2] }]); break;
    case "L": cycle(s, [{ face: "U", idx: [0, 3, 6] }, { face: "F", idx: [0, 3, 6] }, { face: "D", idx: [0, 3, 6] }, { face: "B", idx: [8, 5, 2] }]); break;
    case "R": cycle(s, [{ face: "U", idx: [8, 5, 2] }, { face: "B", idx: [0, 3, 6] }, { face: "D", idx: [8, 5, 2] }, { face: "F", idx: [8, 5, 2] }]); break;
  }
  return s;
}
function turnCCW(state: CubeState, face: FaceKey): CubeState {
  let s = turnCW(state, face);
  s = turnCW(s, face);
  s = turnCW(s, face);
  return s;
}
function scrambled(): CubeState {
  let s = clone(SOLVED);
  s = turnCW(s, "U");
  s = turnCW(s, "R");
  s = turnCCW(s, "U");
  s = turnCCW(s, "R");
  return s;
}

const FACE_TRANSFORMS: Record<FaceKey, string> = {
  F: "translateZ(90px)",
  B: "rotateY(180deg) translateZ(90px)",
  R: "rotateY(90deg) translateZ(90px)",
  L: "rotateY(-90deg) translateZ(90px)",
  U: "rotateX(90deg) translateZ(90px)",
  D: "rotateX(-90deg) translateZ(90px)",
};

// ── Guide ──────────────────────────────────────────────────────────────────────
const GUIDE_STEPS = [
  {
    title: "Orbit the cube",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
        <strong className="text-foreground">Drag on empty space</strong> around the cube to spin
        it and view all 6 faces.
      </p>
    ),
  },
  {
    title: "Turn a face",
    content: (
      <div className="space-y-2 text-sm leading-relaxed">
        <p><strong className="text-foreground">Tap any face</strong> to rotate it <strong className="text-foreground">clockwise ↻</strong>.</p>
        <p>Use the <strong className="text-foreground">↻ / ↺ toggle</strong> below the cube to switch direction before tapping.</p>
      </div>
    ),
  },
  {
    title: "The six faces",
    content: (
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-[color:var(--muted-foreground)]">
        {(Object.entries(FACE_COLOR) as [FaceKey, { sticker: Sticker; label: string }][]).map(([key, { sticker, label }]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
              style={{
                background: STICKER_COLORS[sticker],
                border: "1px solid rgba(0,0,0,0.15)",
              }}
            />
            <span>
              <strong className="text-foreground">{key}</strong> — {FACE_LABEL[key]} ({label})
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Your goal",
    content: (
      <div className="space-y-2 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
        <p>
          The cube is already scrambled for you.
        </p>
        <p className="text-xs italic">
          Follow the hint shown above the cube — one correct move at a time.
        </p>
      </div>
    ),
  },
];

function Guide({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const total = GUIDE_STEPS.length;
  const isLast = step === total - 1;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <p className="font-display text-[10px] tracking-[0.35em] text-[color:var(--muted-foreground)] italic">
        HOW TO PLAY — {step + 1} / {total}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 space-y-3 shadow-sm"
        >
          <h3 className="font-display text-base font-semibold tracking-tight">{GUIDE_STEPS[step].title}</h3>
          <div>{GUIDE_STEPS[step].content}</div>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-1.5">
        {GUIDE_STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} aria-label={`Go to step ${i + 1}`}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: i === step ? "oklch(0.82 0.14 80)" : "oklch(0.82 0.14 80 / 0.25)",
              transform: i === step ? "scale(1.25)" : "scale(1)",
            }} />
        ))}
      </div>
      <div className="flex items-center gap-3 w-full">
        {step > 0 && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 rounded-xl border border-[color:var(--border)] py-2.5 text-sm text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)] transition-colors">
            ← Back
          </motion.button>
        )}
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => (isLast ? onDone() : setStep((s) => s + 1))}
          className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors"
          style={{
            background: isLast ? "oklch(0.82 0.14 80)" : "oklch(0.82 0.14 80 / 0.15)",
            color: isLast ? "#1a1000" : "oklch(0.82 0.14 80)",
          }}>
          {isLast ? "Start solving →" : "Next →"}
        </motion.button>
      </div>
      {!isLast && (
        <button onClick={onDone}
          className="font-display text-semibold text-[11px] italic tracking-[0.3em] text-[color:black] underline decoration-[var(--gold)]/30 underline-offset-4 hover:text-foreground transition-colors">
          skip guide
        </button>
      )}
    </div>
  );
}

// ── Face component ─────────────────────────────────────────────────────────────
function Face({
  face, stickers, onTurn, ccwMode,
}: {
  face: FaceKey;
  stickers: Sticker[];
  onTurn: (face: FaceKey, ccw: boolean) => void;
  ccwMode: boolean;
}) {
  const [pulse, setPulse] = useState(false);
  return (
    <div className="absolute left-1/2 top-1/2"
      style={{ width: 180, height: 180, marginLeft: -90, marginTop: -90, transform: FACE_TRANSFORMS[face], transformStyle: "preserve-3d" }}>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          setPulse(true);
          setTimeout(() => setPulse(false), 250);
          // desktop: shift key overrides; mobile: use ccwMode toggle
          const ccw = e.shiftKey || ccwMode;
          onTurn(face, ccw);
        }}
        title={`${FACE_LABEL[face]} — tap to rotate`}
        className="group relative grid h-full w-full grid-cols-3 grid-rows-3 gap-[3px] rounded-md p-[5px] transition-shadow"
        style={{
          background: "oklch(0.05 0.005 250)",
          boxShadow: pulse
            ? "0 0 24px oklch(0.82 0.14 80 / 0.8), inset 0 0 0 2px oklch(0.82 0.14 80)"
            : "inset 0 0 0 1px oklch(1 0 0 / 0.05)",
          backfaceVisibility: "hidden",
        }}
      >
        {stickers.map((s, i) => (
          <span key={i} className="block rounded-[5px]"
            style={{
              background: STICKER_COLORS[s],
              boxShadow: "inset 0 -3px 5px oklch(0 0 0 / 0.3), inset 0 1px 2px oklch(1 0 0 / 0.4)",
            }} />
        ))}
      </button>
    </div>
  );
}

// ── Cube component ─────────────────────────────────────────────────────────────
function RubiksCubeInner({ onSolved }: { onSolved: () => void }) {
  const [state, setState] = useState<CubeState>(() => scrambled());
  const [rx, setRx] = useState(-25);
  const [ry, setRy] = useState(-30);
  const [ccwMode, setCcwMode] = useState(false); // ← inside component
  const draggingRef = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);
  const solvedFiredRef = useRef(false);
  const moveIndexRef = useRef(0);
  const [moveIndex, setMoveIndex] = useState(0);
  //const [hint, setHint] = useState(SOLUTION_SEQUENCE[0].hint);

  const handleTurn = useCallback((face: FaceKey, ccw: boolean) => {
    const current = moveIndexRef.current;
    if (current >= 4) return;

    const currentGoal = SOLUTION_SEQUENCE[current];
    if (face === currentGoal.face && ccw === currentGoal.ccw) {
      setState((prev) => (ccw ? turnCCW(prev, face) : turnCW(prev, face)));
      moveIndexRef.current = current + 1;
      setMoveIndex(current + 1);
      //setHint(current === 3 ? "🎉 SOLVED!" : SOLUTION_SEQUENCE[current + 1].hint);
    } else {
      console.log("Wrong Move");
      //setHint(`Try again! ${currentGoal.hint}`);
    }
  }, []);

  useEffect(() => {
    if (moveIndex >= 4 && !solvedFiredRef.current) {
      solvedFiredRef.current = true;
      setTimeout(() => onSolved(), 800);
    }
  }, [moveIndex]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = { x: e.clientX, y: e.clientY, rx, ry };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = draggingRef.current;
    if (!d) return;
    setRy(d.ry + (e.clientX - d.x) * 0.5);
    setRx(Math.max(-89, Math.min(89, d.rx - (e.clientY - d.y) * 0.5)));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = null;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-semibold" style={{ color: "oklch(0.82 0.14 80)" }}>
        Step {moveIndex} / 4
      </p>
      <p className="sm:text-lg font-semibold italic" style={{ color: "oklch(0.82 0.14 80)" }}>
        Try the Sexy move
      </p>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative cursor-grab touch-none select-none active:cursor-grabbing"
        style={{ width: 360, height: 360, perspective: 1100 }}
      >
        <div aria-hidden
          className="pointer-events-none absolute left-1/2 top-[78%] h-16 w-72 -translate-x-1/2 rounded-[50%]"
          style={{ background: "radial-gradient(ellipse, oklch(0.82 0.14 80 / 0.35), transparent 70%)", filter: "blur(12px)" }} />
        <div className="absolute left-1/2 top-1/2"
          style={{
            width: 0, height: 0, transformStyle: "preserve-3d",
            transform: `translate(-50%, -50%) rotateX(${rx}deg) rotateY(${ry}deg)`,
            transition: draggingRef.current ? "none" : "transform 0.15s ease-out",
          }}>
          {(["U", "D", "L", "R", "F", "B"] as FaceKey[]).map((f) => (
            <Face key={f} face={f} stickers={state[f]} onTurn={handleTurn} ccwMode={ccwMode} />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        {/* Direction toggle — for mobile */}
        <button
          type="button"
          onClick={() => setCcwMode((v) => !v)}
          className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all"
          style={{
            background: ccwMode ? "oklch(0.82 0.14 80)" : "oklch(0.82 0.14 80 / 0.15)",
            color: ccwMode ? "#1a1000" : "oklch(0.82 0.14 80)",
            border: "1px solid oklch(0.82 0.14 80 / 0.4)",
          }}
        >
          {ccwMode ? "↺ Counter-clockwise" : "↻ Clockwise"}
        </button>

        <p className="font-display text-xs italic tracking-[0.2em] text-[color:var(--muted-foreground)]">
          drag to orbit · tap face to turn · toggle direction
        </p>

        <motion.button
          type="button"
          onClick={() => {
            solvedFiredRef.current = true;
            moveIndexRef.current = 4;
            setState(clone(SOLVED));
            onSolved();
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="font-display text-[11px] italic tracking-[0.4em] text-[color:black] underline decoration-[var(--gold)]/40 underline-offset-[6px] hover:text-[color:var(--gold)]"
        >
          solve for me
        </motion.button>
      </div>
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────────
export function RubiksCube({ onSolved }: { onSolved: () => void }) {
  const [phase, setPhase] = useState<"guide" | "play">("guide");

  return (
    <AnimatePresence mode="wait">
      {phase === "guide" ? (
        <motion.div key="guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Guide onDone={() => setPhase("play")} />
        </motion.div>
      ) : (
        <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <RubiksCubeInner onSolved={onSolved} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}