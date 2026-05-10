"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IoCartOutline, IoChevronBack, IoHomeOutline,
  IoShieldCheckmarkOutline, IoFlashOutline, IoGiftOutline,
} from "react-icons/io5";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CartItem from "./components/CartItem";
import CustomerForm from "./components/CustomerForm";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const total = mounted ? totalPrice() : 0;
  const count = mounted ? totalItems() : 0;
  const installmentMonths = mounted
    ? Math.max(...items.map((i) => i.product.installment?.months ?? 0)) || undefined
    : undefined;

  if (!mounted) return null;

  /* ── Empty State ── */
  if (items.length === 0)
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center gap-8 px-4" dir="rtl">
        <div className="relative animate-pulse">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#053132] to-[#0a4a4c] flex items-center justify-center shadow-2xl shadow-[#05313230]">
            <IoCartOutline size={56} className="text-white/80" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-gray-900">سلتك فارغة!</h2>
          <p className="text-gray-400 text-base max-w-xs mx-auto">ابدأ بإضافة المنتجات التي تعجبك وارجع هنا لإتمام الطلب</p>
        </div>
        <button onClick={() => router.push("/")} className="cart-btn w-56 text-base">
          🛍️ تصفح المنتجات
        </button>
      </main>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafb] to-[#f0f2f5]" dir="rtl">

      {/* ══ HEADER ══ */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition text-sm font-bold">
            <IoChevronBack size={18} />
            <span className="hidden sm:inline">رجوع</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <IoCartOutline size={24} className="text-[#053132]" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#053132] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {count}
              </span>
            </div>
            <span className="text-lg font-black text-gray-900">السلة</span>
          </div>

          <Link href="/" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <IoHomeOutline size={18} className="text-gray-600" />
          </Link>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ── Floating Summary Bar ── */}
        <div className="bg-gradient-to-l from-[#053132] to-[#0a5456] rounded-2xl p-5 sm:p-6 mb-8 shadow-xl shadow-[#05313215] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-white/60 text-xs font-medium mb-1">إجمالي الطلب</p>
              <p className="text-white text-3xl sm:text-4xl font-black">{fmt(total)} <span className="text-base font-medium text-white/50">ر.س</span></p>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <MiniStat icon={<IoShieldCheckmarkOutline size={16} />} label="ضمان" value="سنتين" />
              <MiniStat icon={<IoFlashOutline size={16} />} label="توصيل" value="مجاني" />
              <MiniStat icon={<IoGiftOutline size={16} />} label="منتجات" value={`${count}`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* ── RIGHT: Products + Form ── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Products Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#053132] to-[#0a5456]" />
                <h2 className="text-lg font-black text-gray-900">المنتجات</h2>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{count} منتج</span>
              </div>
              <div className="space-y-3">
                {items.map(({ product, qty }) => (
                  <CartItem key={product._id} product={product} qty={qty} onUpdateQty={updateQty} onRemove={removeItem} />
                ))}
              </div>
            </section>

            {/* Customer Form */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#053132] to-[#0a5456]" />
                <h2 className="text-lg font-black text-gray-900">بيانات الطلب</h2>
              </div>
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
            </section>
          </div>

          {/* ── LEFT: Sticky Summary ── */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Order breakdown */}
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
                  <div className="border-t border-dashed border-gray-100 pt-3 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">التوصيل</span>
                      <span className="font-bold text-emerald-600">مجاني ✓</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">الإجمالي</span>
                      <span className="text-2xl font-black text-[#053132]">{fmt(total)} <span className="text-xs font-medium text-gray-400">ر.س</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 grid grid-cols-2 gap-3">
                <TrustBadge emoji="🔒" text="دفع آمن" />
                <TrustBadge emoji="🚚" text="شحن سريع" />
                <TrustBadge emoji="✅" text="ضمان رسمي" />
                <TrustBadge emoji="💬" text="دعم واتساب" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-1 text-white/70">{icon}</div>
      <p className="text-white/50 text-[10px]">{label}</p>
      <p className="text-white text-xs font-bold">{value}</p>
    </div>
  );
}

function TrustBadge({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
      <span className="text-base">{emoji}</span>
      <span className="text-[11px] font-bold text-gray-600">{text}</span>
    </div>
  );
}
