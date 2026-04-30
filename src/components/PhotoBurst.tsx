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

// Pre-calculate ALL random values at module level — never inside render
const SPARKS = Array.from({ length: 40 }, (_, i) => ({
  angle: (i / 40) * Math.PI * 2,
  dist: 300 + Math.random() * 400,
  color: i % 3 === 0
    ? "oklch(0.82 0.14 80)"
    : i % 3 === 1
    ? "oklch(0.95 0.01 90)"
    : "oklch(0.74 0.18 55)",
}));

export function PhotoBurst({ message }: { name: string; message: string }) {
  console.log("PhotoBurst MOUNTED");
  const order = useMemo(() => PHOTOS.map((_, i) => i), []);

  const content = (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      overflow: "hidden",
      background: "oklch(0.08 0.02 250)",
      //touchAction: "none",
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

      {/* Box bursting open */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: [1, 1.4, 0], opacity: [1, 1, 0] }}
        transition={{ duration: 0.9, times: [0, 0.4, 1], ease: "easeOut" }}
        style={{ position: "absolute", left: "50%", top: "50%", x: "-50%", y: "-50%" }}
      >
        <div style={{
          height: 128, width: 128, borderRadius: 8,
          background: "linear-gradient(135deg, oklch(0.82 0.14 80), oklch(0.74 0.18 55))",
          boxShadow: "0 0 80px oklch(0.82 0.14 80 / 0.6)",
        }} />
      </motion.div>

      {/* Confetti sparks — pre-calculated, stable values */}
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
            display: "block", height: 6, width: 6, borderRadius: "50%",
            background: spark.color,
            boxShadow: "0 0 8px oklch(0.82 0.14 80)",
          }}
        />
      ))}

      {/* Photos */}
      {order.map((i) => {
        const a = ANCHORS[i];
        return (
          <motion.div
            key={i}
            initial={{ top: "50%", left: "50%", x: "-50%", y: "-50%", rotate: 0, scale: 0.2, opacity: 0 }}
            animate={{ top: a.top, left: a.left, x: 0, y: 0, rotate: a.rotate, scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.07, duration: 0.9, type: "spring", damping: 14, stiffness: 90 }}
            style={{ position: "absolute", width: a.size, transformOrigin: "center" }}
          >
            <div style={{
              borderRadius: 4, background: "white",
              padding: "8px 8px 32px 8px",
              boxShadow: "0 20px 60px oklch(0 0 0 / 0.5)",
            }}>
              <img
                src={PHOTOS[i]}
                alt=""
                width={a.size}
                height={a.size}
                loading="eager"
                decoding="async"
                style={{ display: "block", aspectRatio: "1", width: "100%", objectFit: "cover" }}
              />
            </div>
          </motion.div>
        );
      })}

      {/* Birthday wish */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          pointerEvents: "none", position: "absolute",
          left: "50%", top: "50%", zIndex: 10,
          x: "-50%", y: "-50%",
          padding: "0 24px", textAlign: "center",
        }}
      >
        {/* <div style={{
          position: "relative", margin: "0 auto", maxWidth: 768,
          borderRadius: 4, backdropFilter: "blur(8px)",
          background: "oklch(0.1 0.02 250 / 0.75)",
          boxShadow: "0 40px 120px oklch(0 0 0 / 0.8)",
          border: "1px solid oklch(0.82 0.14 80 / 0.3)",
          padding: "24px 32px 32px",
        }}>
          <h1 className="font-display text-5xl italic leading-tight text-gradient-gold sm:text-6xl md:text-7xl"
            style={{ marginTop: 8 }}>
            Happy Birthday
          </h1>
          <div className="font-display text-3xl italic sm:text-4xl"
            style={{ marginTop: 8, color: "white" }}>
            Baaaabbbiiiiiiiiiiii
          </div>
          <p className="font-display text-base italic leading-relaxed sm:text-lg"
            style={{ margin: "12px auto 0", maxWidth: 512, color: "oklch(0.7 0.05 250)", whiteSpace: "pre-line" }}>
            {message}
          </p>
          <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "oklch(0.82 0.14 80)" }}>
            <span style={{ height: 1, width: 40, background: "oklch(0.82 0.14 80 / 0.4)" }} />
            <span className="font-display" style={{ fontSize: 12, letterSpacing: "0.4em" }}>✦</span>
            <span style={{ height: 1, width: 40, background: "oklch(0.82 0.14 80 / 0.4)" }} />
          </div>
        </div> */}

        <div style={{
          position: "relative", margin: "0 auto", maxWidth: 768,
          borderRadius: 4, backdropFilter: "blur(8px)",
          background: "oklch(0.1 0.02 250 / 0.75)",
          boxShadow: "0 40px 120px oklch(0 0 0 / 0.8)",
          border: "1px solid oklch(0.82 0.14 80 / 0.3)",
          padding: "12px 16px 20px",  // ← smaller padding on all screens
          width: "calc(100vw - 48px)", // ← respects phone edges
          boxSizing: "border-box",
        }}>
          <h1 className="font-display italic leading-tight text-gradient-gold"
            style={{ marginTop: 8, fontSize: "clamp(1.8rem, 6vw, 4rem)" }}> {/* ← fluid font size */}
            Happy Birthday
          </h1>
          <div className="font-display italic"
            style={{ marginTop: 8, color: "white", fontSize: "clamp(1.2rem, 4vw, 2rem)" }}> {/* ← fluid */}
            Baaaabbbiiiiiiiiiiii
          </div>
          <p className="font-display italic leading-relaxed"
            style={{ margin: "12px auto 0", maxWidth: 512, color: "oklch(0.7 0.05 250)", whiteSpace: "pre-line", fontSize: "clamp(0.8rem, 2.5vw, 1rem)" }}>
            {message}
          </p>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "oklch(0.82 0.14 80)" }}>
            <span style={{ height: 1, width: 40, background: "oklch(0.82 0.14 80 / 0.4)" }} />
            <span className="font-display" style={{ fontSize: 12, letterSpacing: "0.4em" }}>✦</span>
            <span style={{ height: 1, width: 40, background: "oklch(0.82 0.14 80 / 0.4)" }} />
          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(content, document.body);
}