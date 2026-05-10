"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoCartOutline, IoChevronBack, IoHomeOutline, IoRocketOutline } from "react-icons/io5";
import CheckoutStepper from "../components/CheckoutStepper";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CartItem from "./components/CartItem";
import CustomerForm from "./components/CustomerForm";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-4" dir="rtl">
        <div className="relative">
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center" style={{ background: "linear-gradient(145deg,#053132,#0D202E)" }}>
            <IoCartOutline size={52} className="text-white/70" />
          </div>
          <span className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full border-2 flex items-center justify-center text-lg shadow-md" style={{ borderColor: "#053132" }}>0</span>
        </div>
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-black text-gray-900">السلة فارغة</h2>
          <p className="text-gray-400 text-sm">أضف منتجات لتبدأ التسوق</p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="cart-btn w-48"
        >
          تصفح المنتجات
        </button>
      </main>
    );

  return (
    <div className="min-h-screen bg-[#f7f8fa]" dir="rtl">

      {/* ══ TOP HEADER ══ */}
      <header className="sticky top-0 z-20" style={{ background: "linear-gradient(135deg,#053132 0%,#082D32 60%,#0D202E 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition text-sm font-semibold"
          >
            <IoChevronBack size={20} />
            <span className="hidden sm:inline">رجوع</span>
          </button>

          {/* Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
              <IoCartOutline size={18} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-white font-black text-sm sm:text-base leading-none">سلة التسوق</p>
              <p className="text-white/50 text-[11px] mt-0.5">{count} منتج</p>
            </div>
          </div>

          {/* Home */}
          <Link
            href="/"
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition text-white"
          >
            <IoHomeOutline size={17} />
          </Link>
        </div>
      </header>

      {/* ══ STEPPER ══ */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <CheckoutStepper active="cart" />
        </div>
      </div>

      {/* ══ BODY ══ */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 lg:gap-8 items-start">

          {/* ── MAIN COLUMN ── */}
          <div className="space-y-5">

            {/* Products */}
            <section>
              <SectionTitle number="01" label={`المنتجات (${count})`} />
              <div className="space-y-3 mt-3">
                {items.map(({ product, qty }) => (
                  <CartItem key={product._id} product={product} qty={qty} onUpdateQty={updateQty} onRemove={removeItem} />
                ))}
              </div>
            </section>

            {/* Order Summary — mobile only (after products) */}
            <section className="lg:hidden">
              <SectionTitle number="02" label="ملخص الطلب" />
              <OrderSummary total={total} fmt={fmt} />
            </section>

            {/* Customer Form */}
            <section>
              <SectionTitle number="03" label="بيانات العميل" />
              <div className="mt-3">
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

          {/* Order Summary — desktop sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-20">
            <SectionTitle number="02" label="ملخص الطلب" />
            <div className="mt-3">
              <OrderSummary total={total} fmt={fmt} />
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

function SectionTitle({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: "linear-gradient(135deg,#053132,#0D202E)" }}>
        {number}
      </span>
      <h2 className="text-sm sm:text-base font-black text-gray-800">{label}</h2>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function OrderSummary({ total, fmt }: { total: number; fmt: (n: number) => string }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">المجموع الفرعي</span>
          <span className="font-bold text-gray-700">{fmt(total)} ر.س</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">رسوم التوصيل</span>
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <IoRocketOutline size={13} /> مجاني
          </span>
        </div>
        <div className="border-t border-dashed border-gray-100 pt-3 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-700">الإجمالي الكلي</span>
          <span className="text-xl font-black" style={{ color: "#053132" }}>
            {fmt(total)} <span className="text-xs font-medium text-gray-400">ر.س</span>
          </span>
        </div>
      </div>
    </div>
  );
}
