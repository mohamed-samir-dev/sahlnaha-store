"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  IoCartOutline,
  IoShieldCheckmark,
  IoCarOutline,
  IoCheckmarkDoneCircle,
  IoFlash,
  IoStorefront,
  IoTimeOutline,
  IoBagCheckOutline,
} from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("en-US");

interface ProductInfoProps {
  product: Product;
  addedToCart: boolean;
  onAddToCart: () => void;
}

export default function ProductInfo({ product, addedToCart, onAddToCart }: ProductInfoProps) {
  const router = useRouter();
  const { name, brand, color, storage, network, salePrice, taxIncluded, installment, freeDelivery, deliveryTime, inStock } = product;
  const originalPrice = product.originalPrice || product.price || 0;
  const hasDiscount = salePrice != null && salePrice > 0 && salePrice < originalPrice;
  const savingsPercent = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Brand & Stock */}
      <div className="flex items-center gap-3">
        {brand && (
          <span className="text-[11px] font-bold text-[#053132] bg-[#053132]/5 px-3 py-1.5 rounded-full border border-[#053132]/10 uppercase tracking-wider">
            {brand}
          </span>
        )}
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${
          inStock ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
          {inStock ? "متوفر" : "غير متوفر"}
        </span>
      </div>

      {/* Name */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#053132] leading-tight">
        {name}
      </h1>

      {/* Tags */}
      {(color || storage || network) && (
        <div className="flex gap-2 flex-wrap">
          {[color, storage, network].filter(Boolean).map((t, i) => (
            <span key={i} className="text-xs text-[#092C32]/70 bg-[#092C32]/5 px-3 py-1.5 rounded-xl font-medium">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Price */}
      <div className="bg-gradient-to-l from-[#053132]/[0.03] to-[#0D202E]/[0.02] rounded-2xl p-5 border border-[#053132]/[0.06]">
        {hasDiscount ? (
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#053132]">{fmt(salePrice)}</span>
              <span className="text-sm font-bold text-[#053132]/50">ر.س</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 line-through">{fmt(originalPrice)} ر.س</span>
              <span className="text-[11px] font-bold text-white bg-[#0D202E] px-2.5 py-1 rounded-lg">
                وفّر {savingsPercent}%
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#053132]">{fmt(originalPrice)}</span>
            <span className="text-sm font-bold text-[#053132]/50">ر.س</span>
          </div>
        )}
        {taxIncluded && <p className="text-[10px] text-gray-400 mt-2">شامل ضريبة القيمة المضافة</p>}
      </div>

      {/* Installment */}
      {installment?.available && (
        <div className="flex items-center gap-3 bg-amber-50/60 rounded-xl px-4 py-3 border border-amber-100/50">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <IoFlash size={16} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-800">
              تقسيط متاح {installment.downPayment ? `• مقدم ${fmt(installment.downPayment)} ر.س` : ""}
            </p>
            {installment.note && <p className="text-[10px] text-amber-600/70 mt-0.5">{installment.note}</p>}
          </div>
        </div>
      )}

      {/* Add to Cart - Desktop */}
      <div className="hidden lg:block">
        {!addedToCart ? (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddToCart}
            className="w-full bg-[#053132] text-white font-bold text-base py-4.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#053132]/15 hover:shadow-2xl hover:shadow-[#053132]/25 transition-shadow"
          >
            <IoCartOutline size={22} />
            أضف للسلة
          </motion.button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 py-4 rounded-2xl border border-emerald-200/60">
              <IoCheckmarkDoneCircle size={20} />
              <span className="text-sm font-bold">تمت الإضافة بنجاح</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.back()}
                className="bg-gray-50 hover:bg-gray-100 text-[#053132] font-bold text-sm py-3.5 rounded-xl border border-gray-200/60 transition-colors"
              >
                متابعة التسوق
              </button>
              <button
                onClick={() => router.push("/cart")}
                className="bg-[#053132] text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2"
              >
                <IoBagCheckOutline size={16} />
                عرض السلة
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust Features */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: IoCarOutline, label: freeDelivery ? "توصيل مجاني" : "توصيل سريع", sub: deliveryTime, color: "text-[#053132]", bg: "bg-[#053132]/5" },
          { icon: IoShieldCheckmark, label: "ضمان رسمي", sub: "سنتين", color: "text-[#092C32]", bg: "bg-[#092C32]/5" },
          { icon: IoStorefront, label: inStock ? "متوفر بالمخزون" : "غير متوفر", sub: null, color: inStock ? "text-emerald-600" : "text-red-500", bg: inStock ? "bg-emerald-50" : "bg-red-50" },
          { icon: IoTimeOutline, label: "شحن سريع", sub: "24-48 ساعة", color: "text-[#0B2631]", bg: "bg-[#0B2631]/5" },
        ].map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-3.5 border border-gray-100 hover:border-[#053132]/10 hover:shadow-md transition-all cursor-default"
          >
            <div className={`w-9 h-9 rounded-xl ${f.bg} flex items-center justify-center mb-2.5`}>
              <f.icon size={17} className={f.color} />
            </div>
            <p className="text-[11px] font-bold text-[#053132]">{f.label}</p>
            {f.sub && <p className="text-[9px] text-gray-400 mt-0.5">{f.sub}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
