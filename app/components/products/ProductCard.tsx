"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  IoCartOutline,
  IoCheckmarkCircleOutline,
  IoFlash,
  IoCarOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import type { Product } from "./types";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : `${API}${src.startsWith("/") ? src : "/" + src}`;

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { name, discountPercent = 0, brand, color, storage, inStock, installment, freeDelivery, warrantyYears } = product;
  const image = product.images?.[0] || product.image;
  const resolvedImage = image ? resolveImg(image) : undefined;
  const originalPrice = product.originalPrice || product.price || 0;
  const salePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : undefined;
  const hasDiscount = salePrice != null && salePrice < originalPrice;
  const displayPrice = hasDiscount ? salePrice : originalPrice;
  const savings = hasDiscount ? originalPrice - salePrice : 0;
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setAdded(false);
      window.scrollTo(0, 0);
      router.push("/cart");
    }, 1000);
  };

  return (
    <>
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-blue-500/25 flex items-center gap-2.5 text-sm font-semibold animate-fade-in-down">
          <IoCheckmarkCircleOutline size={19} />
          تمت إضافة المنتج للسلة
        </div>
      )}

      <Link
        href={`/product/${product._id}`}
        className="product-card group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden"
        dir="rtl"
      >

        {/* ══════════ IMAGE ZONE ══════════ */}
        <div className="relative w-full aspect-square overflow-hidden bg-white">

          {/* top-right: discount */}
          {discountPercent > 0 && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <div className="flex items-center gap-0.5 bg-red-500 text-white text-[10px] font-black px-2 py-[3px] rounded-lg shadow-lg shadow-red-500/30 leading-none">
                <IoFlash size={8} className="shrink-0" />
                {discountPercent}%
              </div>
            </div>
          )}

          {/* top-left: stock */}
          <div className={`absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-[3px] rounded-lg text-[9px] font-bold border leading-none ${
            inStock
              ? "bg-white/95 text-emerald-600 border-emerald-200/80"
              : "bg-white/95 text-red-500 border-red-200/80"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${inStock ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
            {inStock ? "متوفر" : "نفذ"}
          </div>

          {/* bottom-left: installment */}
          {installment?.available && (
            <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 bg-amber-500 text-white px-2 py-[3px] rounded-lg text-[9px] font-bold leading-none shadow-md shadow-amber-500/20">
              <IoFlash size={8} />
              تقسيط
            </div>
          )}

          {/* product image */}
          {resolvedImage ? (
            <Image
              src={resolvedImage}
              alt={name}
              fill
              className="object-contain p-5 sm:p-7 transition-transform duration-500 ease-out group-hover:scale-[1.08]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-gray-200">📱</div>
          )}
        </div>

        {/* ══════════ CONTENT ZONE ══════════ */}
        <div className="flex flex-col flex-1 px-3 pt-3 pb-3 sm:px-3.5 sm:pt-3.5 sm:pb-3.5 gap-2">

          {/* ── Brand pill ── */}
          {brand && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md uppercase tracking-wide leading-none">
                {brand}
              </span>
              {color && (
                <span className="text-[11px] sm:text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md leading-none">
                  {color}
                </span>
              )}
              {storage && (
                <span className="text-[11px] sm:text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md leading-none">
                  {storage}
                </span>
              )}
            </div>
          )}

          {/* ── Product name ── */}
          <h3 className="text-[13px] sm:text-[14px] font-bold text-gray-800 leading-[1.6] line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 flex-1">
            {name}
          </h3>

          {/* ── Price block ── */}
          <div className="mt-auto">
            <div className="flex items-end justify-between gap-1 mb-2.5">
              <div className="flex flex-col gap-1">
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">
                    {fmt(originalPrice)} ر.س
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-[22px] sm:text-[26px] font-black text-gray-900 leading-none tracking-tight">
                    {fmt(displayPrice!)}
                  </span>
                  <span className="text-xs font-bold text-gray-400">ر.س</span>
                </div>
              </div>

              {hasDiscount && savings > 0 && (
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-gray-400">وفّرت</span>
                  <span className="text-xs font-extrabold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
                    {fmt(savings)} ر.س
                  </span>
                </div>
              )}
            </div>

            {/* ── Trust badges ── */}
            {(warrantyYears > 0 || freeDelivery) && (
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {warrantyYears > 0 && (
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-1 rounded-md">
                    <IoShieldCheckmarkOutline size={12} className="shrink-0" />
                    ضمان {warrantyYears} سنة
                  </span>
                )}
                {freeDelivery && (
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
                    <IoCarOutline size={12} className="shrink-0" />
                    توصيل مجاني
                  </span>
                )}
              </div>
            )}

            {/* ── Cart button ── */}
            <button onClick={handleAddToCart} className={`cart-btn ${added ? "added" : ""}`}>
              {added ? (
                <><IoCheckmarkCircleOutline size={17} />تمت الإضافة</>
              ) : (
                <><IoCartOutline size={17} />أضف للسلة</>
              )}
            </button>
          </div>
        </div>
      </Link>
    </>
  );
}
