import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RubiksCube } from "@/components/RubiksCube";
import { PhotoBurst } from "@/components/PhotoBurst";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [solved, setSolved] = useState(false);

  // Edit these two strings to personalize the wish.
  const NAME = "[Name]";
  const MESSAGE = `Happiesttt birthdayyy to my rainbow 🌈💖
I loveeeeeeeeee youuuuuuu, okay maybe just a tiny bit less than I love food heheeee… just kidding cuttieeeee 🤭💞
I’ve seen you grow so much, and I wish you to keep growing, more and more everydayyyy✨
I loveeeee youuuu gujubachaaaaaa 💕🥺`;
  return (
    <main className="relative min-h-screen overflow-hidden bg-stage">
      {/* Ambient backdrop: drifting bokeh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 25% 20%, oklch(0.82 0.14 80 / 0.12), transparent 50%), radial-gradient(ellipse at 75% 80%, oklch(0.55 0.18 250 / 0.12), transparent 50%)",
        }}
      />
      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <AnimatePresence mode="wait">
        {!solved ? (
          <motion.section
            key="cube"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 font-display text-5xl italic leading-[1.05] text-gradient-gold sm:text-6xl md:text-7xl"
            >
              Solve the cube,<br />unwrap the moment.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="mx-auto mt-5 max-w-md font-display text-base italic text-[color:var(--muted-foreground)] sm:text-lg"
            >
              Four turns scrambled it. Four turns will set it right.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-14"
            >
              <RubiksCube onSolved={() => setSolved(true)} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1.4 }}
              className="mt-12 flex items-center gap-3 text-[color:var(--muted-foreground)]"
            >
              <span className="h-px w-12 bg-[color:var(--border)]" />
              <span className="font-display text-[10px] tracking-[0.4em]">A GIFT AWAITS</span>
              <span className="h-px w-12 bg-[color:var(--border)]" />
            </motion.div>
          </motion.section>
        ) : (
          <PhotoBurst key="burst" name={NAME} message={MESSAGE} />
        )}
      </AnimatePresence>
    </main>
  );
}
