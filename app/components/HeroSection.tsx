"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    image: "/hero2.webp",
    badge: "🔥 الأكثر مبيعاً",
    title: "أحدث آيفون 17",
    subtitle: "برو ماكس",
    desc: "تجربة لا مثيل لها — كاميرا احترافية، أداء خارق، تصميم فاخر",
    btn: { label: "تسوق الآن", href: "/smartphones/iphone-17-pro-max" },
    gradient: "from-black/80 via-black/40 to-transparent",
    accent: "from-yellow-400 to-orange-500",
  },
  {
    image: "/hero3.webp",
    badge: "✨ وصل حديثاً",
    title: "سامسونج S26",
    subtitle: "الترا",
    desc: "قوة لا تُضاهى — شاشة AMOLED مذهلة وبطارية تدوم طوال اليوم",
    btn: { label: "اكتشف الآن", href: "/smartphones/samsung-s26-ultra" },
    gradient: "from-black/80 via-black/40 to-transparent",
    accent: "from-blue-400 to-cyan-500",
  },
  {
    image: "/hero5.webp",
    badge: "💻 عروض حصرية",
    title: "ماك بوك اير",
    subtitle: "M3 Chip",
    desc: "خفيف كالريشة، قوي كالعاصفة — الرفيق المثالي للعمل والإبداع",
    btn: { label: "تسوق الآن", href: "/laptops/macbook-air" },
    gradient: "from-black/80 via-black/40 to-transparent",
    accent: "from-purple-400 to-pink-500",
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

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((i: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(i);
      setAnimating(false);
    }, 400);
  }, [animating]);

  useEffect(() => {
    const t = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <div dir="rtl">
      {/* ── HERO ── */}
      <section className="relative h-[420px] sm:h-[640px] lg:h-[700px] overflow-hidden">

        {/* Background Image */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${animating ? "opacity-0" : "opacity-100"}`}>
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-l ${slide.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 flex items-center">
          <div className={`w-full lg:w-[52%] text-right transition-all duration-500 pb-14 sm:pb-0 ${animating ? "opacity-0 translate-x-6" : "opacity-100 translate-x-0"}`}>

            {/* Badge */}
            <span className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-white/15 backdrop-blur-sm border border-white/20 text-white">
              {slide.badge}
            </span>

            {/* Title */}
            <h2 className="text-white font-black leading-tight mb-2 sm:mb-3">
              <span className="block text-3xl sm:text-6xl lg:text-7xl">{slide.title}</span>
              <span className={`block text-4xl sm:text-7xl lg:text-8xl bg-gradient-to-l ${slide.accent} bg-clip-text text-transparent`}>
                {slide.subtitle}
              </span>
            </h2>

            {/* Desc */}
            <p className="text-gray-200 text-sm sm:text-xl lg:text-2xl leading-relaxed mb-5 sm:mb-8 max-w-lg mr-auto">
              {slide.desc}
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3">
              <Link
                href={slide.btn.href}
                className={`inline-flex items-center gap-2 px-5 py-3 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-l ${slide.accent} text-white font-bold text-base sm:text-lg shadow-lg hover:-translate-y-1 transition-transform duration-300`}
              >
                {slide.btn.label}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </Link>
              <Link
                href="/smartphones"
                className="inline-flex items-center gap-2 px-5 py-3 sm:px-8 sm:py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/25 text-white font-bold text-base sm:text-lg hover:bg-white/20 transition-colors duration-300"
              >
                كل المنتجات
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-8 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Slide number */}
        <div className="absolute bottom-5 right-6 sm:right-10 lg:right-16 text-white/50 text-sm font-mono">
          0{current + 1} / 0{slides.length}
        </div>

        {/* Arrow buttons */}
        <button
          onClick={() => goTo((current - 1 + slides.length) % slides.length)}
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white items-center justify-center hover:bg-white/25 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        <button
          onClick={() => goTo((current + 1) % slides.length)}
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white items-center justify-center hover:bg-white/25 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

      </section>

      {/* ── FEATURES BAR ── */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-700">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-900 flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4">
              <div className="text-yellow-400 shrink-0">{f.icon}</div>
              <div>
                <p className="font-bold text-sm">{f.title}</p>
                <p className="text-gray-400 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
