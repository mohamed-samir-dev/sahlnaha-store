"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag, ChevronRight, Home, ShieldCheck,
  Zap, Package, Truck, Lock, MessageCircle, BadgeCheck,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CartItem from "./components/CartItem";
import CustomerForm from "./components/CustomerForm";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); window.scrollTo(0, 0); }, []);

  const total = mounted ? totalPrice() : 0;
  const count = mounted ? totalItems() : 0;
  const installmentMonths = mounted
    ? Math.max(...items.map((i) => i.product.installment?.months ?? 0)) || undefined
    : undefined;

  if (!mounted) return null;

  /* ── Empty State ── */
  if (items.length === 0)
    return (
      <main className="min-h-[100dvh] bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center gap-5 sm:gap-6 md:gap-8 px-4 sm:px-5" dir="rtl">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#053132] to-[#0a5456] flex items-center justify-center shadow-2xl shadow-[#05313225] animate-pulse">
          <ShoppingBag className="text-white/80 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">سلتك فارغة!</h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xs mx-auto">ابدأ بإضافة المنتجات التي تعجبك وارجع هنا لإتمام الطلب</p>
        </div>
        <button onClick={() => router.push("/")} className="cart-btn w-44 sm:w-52 md:w-56 text-xs sm:text-sm md:text-base">
          🛍️ تصفح المنتجات
        </button>
      </main>
    );

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#f8fafb] to-[#f0f2f5]" dir="rtl">

      {/* ══ HEADER ══ */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 h-12 sm:h-14 md:h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition text-xs sm:text-sm font-bold">
            <ChevronRight className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">رجوع</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingBag className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#053132]" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-[#053132] text-white text-[8px] sm:text-[10px] font-black rounded-full flex items-center justify-center">
                {count}
              </span>
            </div>
            <span className="text-sm sm:text-base md:text-lg font-black text-gray-900">السلة</span>
          </div>

          <Link href="/" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <Home className="w-4 h-4 sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px] text-gray-600" />
          </Link>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-10">

        {/* ── Summary Bar ── */}
        <div className="bg-gradient-to-l from-[#053132] to-[#0a5456] rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 shadow-xl shadow-[#05313215] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-white/60 text-[10px] sm:text-[11px] md:text-xs font-medium mb-0.5">إجمالي الطلب</p>
                <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black">
                  {fmt(total)} <span className="text-xs sm:text-sm md:text-base font-medium text-white/50">ر.س</span>
                </p>
              </div>
              <div className="flex gap-3 sm:gap-4 md:gap-5">
                <MiniStat icon={<ShieldCheck size={15} />} label="ضمان" value="سنتين" />
                <MiniStat icon={<Zap size={15} />} label="توصيل" value="مجاني" />
                <MiniStat icon={<Package size={15} />} label="منتجات" value={`${count}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-8">

          {/* ── RIGHT: Products + Form ── */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5 md:space-y-6">

            {/* Products */}
            <section>
              <SectionHeader title="المنتجات" badge={`${count} منتج`} />
              <div className="space-y-3 mt-3 sm:mt-4">
                {items.map(({ product, qty }) => (
                  <CartItem key={product._id} product={product} qty={qty} onUpdateQty={updateQty} onRemove={removeItem} />
                ))}
              </div>
            </section>

            {/* Mobile Summary */}
            <section className="lg:hidden">
              <SectionHeader title="ملخص الطلب" />
              <div className="mt-3">
                <OrderSummaryMobile items={items} total={total} />
              </div>
            </section>

            {/* Customer Form */}
            <section>
              <SectionHeader title="بيانات الطلب" />
              <div className="mt-3 sm:mt-4">
                <CustomerForm
                  total={total}
                  itemCount={count}
                  initialData={customer}
                  installmentMonths={installmentMonths}
                  onSubmit={(info: CustomerInfo) => {
                    setCustomer(info);
                    router.push("/checkout");
                  }}
                />
              </div>
            </section>
          </div>

          {/* ── LEFT: Sticky Summary (desktop) ── */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="text-sm font-black text-gray-800">ملخص الطلب</h3>
                </div>
                <div className="p-5 space-y-3">
                  {items.map(({ product, qty }) => {
                    const price = product.salePrice ?? product.originalPrice ?? product.price;
                    return (
                      <div key={product._id} className="flex justify-between items-start gap-2">
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-1 flex-1">{product.name} <span className="text-gray-300">×{qty}</span></p>
                        <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{fmt(price * qty)} ر.س</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-dashed border-gray-100 pt-3 mt-3 flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5"><Truck size={13} /> التوصيل</span>
                    <span className="font-bold text-emerald-600">مجاني ✓</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">الإجمالي</span>
                    <span className="text-2xl font-black text-[#053132]">{fmt(total)} <span className="text-xs font-medium text-gray-400">ر.س</span></span>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 grid grid-cols-2 gap-2.5">
                <TrustBadge icon={<Lock size={14} />} text="دفع آمن" />
                <TrustBadge icon={<Truck size={14} />} text="شحن سريع" />
                <TrustBadge icon={<BadgeCheck size={14} />} text="ضمان رسمي" />
                <TrustBadge icon={<MessageCircle size={14} />} text="دعم واتساب" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ── Helpers ── */

function SectionHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-1 h-4 sm:h-5 md:h-6 rounded-full bg-gradient-to-b from-[#053132] to-[#0a5456]" />
      <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-black text-gray-900">{title}</h2>
      {badge && <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 rounded-full">{badge}</span>}
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-1 text-white/70">{icon}</div>
      <p className="text-white/50 text-[8px] sm:text-[9px] md:text-[10px]">{label}</p>
      <p className="text-white text-[10px] sm:text-[11px] md:text-xs font-bold">{value}</p>
    </div>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
      <span className="text-[#053132]">{icon}</span>
      <span className="text-[11px] font-bold text-gray-600">{text}</span>
    </div>
  );
}

function OrderSummaryMobile({ items, total }: { items: { product: { _id: string; name: string; salePrice?: number; originalPrice?: number; price: number }; qty: number }[]; total: number }) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 space-y-2 sm:space-y-2.5">
      {items.map(({ product, qty }) => {
        const price = product.salePrice ?? product.originalPrice ?? product.price;
        return (
          <div key={product._id} className="flex justify-between items-center">
            <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1 flex-1 ml-2 sm:ml-3">{product.name} <span className="text-gray-300">×{qty}</span></p>
            <span className="text-[11px] sm:text-xs font-bold text-gray-700 whitespace-nowrap">{fmt(price * qty)} ر.س</span>
          </div>
        );
      })}
      <div className="border-t border-dashed border-gray-100 pt-2 sm:pt-2.5 flex justify-between text-[11px] sm:text-xs">
        <span className="text-gray-400 flex items-center gap-1"><Truck size={11} className="sm:w-3 sm:h-3" /> التوصيل</span>
        <span className="font-bold text-emerald-600">مجاني</span>
      </div>
      <div className="border-t border-gray-100 pt-2 sm:pt-2.5 flex justify-between items-center">
        <span className="text-xs sm:text-sm font-bold text-gray-700">الإجمالي</span>
        <span className="text-lg sm:text-xl font-black text-[#053132]">{fmt(total)} <span className="text-[10px] sm:text-xs text-gray-400">ر.س</span></span>
      </div>
    </div>
  );
}
