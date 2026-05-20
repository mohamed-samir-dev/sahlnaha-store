"use client";

import { motion } from "framer-motion";

const blobs = [
  { size: 520, x: "5%",  y: "2%",  color: "#094F52", duration: 18, delay: 0 },
  { size: 380, x: "70%", y: "5%",  color: "#1B7174", duration: 22, delay: 3 },
  { size: 300, x: "55%", y: "55%", color: "#65E0CD", duration: 20, delay: 1 },
  { size: 420, x: "15%", y: "60%", color: "#094F52", duration: 25, delay: 5 },
  { size: 200, x: "85%", y: "40%", color: "#1B7174", duration: 16, delay: 2 },
  { size: 160, x: "40%", y: "25%", color: "#65E0CD", duration: 14, delay: 4 },
  { size: 260, x: "30%", y: "75%", color: "#1B7174", duration: 19, delay: 6 },
  { size: 140, x: "75%", y: "75%", color: "#65E0CD", duration: 13, delay: 1.5 },
];

const particles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 3,
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  color: ["#65E0CD", "#1B7174", "#094F52", "#F5FFFF"][i % 4],
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 6,
}));

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "linear-gradient(135deg, #000 0%, #051e1f 40%, #094F52 100%)" }}>
      {/* Blobs */}
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            borderRadius: "50%",
            background: b.color,
            filter: "blur(90px)",
            opacity: 0.55,
          }}
          animate={{
            x: [0, 60, -40, 30, 0],
            y: [0, -50, 40, -20, 0],
            scale: [1, 1.15, 0.9, 1.08, 1],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            borderRadius: "50%",
            background: p.color,
            opacity: 1,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -10, 0],
            opacity: [0.7, 1, 0.4, 0.7],
            scale: [1, 1.4, 0.8, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(101,224,205,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(101,224,205,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top shine */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          width: "60%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #65E0CD55, transparent)",
        }}
      />
    </div>
  );
}
