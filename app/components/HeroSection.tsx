"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const ACCENT = "#0d9488";
const ACCENT_GLOW = "rgba(13,148,136,0.35)";

const slides = [
  {
    image: "/hero2.webp",
    badge: "🔥 الأكثر مبيعاً",
    title: "أحدث آيفون 17",
    subtitle: "برو ماكس",
    desc: "تجربة لا مثيل لها — كاميرا احترافية، أداء خارق، تصميم فاخر",
    btn: { label: "تسوق الآن", href: "/smartphones/iphone-17-pro-max" },
    color: "#053132",
  },
  {
    image: "/hero3.webp",
    badge: "✨ وصل حديثاً",
    title: "سامسونج S26",
    subtitle: "الترا",
    desc: "قوة لا تُضاهى — شاشة AMOLED مذهلة وبطارية تدوم طوال اليوم",
    btn: { label: "اكتشف الآن", href: "/smartphones/samsung-s26-ultra" },
    color: "#092C32",
  },
  {
    image: "/hero5.webp",
    badge: "💻 عروض حصرية",
    title: "ماك بوك اير",
    subtitle: "M3 Chip",
    desc: "خفيف كالريشة، قوي كالعاصفة — الرفيق المثالي للعمل والإبداع",
    btn: { label: "تسوق الآن", href: "/laptops/macbook-air" },
    color: "#0D202E",
  },
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: "شحن سريع",
    desc: "لباب بيتك",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
    title: "أصلية 100%",
    desc: "منتجات معتمدة",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: "ضمان رسمي",
    desc: "على جميع المنتجات",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
    title: "دفع آمن",
    desc: "بطاقة أو كاش",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const titleVariants = {
  hidden: { opacity: 0, x: 60, filter: "blur(12px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

function FloatingOrb({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -20, 0], scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [4, -4]);
  const rotateY = useTransform(mouseX, [-600, 600], [-4, 4]);

  const goTo = useCallback((i: number, dir = 1) => {
    setDirection(dir);
    setCurrent(i);
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % slides.length, 1), 5500);
    return () => clearInterval(t);
  }, [current, goTo]);

  const slide = slides[current];


  return (
    <div dir="rtl">
      {/* ── HERO ── */}
      <section
        className="relative h-[420px] sm:h-[640px] lg:h-[700px] overflow-hidden"
        style={{ background: slide.color, transition: "background 0.8s ease" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouseX.set(e.clientX - rect.left - rect.width / 2);
          mouseY.set(e.clientY - rect.top - rect.height / 2);
        }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{ background: [
            `radial-gradient(ellipse 80% 60% at 70% 50%, ${ACCENT_GLOW}, transparent 70%)`,
            `radial-gradient(ellipse 90% 70% at 60% 40%, ${ACCENT_GLOW}, transparent 70%)`,
            `radial-gradient(ellipse 80% 60% at 70% 50%, ${ACCENT_GLOW}, transparent 70%)`,
          ]}}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating orbs */}
        <FloatingOrb style={{ width: 300, height: 300, top: "-80px", right: "-60px", background: ACCENT_GLOW, filter: "blur(80px)" }} />
        <FloatingOrb style={{ width: 200, height: 200, bottom: "40px", left: "10%", background: ACCENT_GLOW, filter: "blur(60px)", animationDelay: "2s" }} />

        {/* Scanline texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
          backgroundSize: "100% 3px",
        }} />

        {/* Background Image with parallax */}
        <AnimatePresence custom={direction} mode="sync">
          <motion.div
            key={`img-${current}`}
            className="absolute inset-0"
            custom={direction}
            variants={{
              enter: (d) => ({ opacity: 0, scale: 1.08, x: d > 0 ? -40 : 40 }),
              center: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
              exit: (d) => ({ opacity: 0, scale: 1.04, x: d > 0 ? 40 : -40, transition: { duration: 0.5 } }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x > 80) goTo((current - 1 + slides.length) % slides.length, -1);
              else if (info.offset.x < -80) goTo((current + 1) % slides.length, 1);
            }}
          >
            <motion.div className="absolute inset-0 pointer-events-none" style={{ rotateX, rotateY, transformPerspective: 1200 }}>
              <Image src={slide.image} alt={slide.title} fill className="object-cover object-center" priority unoptimized draggable={false} />
            </motion.div>
            {/* Dark overlays */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${slide.color}dd, transparent 60%)` }} />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 flex items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`content-${current}`}
              className="w-full lg:w-[55%] text-right pb-14 sm:pb-0"
              custom={direction}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
            >
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <motion.span
                  className="inline-flex items-center gap-2 mb-3 sm:mb-5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border text-white"
                  style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}
                  whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.15)" }}
                >
                  {slide.badge}
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-green-400"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.span>
              </motion.div>

              {/* Title */}
              <motion.h2 className="text-white font-black leading-tight mb-2 sm:mb-4" variants={titleVariants}>
                <span className="block text-2xl sm:text-6xl lg:text-7xl drop-shadow-2xl">{slide.title}</span>
                <motion.span
                  className="block text-3xl sm:text-7xl lg:text-8xl"
                  style={{ color: ACCENT }}
                >
                  {slide.subtitle}
                </motion.span>
              </motion.h2>

              {/* Desc */}
              <motion.p
                className="text-gray-200/90 text-xs sm:text-xl lg:text-2xl leading-relaxed mb-4 sm:mb-9 max-w-lg mr-auto"
                variants={itemVariants}
              >
                {slide.desc}
              </motion.p>

              {/* Buttons */}
              <motion.div className="flex items-center justify-start gap-2 sm:gap-3" variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={slide.btn.href}
                    className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-8 sm:py-4 rounded-2xl text-white font-bold text-sm sm:text-lg"
                    style={{ background: ACCENT, boxShadow: `0 8px 32px ${ACCENT_GLOW}` }}
                  >
                    {slide.btn.label}
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"
                      animate={{ x: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </motion.svg>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/smartphones"
                    className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-8 sm:py-4 rounded-2xl text-white font-bold text-sm sm:text-lg border transition-colors duration-300"
                    style={{ background: "rgba(255,255,255,0.07)", borderColor: `${ACCENT}66`, backdropFilter: "blur(12px)" }}
                  >
                    كل المنتجات
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className="rounded-full bg-white/40 hover:bg-white/70 transition-colors"
              animate={{ width: i === current ? 32 : 10, height: 10, background: i === current ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.4)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          ))}
        </div>

        {/* Slide number */}
        <motion.div
          className="absolute bottom-5 right-6 sm:right-10 lg:right-16 text-white/40 text-sm font-mono"
          key={current}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          0{current + 1} / 0{slides.length}
        </motion.div>

        {/* Arrow buttons */}
        {[
          { dir: -1, side: "right-4 sm:right-8", path: "m8.25 4.5 7.5 7.5-7.5 7.5" },
          { dir: 1, side: "left-4 sm:left-8", path: "M15.75 19.5 8.25 12l7.5-7.5" },
        ].map(({ dir, side, path }) => (
          <motion.button
            key={side}
            onClick={() => goTo((current + dir + slides.length) % slides.length, dir)}
            className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 ${side} w-11 h-11 rounded-full text-white items-center justify-center border`}
            style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}
            whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d={path} />
            </svg>
          </motion.button>
        ))}

        {/* ── FLOATING FEATURES (scattered around content) ── */}
        {/* Top-left */}
        <motion.div
          className="hidden lg:flex absolute top-8 left-8 items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.14)" }}
        >
          <span style={{ color: "#5eead4" }}>{features[0].icon}</span>
          <div>
            <p className="font-bold text-sm text-white">{features[0].title}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>{features[0].desc}</p>
          </div>
        </motion.div>

        {/* Top-right */}
        <motion.div
          className="hidden lg:flex absolute top-8 right-8 items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.14)" }}
        >
          <span style={{ color: "#5eead4" }}>{features[1].icon}</span>
          <div>
            <p className="font-bold text-sm text-white">{features[1].title}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>{features[1].desc}</p>
          </div>
        </motion.div>

        {/* Bottom-left */}
        <motion.div
          className="hidden lg:flex absolute bottom-20 left-10 items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.14)" }}
        >
          <span style={{ color: "#5eead4" }}>{features[2].icon}</span>
          <div>
            <p className="font-bold text-sm text-white">{features[2].title}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>{features[2].desc}</p>
          </div>
        </motion.div>

        {/* Middle-left */}
        <motion.div
          className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-24 items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.14)" }}
        >
          <span style={{ color: "#5eead4" }}>{features[3].icon}</span>
          <div>
            <p className="font-bold text-sm text-white">{features[3].title}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>{features[3].desc}</p>
          </div>
        </motion.div>

        {/* Mobile: bottom row */}
        <div className="lg:hidden absolute bottom-4 left-4 right-4 z-10">
          <div className="grid grid-cols-2 gap-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-white/10"
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}
              >
                <span className="shrink-0" style={{ color: "#5eead4" }}>{f.icon}</span>
                <p className="font-bold text-[11px] text-white">{f.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
