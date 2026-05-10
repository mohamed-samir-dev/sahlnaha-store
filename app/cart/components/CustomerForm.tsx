"use client";

import { useState, useMemo } from "react";
import {
  IoPersonOutline, IoCardOutline, IoLogoWhatsapp,
  IoCalendarOutline, IoLocationOutline, IoIdCardOutline,
  IoCheckmark,
} from "react-icons/io5";
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
  const MONTHS_OPTIONS = Array.from({ length: installmentMonths ?? 24 }, (_, i) => i + 1);
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
    else if (nationalId.trim().length !== 10) e.nationalId = "يجب أن يكون 10 أرقام";
    if (!whatsapp.trim()) e.whatsapp = "رقم الواتساب مطلوب";
    else if (!/^05\d{8}$/.test(whatsapp.trim())) e.whatsapp = "يبدأ بـ 05 ويتكون من 10 أرقام";
    if (!address.trim()) e.address = "العنوان مطلوب";
    setErrors(e);
    if (!Object.keys(e).length)
      onSubmit({ name, nationalId, whatsapp, address, installmentType, months, downPayment });
  };

  return (
    <div className="space-y-4">

      {/* ── Personal Info ── */}
      <Card icon={<IoPersonOutline size={16} />} title="المعلومات الشخصية">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <InputField
            label="الاسم كاملاً" icon={<IoPersonOutline size={15} />}
            value={name} error={errors.name} placeholder="محمد أحمد"
            onChange={(v) => { setName(v.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "")); setErrors(p => ({ ...p, name: "" })); }}
          />
          <InputField
            label="رقم الهوية / الإقامة" icon={<IoIdCardOutline size={15} />}
            value={nationalId} error={errors.nationalId} placeholder="10XXXXXXXX" maxLength={10}
            onChange={(v) => { setNationalId(v.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, nationalId: "" })); }}
          />
        </div>
      </Card>

      {/* ── Contact ── */}
      <Card icon={<IoLogoWhatsapp size={16} />} title="معلومات التواصل">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <InputField
            label="رقم الواتساب" icon={<IoLogoWhatsapp size={15} />}
            value={whatsapp} error={errors.whatsapp} placeholder="05XXXXXXXX" maxLength={10} dir="ltr"
            onChange={(v) => { setWhatsapp(v.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, whatsapp: "" })); }}
          />
          <InputField
            label="العنوان" icon={<IoLocationOutline size={15} />}
            value={address} error={errors.address} placeholder="المدينة - الحي - الشارع"
            onChange={(v) => { setAddress(v); setErrors(p => ({ ...p, address: "" })); }}
          />
        </div>
      </Card>

      {/* ── Payment ── */}
      <Card icon={<IoCardOutline size={16} />} title="طريقة الدفع">
        {/* Toggle */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {(["full", "installment"] as const).map((type) => {
            const active = installmentType === type;
            return (
              <button
                key={type} type="button"
                onClick={() => setInstallmentType(type)}
                className="relative p-3 sm:p-4 rounded-xl border-2 text-right transition-all duration-200"
                style={active ? { borderColor: "#053132", background: "#05313208" } : { borderColor: "#e5e7eb", background: "#fff" }}
              >
                {active && (
                  <span className="absolute top-2.5 left-2.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#053132" }}>
                    <IoCheckmark size={11} className="text-white" />
                  </span>
                )}
                <p className="text-sm font-black" style={{ color: active ? "#053132" : "#374151" }}>
                  {type === "full" ? "سداد كامل" : "تقسيط"}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: active ? "#0B2631" : "#9ca3af" }}>
                  {type === "full" ? "دفعة واحدة" : "أقساط شهرية"}
                </p>
              </button>
            );
          })}
        </div>

        {installmentType === "installment" && (
          <div className="space-y-4 mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">عدد الأشهر</label>
                <select
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 bg-white focus:outline-none cursor-pointer"
                >
                  {MONTHS_OPTIONS.map((m) => <option key={m} value={m}>{m} شهر</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">الدفعة الأولى</label>
                <select
                  value={String(downPaymentExtra)}
                  onChange={(e) => setDownPaymentExtra(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 bg-white focus:outline-none cursor-pointer"
                >
                  {DOWN_PAYMENT_OPTIONS.map((v) => (
                    <option key={v} value={v - minDownPayment}>{fmt(v)} ر.س</option>
                  ))}
                  <option value={total - minDownPayment}>كامل المبلغ ({fmt(total)} ر.س)</option>
                </select>
              </div>
            </div>

            {/* Monthly highlight */}
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg,#05313210,#0D202E10)" }}>
              <div>
                <p className="text-xs text-gray-500 font-medium">القسط الشهري</p>
                <p className="text-xl font-black mt-0.5" style={{ color: "#053132" }}>
                  {fmt(monthlyPayment)} <span className="text-sm font-medium text-gray-400">ر.س</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">الدفعة الأولى</p>
                <p className="text-base font-black mt-0.5" style={{ color: "#0B2631" }}>
                  {fmt(downPayment)} <span className="text-xs font-medium text-gray-400">ر.س</span>
                </p>
              </div>
            </div>

            {/* Schedule */}
            {months > 0 && (
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <IoCalendarOutline size={14} style={{ color: "#053132" }} />
                  <span className="text-xs font-bold text-gray-600">جدول الأقساط</span>
                  <span className="mr-auto text-[11px] text-gray-400">{months} قسط</span>
                </div>
                <div className="max-h-48 overflow-y-auto scrollbar-visible">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="sticky top-0 bg-white border-b border-gray-100">
                      <tr>
                        <th className="py-2 px-4 text-right font-bold text-gray-400 w-10">#</th>
                        <th className="py-2 px-4 text-right font-bold text-gray-400">التاريخ</th>
                        <th className="py-2 px-4 text-right font-bold text-gray-400">المبلغ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((row, i) => (
                        <tr key={row.index} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                          <td className="py-2.5 px-4 text-gray-300 font-bold">{row.index}</td>
                          <td className="py-2.5 px-4 text-gray-600">{row.date}</td>
                          <td className="py-2.5 px-4 font-black text-gray-900">{fmt(row.amount)} ر.س</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ── Submit ── */}
      <button onClick={handleSubmit} className="cart-btn">
        متابعة الطلب ←
      </button>
    </div>
  );
}

/* ── Sub-components ── */

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 border-b border-gray-100">
        <span style={{ color: "#053132" }}>{icon}</span>
        <span className="text-sm font-black text-gray-800">{title}</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function InputField({
  label, icon, value, error, placeholder, maxLength, dir, onChange,
}: {
  label: string; icon: React.ReactNode; value: string; error?: string;
  placeholder?: string; maxLength?: number; dir?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">{label}</label>
      <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-white transition-all ${error ? "border-red-300 bg-red-50/30" : "border-gray-200 focus-within:border-[#053132] focus-within:ring-2 focus-within:ring-[#05313215]"}`}>
        <span className={error ? "text-red-400" : "text-gray-300"}>{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          dir={dir}
          className="flex-1 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-300"
        />
      </div>
      {error && <p className="text-red-500 text-[11px] font-bold mt-1.5 flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}
