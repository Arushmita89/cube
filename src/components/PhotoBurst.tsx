import { motion } from "framer-motion";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import photo1 from "../assets/photo-1.jpg";
import photo2 from "../assets/photo-2.jpg";
import photo3 from "../assets/photo-3.jpg";
import photo4 from "../assets/photo-4.jpg";
import photo5 from "../assets/photo-5.jpg";
import photo6 from "../assets/photo-6.jpg";
import photo7 from "../assets/photo-7.jpg";
import photo8 from "../assets/photo-8.jpg";
import photo9 from "../assets/photo-9.jpg";
import photo10 from "../assets/photo-10.jpg";

const PHOTOS = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10];

// ── Size is now in vw units so photos scale with the screen ──
type Anchor = { top: string; left: string; rotate: number; sizeVw: number };
const ANCHORS: Anchor[] = [
  { top: "2%",  left: "2%",  rotate: -8, sizeVw: 36 },
  { top: "3%",  left: "34%", rotate:  5, sizeVw: 32 },
  { top: "2%",  left: "64%", rotate: -3, sizeVw: 34 },
  { top: "6%",  left: "82%", rotate:  9, sizeVw: 30 },
  { top: "38%", left: "1%",  rotate:  6, sizeVw: 38 },
  { top: "40%", left: "82%", rotate: -7, sizeVw: 36 },
  { top: "72%", left: "3%",  rotate: -4, sizeVw: 34 },
  { top: "74%", left: "32%", rotate:  7, sizeVw: 32 },
  { top: "72%", left: "62%", rotate: -6, sizeVw: 36 },
  { top: "75%", left: "81%", rotate:  4, sizeVw: 32 },
];

const SPARKS = Array.from({ length: 40 }, (_, i) => ({
  angle: (i / 40) * Math.PI * 2,
  dist: 120 + Math.random() * 180, // reduced — px sparks travel less on mobile
  color:
    i % 3 === 0
      ? "oklch(0.82 0.14 80)"
      : i % 3 === 1
      ? "oklch(0.95 0.01 90)"
      : "oklch(0.74 0.18 55)",
}));

export function PhotoBurst({ message }: { name: string; message: string }) {
  const order = useMemo(() => PHOTOS.map((_, i) => i), []);

  const content = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        overflow: "hidden",
        background: "oklch(0.08 0.02 250)",
      }}
    >
      {/* Ambient bokeh */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          opacity: 0.6,
          background:
            "radial-gradient(circle at 20% 30%, oklch(0.82 0.14 80 / 0.15), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.55 0.18 250 / 0.15), transparent 40%)",
        }}
      />

      {/* Box burst */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: [1, 1.4, 0], opacity: [1, 1, 0] }}
        transition={{ duration: 0.9, times: [0, 0.4, 1], ease: "easeOut" }}
        style={{ position: "absolute", left: "50%", top: "50%", x: "-50%", y: "-50%" }}
      >
        <div
          style={{
            height: 96,
            width: 96,
            borderRadius: 8,
            background: "linear-gradient(135deg, oklch(0.82 0.14 80), oklch(0.74 0.18 55))",
            boxShadow: "0 0 60px oklch(0.82 0.14 80 / 0.6)",
          }}
        />
      </motion.div>

      {/* Sparks */}
      {SPARKS.map((spark, i) => (
        <motion.span
          key={`spark-${i}`}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(spark.angle) * spark.dist,
            y: Math.sin(spark.angle) * spark.dist,
            opacity: 0,
            scale: 0.4,
          }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            display: "block",
            height: 5,
            width: 5,
            borderRadius: "50%",
            background: spark.color,
          }}
        />
      ))}

      {/* Photos — vw-based sizing */}
      {order.map((i) => {
        const a = ANCHORS[i];
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
            style={{
              position: "absolute",
              width: `${a.sizeVw}vw`,
              transformOrigin: "center",
            }}
          >
            <div
              style={{
                borderRadius: 4,
                background: "white",
                padding: "5px 5px 20px 5px",
                boxShadow: "0 12px 40px oklch(0 0 0 / 0.5)",
              }}
            >
              <img
                src={PHOTOS[i]}
                alt=""
                loading="eager"
                decoding="async"
                style={{
                  display: "block",
                  aspectRatio: "1",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </motion.div>
        );
      })}

      {/* Birthday message — sits above everything */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: "50%",
          top: "50%",
          zIndex: 10,
          x: "-50%",
          y: "-50%",
          width: "calc(100vw - 48px)",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            margin: "0 auto",
            maxWidth: 480,
            borderRadius: 8,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)", // Safari
            background: "oklch(0.08 0.02 250 / 0.85)", // slightly more opaque for readability over photos
            boxShadow: "0 24px 80px oklch(0 0 0 / 0.9)",
            border: "1px solid oklch(0.82 0.14 80 / 0.35)",
            padding: "clamp(12px, 4vw, 28px) clamp(14px, 5vw, 32px) clamp(16px, 4vw, 28px)",
          }}
        >
          <h1
            className="font-display italic leading-tight text-gradient-gold"
            style={{ marginTop: 0, fontSize: "clamp(1.6rem, 8vw, 3.5rem)" }}
          >
            Happy Birthday
          </h1>
          <div
            className="font-display italic"
            style={{
              marginTop: 6,
              color: "white",
              fontSize: "clamp(1rem, 5vw, 1.75rem)",
            }}
          >
            Baaaabbbiiiiiiiiiiii
          </div>
          <p
            className="font-display italic leading-relaxed"
            style={{
              margin: "10px auto 0",
              maxWidth: 420,
              color: "oklch(0.72 0.05 250)",
              whiteSpace: "pre-line",
              fontSize: "clamp(0.75rem, 3vw, 0.95rem)",
            }}
          >
            {message}
          </p>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              color: "oklch(0.82 0.14 80)",
            }}
          >
            <span
              style={{
                height: 1,
                width: 32,
                background: "oklch(0.82 0.14 80 / 0.4)",
              }}
            />
            <span
              className="font-display"
              style={{ fontSize: 11, letterSpacing: "0.4em" }}
            >
              ✦
            </span>
            <span
              style={{
                height: 1,
                width: 32,
                background: "oklch(0.82 0.14 80 / 0.4)",
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(content, document.body);
}