"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowForward, IoShareSocial, IoHomeOutline, IoChevronBack } from "react-icons/io5";
import Link from "next/link";
import type { Product } from "../../components/products/types";
import { useCartStore } from "../../store/cartStore";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import ProductDetails from "./components/ProductDetails";


const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch(`${API}/api/products/${id}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <main className="min-h-screen bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="aspect-square bg-gray-50 rounded-3xl animate-pulse" />
            <div className="space-y-6 pt-8">
              <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-12 w-1/3 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 text-lg">المنتج غير موجود</p>
      </div>
    );

  const resolveImg = (src: string) =>
    src.startsWith("http") ? src : src.startsWith("/uploads") ? src : `${API}${src}`;
  const merged = [...(product.images || []), ...(product.image ? [product.image] : [])];
  const allImages = [...new Set(merged)].map(resolveImg);

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.name, url: window.location.href });
    } catch {}
  };

  return (
    <main className="min-h-screen bg-white pb-28 lg:pb-12" dir="rtl">
      {/* ─── Top Bar ─── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#053132]/5 hover:bg-[#053132]/10 text-[#053132] transition-colors"
            >
              <IoArrowForward size={18} />
            </button>
            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
              <Link href="/" className="hover:text-[#053132] transition flex items-center gap-1">
                <IoHomeOutline size={12} />
                الرئيسية
              </Link>
              <IoChevronBack size={10} className="opacity-50" />
              {product.category && (
                <>
                  <span>{product.category}</span>
                  <IoChevronBack size={10} className="opacity-50" />
                </>
              )}
              <span className="text-[#053132] font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>
          </div>
          <button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#053132]/5 hover:bg-[#053132]/10 text-[#053132] transition-colors"
          >
            <IoShareSocial size={16} />
          </button>
        </div>
      </motion.header>

      {/* ─── Main Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductImages images={allImages} name={product.name} discountPercent={product.discountPercent} />
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <ProductInfo
              product={product}
              addedToCart={addedToCart}
              onAddToCart={(qty) => { addItem(product, qty); setAddedToCart(true); }}
              onBuyNow={(qty) => { addItem(product, qty); router.push("/cart"); }}
            />
          </motion.div>
        </div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <ProductDetails
            description={product.description}
            specs={product.specs}
            gallery={product.gallery}
            specifications={product.specifications}
            rating={product.rating}
            reviews={product.reviews}
          />
        </motion.div>
      </div>

      {/* ─── Mobile Floating CTA ─── */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-3 shadow-[0_-8px_30px_rgba(5,49,50,.08)]">
            <div className="flex items-center gap-3" dir="rtl">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 truncate">{product.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-[#053132]">
                    {(product.salePrice ?? product.originalPrice ?? 0).toLocaleString("en-US")}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">ر.س</span>
                </div>
              </div>
              {!addedToCart ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { addItem(product, 1); setAddedToCart(true); }}
                  className="bg-[#053132] text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-[#053132]/20"
                >
                  أضف للسلة
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/cart")}
                  className="bg-[#053132] text-white font-bold text-sm px-7 py-3.5 rounded-2xl flex items-center gap-2"
                >
                  عرض السلة ✓
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
