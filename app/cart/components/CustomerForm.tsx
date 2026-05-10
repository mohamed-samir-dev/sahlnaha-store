"use client";

import { useState, useMemo } from "react";
import {
  User, Phone, MapPin, CreditCard, Calendar,
  IdCard, ChevronDown, CheckCircle2, ArrowLeft, Lock,
} from "lucide-react";
import type { CustomerInfo } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

interface CustomerFormProps {
  total: number;
  itemCount: number;
  initialData?: CustomerInfo | null;
  installmentMonths?: number;
  onSubmit: (info: CustomerInfo) => void;
}

export default function CustomerForm({ total, itemCount, initialData, installmentMonths, onSubmit }: CustomerFormProps) {
  const MONTHS_OPTIONS = Array.from({ length: installmentMonths ?? 24 }, (_, i) => (installmentMonths ?? 24) - i);
  const minDownPayment = 1000 * itemCount;
  const DOWN_PAYMENT_OPTIONS = [minDownPayment, minDownPayment + 500, minDownPayment + 1000];

  const [name, setName] = useState(initialData?.name ?? "");
  const [nationalId, setNationalId] = useState(initialData?.nationalId ?? "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [installmentType, setInstallmentType] = useState<"full" | "installment">(initialData?.installmentType ?? "installment");
  const [months, setMonths] = useState(initialData?.months ?? 24);
  const [downPaymentExtra, setDownPaymentExtra] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const downPayment = minDownPayment + downPaymentExtra;

  const monthlyPayment = useMemo(() => {
    if (installmentType === "full") return 0;
    const remaining = total - downPayment;
    return remaining > 0 ? Math.ceil(remaining / months) : 0;
  }, [total, months, installmentType, downPayment]);

  const schedule = useMemo(() => {
    const now = new Date();
    return Array.from({ length: months }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i + 1, now.getDate());
      return { index: i + 1, date: `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`, amount: monthlyPayment };
    });
  }, [months, monthlyPayment]);

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "الاسم مطلوب";
    if (!nationalId.trim()) e.nationalId = "رقم الهوية مطلوب";
    else if (!/^[12]\d{9}$/.test(nationalId.trim())) e.nationalId = "هوية سعودية: 10 أرقام تبدأ بـ 1 أو 2";
    if (!whatsapp.trim()) e.whatsapp = "رقم الواتساب مطلوب";
    else if (!/^05\d{8}$/.test(whatsapp.trim())) e.whatsapp = "يبدأ بـ 05 ويتكون من 10 أرقام";
    if (!address.trim()) e.address = "العنوان مطلوب";
    setErrors(e);
    if (!Object.keys(e).length)
      onSubmit({ name, nationalId, whatsapp, address, installmentType, months, downPayment });
  };

  const isPersonalDone = name.trim() && nationalId.trim() && !errors.name && !errors.nationalId;
  const isContactDone = whatsapp.trim() && address.trim() && !errors.whatsapp && !errors.address;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

      {/* ═══ STEP 1: All Info ═══ */}
      <div className="p-4 sm:p-6 lg:p-7">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
          <StepDot done={!!isPersonalDone && !!isContactDone} number={1} />
          <div>
            <h3 className="text-sm sm:text-base font-black text-gray-900">معلوماتك</h3>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">الاسم والهوية والتواصل والعنوان</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
          <FloatingInput
            label="الاسم الكامل"
            icon={<User size={15} />}
            value={name}
            error={errors.name}
            placeholder="محمد أحمد العلي"
            onChange={(v) => { setName(v.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "")); setErrors(p => ({ ...p, name: "" })); }}
          />
          <FloatingInput
            label="رقم الهوية / الإقامة"
            icon={<IdCard size={15} />}
            value={nationalId}
            error={errors.nationalId}
            placeholder="1XXXXXXXXX"
            maxLength={10}
            onChange={(v) => { setNationalId(v.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, nationalId: "" })); }}
          />
          <FloatingInput
            label="رقم الواتساب"
            icon={<Phone size={15} />}
            value={whatsapp}
            error={errors.whatsapp}
            placeholder="05XXXXXXXX"
            maxLength={10}
            dir="ltr"
            onChange={(v) => { setWhatsapp(v.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, whatsapp: "" })); }}
          />
          <FloatingInput
            label="عنوان التوصيل"
            icon={<MapPin size={15} />}
            value={address}
            error={errors.address}
            placeholder="المدينة - الحي - الشارع"
            onChange={(v) => { setAddress(v); setErrors(p => ({ ...p, address: "" })); }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-l from-transparent via-gray-200 to-transparent mx-4 sm:mx-6" />

      {/* ═══ STEP 2: Payment ═══ */}
      <div className="p-4 sm:p-6 lg:p-7">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
          <StepDot done={false} number={2} />
          <div>
            <h3 className="text-sm sm:text-base font-black text-gray-900">طريقة الدفع</h3>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">اختر الطريقة المناسبة لك</p>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="flex bg-gray-100 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 mb-4 sm:mb-5">
          {([
            { key: "installment" as const, label: "تقسيط شهري", icon: <Calendar size={14} /> },
            { key: "full" as const, label: "دفع كامل", icon: <CreditCard size={14} /> },
          ]).map(({ key, label, icon }) => {
            const active = installmentType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setInstallmentType(key)}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 ${
                  active
                    ? "bg-white text-[#053132] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </div>

        {installmentType === "full" ? (
          <div className="text-center py-5 sm:py-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-100">
            <p className="text-2xl sm:text-3xl font-black text-[#053132]">{fmt(total)} <span className="text-xs sm:text-sm text-gray-400">ر.س</span></p>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2">دفعة واحدة عند الاستلام</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {/* Selectors */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <SelectField
                label="مدة التقسيط"
                value={months}
                onChange={(v) => setMonths(Number(v))}
                options={MONTHS_OPTIONS.map(m => ({ value: m, label: `${m} شهر` }))}
              />
              <SelectField
                label="الدفعة المقدمة"
                value={downPaymentExtra}
                onChange={(v) => setDownPaymentExtra(Number(v))}
                options={[
                  ...DOWN_PAYMENT_OPTIONS.map(v => ({ value: v - minDownPayment, label: `${fmt(v)} ر.س` })),
                  { value: total - minDownPayment, label: `كامل (${fmt(total)})` },
                ]}
              />
            </div>

            {/* Payment Summary Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <PaymentCard label="القسط الشهري" value={`${fmt(monthlyPayment)}`} unit="ر.س" highlight />
              <PaymentCard label="الدفعة الأولى" value={`${fmt(downPayment)}`} unit="ر.س" />
              <PaymentCard label="عدد الأقساط" value={`${months}`} unit="شهر" />
            </div>

            {/* Schedule */}
            {months > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                  <Calendar size={13} className="text-[#053132]" />
                  <span className="text-[11px] sm:text-xs font-bold text-gray-600">جدول السداد</span>
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[9px] sm:text-[10px] text-gray-400 bg-gray-50 px-1.5 sm:px-2 py-0.5 rounded-full">{months} دفعة</span>
                </div>
                <div className="max-h-44 sm:max-h-52 overflow-y-auto rounded-lg sm:rounded-xl border border-gray-100 divide-y divide-gray-50">
                  {schedule.map((row) => (
                    <div key={row.index} className="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-50/50 transition">
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-gray-400 shrink-0">
                        {row.index}
                      </span>
                      <span className="text-[11px] sm:text-xs text-gray-500 mr-2.5 sm:mr-3 flex-1">{row.date}</span>
                      <span className="text-[11px] sm:text-xs font-black text-gray-800">{fmt(row.amount)} ر.س</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ Submit ═══ */}
      <div className="p-4 sm:p-6 lg:p-7 pt-0 sm:pt-0 lg:pt-0">
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-white font-black text-sm sm:text-base transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #053132 0%, #0a5456 100%)" }}
        >
          تأكيد ومتابعة الطلب
          <ArrowLeft size={16} />
        </button>
        <p className="text-center text-[9px] sm:text-[10px] text-gray-400 mt-2.5 sm:mt-3 flex items-center justify-center gap-1">
          <Lock size={10} /> بياناتك محمية ومشفرة بالكامل
        </p>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StepDot({ done, number }: { done: boolean; number: number }) {
  return (
    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
      done ? "bg-emerald-500" : "bg-gradient-to-br from-[#053132] to-[#0a5456]"
    }`}>
      {done ? (
        <CheckCircle2 size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
      ) : (
        <span className="text-white text-xs sm:text-sm font-black">{number}</span>
      )}
    </div>
  );
}

function FloatingInput({
  label, icon, value, error, placeholder, maxLength, dir, onChange,
}: {
  label: string; icon: React.ReactNode; value: string; error?: string;
  placeholder?: string; maxLength?: number; dir?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-500 mb-1.5 sm:mb-2">
        <span className="text-[#053132]">{icon}</span>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        dir={dir}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-900 bg-gray-50 border-2 transition-all duration-200 focus:outline-none placeholder:text-gray-300 ${
          error
            ? "border-red-200 bg-red-50/50 focus:border-red-400"
            : "border-transparent focus:border-[#053132] focus:bg-white focus:shadow-sm"
        }`}
      />
      {error && <p className="text-red-500 text-[9px] sm:text-[10px] font-bold mt-1 sm:mt-1.5">⚠ {error}</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: number; onChange: (v: string) => void;
  options: { value: number; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[10px] sm:text-[11px] font-bold text-gray-500 mb-1 sm:mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-gray-50 border-2 border-transparent rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:border-[#053132] focus:bg-white cursor-pointer transition-all"
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={13} className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function PaymentCard({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-center transition-all ${
      highlight
        ? "bg-gradient-to-br from-[#053132] to-[#0a5456] text-white shadow-lg shadow-[#05313220]"
        : "bg-gray-50 border border-gray-100"
    }`}>
      <p className={`text-[9px] sm:text-[10px] font-medium mb-0.5 sm:mb-1 ${highlight ? "text-white/60" : "text-gray-400"}`}>{label}</p>
      <p className={`text-sm sm:text-lg font-black leading-tight ${highlight ? "text-white" : "text-gray-900"}`}>{value}</p>
      <p className={`text-[9px] sm:text-[10px] ${highlight ? "text-white/50" : "text-gray-400"}`}>{unit}</p>
    </div>
  );
}
