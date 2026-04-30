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

const PHOTOS = [
  photo1, photo2, photo3,  // row 1 — 3 across top
  photo4, photo5,          // row 2 — left + right sides
  photo6, photo7,          // row 3 — left + right sides
  photo8, photo9, photo10, // row 4 — 3 across bottom
];

// Each photo knows its row, column slot, and tilt
type PhotoConfig = {
  row: 1 | 2 | 3 | 4;
  slot: "left" | "center" | "right";
  rotate: number;
};

const PHOTO_CONFIGS: PhotoConfig[] = [
  { row: 1, slot: "left", rotate: -6 },
  { row: 1, slot: "center", rotate: 3 },
  { row: 1, slot: "right", rotate: -4 },
  { row: 2, slot: "left", rotate: 5 },
  { row: 2, slot: "right", rotate: -7 },
  { row: 3, slot: "left", rotate: -5 },
  { row: 3, slot: "right", rotate: 6 },
  { row: 4, slot: "left", rotate: 4 },
  { row: 4, slot: "center", rotate: -3 },
  { row: 4, slot: "right", rotate: 5 },
];

// vw-based photo size so nothing clips
const PHOTO_SIZE_VW = 29;

function getPhotoWidth(cfg: PhotoConfig): string {
  return cfg.row === 2 || cfg.row === 3 ? "26vw" : `${PHOTO_SIZE_VW}vw`;
}

function getPosition(cfg: PhotoConfig): { top: string; left: string } {
  const topMap: Record<number, string> = {
    1: "1%",
    2: "22%",
    3: "62%",
    4: "82%",
  };
  const leftMap: Record<string, string> = {
    left:   "1%",
    center: "36%",
    right:  "69%",
  };

  if ((cfg.row === 2 || cfg.row === 3) && cfg.slot === "left")
    return { top: topMap[cfg.row], left: "0%" };
  if ((cfg.row === 2 || cfg.row === 3) && cfg.slot === "right")
    return { top: topMap[cfg.row], left: "74%" };

  return { top: topMap[cfg.row], left: leftMap[cfg.slot] };
}

const SPARKS = Array.from({ length: 36 }, (_, i) => ({
  angle: (i / 36) * Math.PI * 2,
  dist: 100 + Math.random() * 150,
  color:
    i % 3 === 0 ? "oklch(0.82 0.14 80)"
      : i % 3 === 1 ? "oklch(0.95 0.01 90)"
        : "oklch(0.74 0.18 55)",
}));

