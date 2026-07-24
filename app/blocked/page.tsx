import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تم حظر هذا الجهاز",
  robots: { index: false, follow: false },
};

export default function BlockedPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white px-4 text-center"
      dir="rtl"
    >
      {/* Icon */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-red-950/40 border border-red-800/30 flex items-center justify-center">
          <svg
            className="w-14 h-14 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full border border-red-700/20 animate-ping" />
      </div>

      <h1 className="text-3xl font-bold mb-3 text-red-400">تم حظر هذا الجهاز</h1>
      <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
        تم تقييد وصولك إلى هذا الموقع. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم.
      </p>

      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red-800/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
