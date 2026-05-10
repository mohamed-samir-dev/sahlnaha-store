import { IoRocketOutline } from "react-icons/io5";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function OrderSummary({ total, downPayment }: { total: number; downPayment: number }) {
  const remaining = total - downPayment;

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
      <div className="p-4 sm:p-5 space-y-3.5">
        <Row label="مجموع السلة" value={`${fmt(total)} ر.س`} />
        {downPayment > 0 && (
          <>
            <Row label="الدفعة الأولى" value={`${fmt(downPayment)} ر.س`} />
            <Row label="المتبقي للأقساط" value={`${fmt(remaining > 0 ? remaining : 0)} ر.س`} />
          </>
        )}
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-gray-500">التوصيل</span>
          <span className="font-bold text-xs flex items-center gap-1" style={{ color: "#053132" }}>
            <IoRocketOutline size={13} /> مجاني
          </span>
        </div>
      </div>

      <div className="mx-4 mb-4 rounded-xl p-4 flex justify-between items-center" style={{ background: "linear-gradient(135deg,#053132 0%,#0B2631 100%)" }}>
        <span className="text-white font-bold text-sm">المطلوب الآن</span>
        <div className="text-right">
          <span className="text-white text-xl font-black">{fmt(downPayment > 0 ? downPayment : total)}</span>
          <span className="text-white/60 text-xs font-medium mr-1">ر.س</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-xs sm:text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold text-gray-800">{value}</span>
    </div>
  );
}
