import { motion } from "framer-motion";
import { useMemo } from "react";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";
import photo5 from "@/assets/photo-5.jpg";
import photo6 from "@/assets/photo-6.jpg";
import photo7 from "@/assets/photo-7.jpg";
import photo8 from "@/assets/photo-8.jpg";
import photo9 from "@/assets/photo-9.jpg";
import photo10 from "@/assets/photo-10.jpg";

const PHOTOS = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10];

// Hand-picked anchor positions around the screen, avoiding the centered text card.
// Values in viewport units. Each photo gets a target position and slight rotation.
type Anchor = { top: string; left: string; rotate: number; size: number };
const ANCHORS: Anchor[] = [
  { top: "6%",  left: "6%",  rotate: -8, size: 200 },
  { top: "8%",  left: "32%", rotate: 5,  size: 180 },
  { top: "5%",  left: "62%", rotate: -3, size: 200 },
  { top: "10%", left: "82%", rotate: 9,  size: 170 },
  { top: "40%", left: "4%",  rotate: 6,  size: 210 },
  { top: "42%", left: "84%", rotate: -7, size: 200 },
  { top: "70%", left: "8%",  rotate: -4, size: 190 },
  { top: "72%", left: "30%", rotate: 7,  size: 180 },
  { top: "70%", left: "60%", rotate: -6, size: 200 },
  { top: "73%", left: "82%", rotate: 4,  size: 180 },
];

export function PhotoBurst({ name, message }: { name: string; message: string }) {
  // Stagger order with slight randomness for natural feel
  const order = useMemo(() => PHOTOS.map((_, i) => i), []);

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-stage">
      {/* Ambient bokeh */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, oklch(0.82 0.14 80 / 0.15), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.55 0.18 250 / 0.15), transparent 40%)",
        }}
      />

      {/* Box bursting open */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: [1, 1.4, 0], opacity: [1, 1, 0] }}
        transition={{ duration: 0.9, times: [0, 0.4, 1], ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="h-32 w-32 rounded-md"
          style={{
            background: "var(--gradient-gold)",
            boxShadow: "0 0 80px oklch(0.82 0.14 80 / 0.6)",
          }}
        />
      </motion.div>

      {/* Confetti sparks */}
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const dist = 300 + Math.random() * 400;
        return (
          <motion.span
            key={`spark-${i}`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0.4,
            }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 block h-1.5 w-1.5 rounded-full"
            style={{
              background: i % 3 === 0 ? "var(--gold)" : i % 3 === 1 ? "oklch(0.95 0.01 90)" : "var(--cube-orange)",
              boxShadow: "0 0 8px var(--gold)",
            }}
          />
        );
      })}

      {/* Photos flying out to anchors */}
      {order.map((i) => {
        const a = ANCHORS[i];
        const src = PHOTOS[i];
        return (
          <motion.div
            key={i}
            initial={{
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              rotate: 0,
              scale: 0.2,
              opacity: 0,
            }}
            animate={{
              top: a.top,
              left: a.left,
              x: 0,
              y: 0,
              rotate: a.rotate,
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay: 0.5 + i * 0.07,
              duration: 0.9,
              type: "spring",
              damping: 14,
              stiffness: 90,
            }}
            className="absolute"
            style={{ width: a.size, transformOrigin: "center" }}
          >
            <div
              className="rounded-sm bg-white p-2 pb-8"
              style={{ boxShadow: "var(--shadow-photo)" }}
            >
              <img
                src={src}
                alt=""
                width={a.size}
                height={a.size}
                loading="lazy"
                className="block aspect-square w-full object-cover"
              />
            </div>
          </motion.div>
        );
      })}

      {/* Centered birthday wish */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 px-6 text-center"
      >
        <div
          className="relative mx-auto max-w-3xl rounded-sm backdrop-blur-sm"
          style={{
            background: "oklch(0.1 0.02 250 / 0.75)",
            boxShadow: "var(--shadow-cinema)",
            border: "1px solid oklch(0.82 0.14 80 / 0.3)",
          }}
        >
          <h1 className="mt-2 font-display text-5xl italic leading-tight text-gradient-gold sm:text-6xl md:text-7xl">
            Happy Birthday
          </h1>
          <div className="mt-2 font-display text-3xl italic text-[color:var(--foreground)] sm:text-4xl">
            Baaaabbbiiiiiiiiiiii
          </div>
          <p className="mx-auto mt-3 max-w-lg font-display text-base italic leading-relaxed text-[color:var(--muted-foreground)] sm:text-lg whitespace-pre-line">
            {message}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 text-[color:var(--gold)]">
            <span className="h-px w-10 bg-[color:var(--gold)]/40" />
            <span className="font-display text-xs tracking-[0.4em]">✦</span>
            <span className="h-px w-10 bg-[color:var(--gold)]/40" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}