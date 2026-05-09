"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  IoHomeOutline,
  IoChevronBack,
  IoArrowForward,
  IoArrowBack,
  IoGridOutline,
  IoFlash,
  IoShieldCheckmarkOutline,
  IoRocketOutline,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../components/products/ProductCard";
import type { Product } from "../../components/products/types";
import { slugConfigs } from "../../lib/categoryConfig";
import { sortProducts } from "../../lib/sortProducts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function filterProducts(products: Product[], slug: string): Product[] {
  const config = slugConfigs[slug];
  if (!config) return products;
  const { brand, category, nameIncludes, nameExcludes } = config.filters;
  return products.filter((p) => {
    const matchBrand = brand ? p.brand?.toLowerCase() === brand.toLowerCase() : true;
    const matchCategory = category ? p.category === category : true;
    const matchName = nameIncludes?.length
      ? nameIncludes.some((kw) => p.name?.toLowerCase().includes(kw.toLowerCase()))
      : true;
    const matchExclude = nameExcludes?.length
      ? !nameExcludes.some((kw) => p.name?.toLowerCase().includes(kw.toLowerCase()))
      : true;
    return matchBrand && matchCategory && matchName && matchExclude;
  });
}


const features = [
  { icon: IoRocketOutline, text: "شحن سريع" },
  { icon: IoShieldCheckmarkOutline, text: "ضمان معتمد" },
  { icon: IoFlash, text: "تقسيط مريح" },
];

export default function CategoryPageClient({ slug }: { slug: string }) {
  const config = slugConfigs[slug];
  if (!config) notFound();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (!slug) return;
    const brand = config?.filters.brand ?? "";
    const query = brand ? `?brand=${encodeURIComponent(brand)}` : "";
    fetch(`${API}/api/products${query}`)
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(sortProducts(filterProducts(data, slug))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, config?.filters.brand]);

  const label = config?.label ?? slug;
  const parentLabel = config?.parentLabel ?? "";
  const parentHref = config?.parentHref ?? "/";
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <>
      <main className="min-h-screen bg-[#f8f9fb]" dir="rtl">
        {/* ═══════════ HERO HEADER ═══════════ */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-teal-900 to-slate-950">

          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-teal-500/20 blur-3xl" />
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16">

            {/* Breadcrumb */}
            <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
              <Link href="/" className="hover:text-white/70 transition flex items-center gap-1">
                <IoHomeOutline size={13} />
                الرئيسية
              </Link>
              <IoChevronBack size={11} />
              <Link href={parentHref} className="hover:text-white/70 transition">{parentLabel}</Link>
              <IoChevronBack size={11} />
              <span className="text-white/70">{label}</span>
            </motion.nav>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

              {/* Title */}
              <div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                  {label}
                  <span className="block mt-1 bg-gradient-to-l from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                    {parentLabel}
                  </span>
                </motion.h1>
              </div>

              {/* Badges */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap gap-3">
                {features.map((b, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                    className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-4 py-2.5 rounded-2xl transition-colors cursor-default">
                    <b.icon size={14} className="text-teal-300" />
                    {b.text}
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>

          {/* Bottom wave */}
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-8 sm:h-10 block relative z-10">
            <path d="M0,40 L0,15 Q360,40 720,15 Q1080,-10 1440,15 L1440,40 Z" fill="#f8f9fb" />
          </svg>
        </div>

        {/* ═══════════ PRODUCTS GRID ═══════════ */}
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse" />
                  <div className="p-3 sm:p-4 space-y-2.5">
                    <div className="h-3.5 bg-gray-100 animate-pulse rounded-full w-3/4" />
                    <div className="h-3.5 bg-gray-100 animate-pulse rounded-full w-1/2" />
                  </div>
                  <div className="h-11 bg-gray-50 animate-pulse mx-3 mb-3 rounded-xl" />
                </div>
              ))}
            </div>
          ) : !products.length ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-5 text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center text-5xl shadow-lg shadow-teal-100/50 border border-teal-100/50"
              >
                📦
              </motion.div>
              <div>
                <p className="text-gray-800 text-lg font-black mb-1.5">المنتجات ستُضاف قريباً</p>
                <p className="text-gray-400 text-sm">هذا القسم قيد التحضير، تابعنا للمزيد</p>
              </div>
              <Link
                href="/"
                className="mt-2 text-sm font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1.5 bg-teal-50 px-5 py-2.5 rounded-full transition-all hover:shadow-md hover:shadow-teal-100"
              >
                <IoArrowForward size={14} />
                العودة إلى الرئيسية
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between mb-6 sm:mb-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-200/50">
                    <IoGridOutline size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-gray-900">جميع المنتجات</h2>
                    <p className="text-[11px] text-gray-400">صفحة {page} من {totalPages || 1}</p>
                  </div>
                </div>
              </motion.div>

              {/* Products */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
                <AnimatePresence mode="wait">
                  {products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center items-center gap-1.5 sm:gap-2 mt-12"
                >
                  <button
                    onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-bold disabled:opacity-30 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all shadow-sm hover:shadow-md"
                  >
                    <IoArrowForward size={14} />
                    السابق
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-black transition-all ${
                        page === n
                          ? "bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-200/60 scale-110"
                          : "bg-white border border-gray-200 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 shadow-sm"
                      }`}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-bold disabled:opacity-30 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all shadow-sm hover:shadow-md"
                  >
                    التالي
                    <IoArrowBack size={14} />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