export function PhotoBurst({ message }: { name: string; message: string }) {
  const order = useMemo(() => PHOTOS.map((_, i) => i), []);

  const content = (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      overflow: "hidden",
      background: "oklch(0.08 0.02 250)",
    }}>

      {/* Ambient bokeh */}
      <div style={{
        pointerEvents: "none",
        position: "absolute",
        inset: 0,
        opacity: 0.6,
        background:
          "radial-gradient(circle at 20% 30%, oklch(0.82 0.14 80 / 0.15), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.55 0.18 250 / 0.15), transparent 40%)",
      }} />

      {/* Box burst */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: [1, 1.4, 0], opacity: [1, 1, 0] }}
        transition={{ duration: 0.9, times: [0, 0.4, 1], ease: "easeOut" }}
        style={{ position: "absolute", left: "50%", top: "50%", x: "-50%", y: "-50%" }}
      >
        <div style={{
          height: 80, width: 80, borderRadius: 8,
          background: "linear-gradient(135deg, oklch(0.82 0.14 80), oklch(0.74 0.18 55))",
          boxShadow: "0 0 60px oklch(0.82 0.14 80 / 0.6)",
        }} />
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
            position: "absolute", left: "50%", top: "50%",
            display: "block", height: 5, width: 5, borderRadius: "50%",
            background: spark.color,
          }}
        />
      ))}

      {/* Photos — grid-positioned absolutely */}
      {order.map((i) => {
        const cfg = PHOTO_CONFIGS[i];
        const pos = getPosition(cfg);
        return (
          <motion.div
            key={i}
            initial={{
              top: "50%", left: "50%",
              x: "-50%", y: "-50%",
              rotate: 0, scale: 0.15, opacity: 0,
            }}
            animate={{
              top: pos.top, left: pos.left,
              x: 0, y: 0,
              rotate: cfg.rotate, scale: 1, opacity: 1,
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
              width: getPhotoWidth(cfg),
              transformOrigin: "center",
              zIndex: 2,
            }}
          >
            <div style={{
              borderRadius: 3,
              background: "white",
              padding: "4px 4px 16px 4px",
              boxShadow: "0 8px 30px oklch(0 0 0 / 0.55)",
            }}>
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

      {/* ── Wish card — true center using CSS transform, NOT Framer x/y ── */}
      {/* Outer div handles centering — never animated */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 20,
          pointerEvents: "none",
          width: "calc(100vw - 56px)",
          maxWidth: 420,
          boxSizing: "border-box",
        }}
      >
        {/* Inner div handles only opacity + scale — no position values */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            borderRadius: 10,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            background: "oklch(0.08 0.02 250 / 0.88)",
            boxShadow: "0 24px 80px oklch(0 0 0 / 0.95), 0 0 0 1px oklch(0.82 0.14 80 / 0.3)",
            padding: "clamp(14px, 5vw, 28px) clamp(16px, 5vw, 32px) clamp(18px, 5vw, 28px)",
            textAlign: "center",
          }}>
            <h1
              className="font-display italic leading-tight text-gradient-gold"
              style={{ margin: 0, fontSize: "clamp(1.6rem, 9vw, 3.5rem)" }}
            >
              Happy Birthday
            </h1>
            <div
              className="font-display italic"
              style={{ marginTop: 6, color: "white", fontSize: "clamp(0.95rem, 5vw, 1.75rem)" }}
            >
              Baaaabbbiiiiiiiiiiii
            </div>
            <p
              className="font-display italic leading-relaxed"
              style={{
                margin: "10px auto 0",
                color: "oklch(0.72 0.05 250)",
                whiteSpace: "pre-line",
                fontSize: "clamp(0.72rem, 3vw, 0.92rem)",
              }}
            >
              {message}
            </p>
            <div style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              color: "oklch(0.82 0.14 80)",
            }}>
              <span style={{ height: 1, width: 28, background: "oklch(0.82 0.14 80 / 0.4)" }} />
              <span className="font-display" style={{ fontSize: 11, letterSpacing: "0.4em" }}>✦</span>
              <span style={{ height: 1, width: 28, background: "oklch(0.82 0.14 80 / 0.4)" }} />
            </div>
          </div>
        </motion.div>
      </div>
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",  // ← true CSS centering, not Framer
          zIndex: 20,
          pointerEvents: "none",
          width: "calc(100vw - 56px)",
          maxWidth: 420,
          boxSizing: "border-box",
        }}
      >
        <div style={{
          borderRadius: 10,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: "oklch(0.08 0.02 250 / 0.88)",
          boxShadow: "0 24px 80px oklch(0 0 0 / 0.95), 0 0 0 1px oklch(0.82 0.14 80 / 0.3)",
          padding: "clamp(14px, 5vw, 28px) clamp(16px, 5vw, 32px) clamp(18px, 5vw, 28px)",
          textAlign: "center",
        }}>
          <h1
            className="font-display italic leading-tight text-gradient-gold"
            style={{ margin: 0, fontSize: "clamp(1.6rem, 9vw, 3.5rem)" }}
          >
            Happy Birthday
          </h1>
          <div
            className="font-display italic"
            style={{
              marginTop: 6,
              color: "white",
              fontSize: "clamp(0.95rem, 5vw, 1.75rem)",
            }}
          >
            Baaaabbbiiiiiiiiiiii
          </div>
          <p
            className="font-display italic leading-relaxed"
            style={{
              margin: "10px auto 0",
              color: "oklch(0.72 0.05 250)",
              whiteSpace: "pre-line",
              fontSize: "clamp(0.72rem, 3vw, 0.92rem)",
            }}
          >
            {message}
          </p>
          <div style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            color: "oklch(0.82 0.14 80)",
          }}>
            <span style={{ height: 1, width: 28, background: "oklch(0.82 0.14 80 / 0.4)" }} />
            <span className="font-display" style={{ fontSize: 11, letterSpacing: "0.4em" }}>✦</span>
            <span style={{ height: 1, width: 28, background: "oklch(0.82 0.14 80 / 0.4)" }} />
          </div>
        </div>
      </motion.div> */}

    </div>
  );

  return createPortal(content, document.body);
}