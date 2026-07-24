import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "تم حظر هذا الجهاز",
  robots: { index: false, follow: false },
};

export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-[#07070d] text-white flex items-center justify-center px-4" dir="rtl">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-red-700/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-950/5 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/60 backdrop-blur-sm">
          
          {/* Red top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

          <div className="p-8 flex flex-col items-center text-center">
            {/* Image with ring */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl scale-110" />
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-red-500/40 shadow-xl shadow-red-900/30">
                <Image src="/aa.jpeg" alt="blocked" fill className="object-cover" />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-2 -left-2 w-9 h-9 bg-red-600 rounded-full flex items-center justify-center border-2 border-[#07070d] text-base">
                🚫
              </div>
            </div>

            {/* Title */}
            <div className="mb-1 px-3 py-1 bg-red-950/60 border border-red-800/40 rounded-full text-red-400 text-xs font-semibold tracking-widest uppercase">
              محظور ⛔
            </div>

            <h1 className="mt-4 text-2xl font-black text-white leading-snug">
              يا أخو شرموط انتا وياها 😤
            </h1>

            {/* Divider */}
            <div className="my-5 w-16 h-px bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />

            {/* Messages */}
            <div className="space-y-3 text-sm font-semibold w-full">
              {[
                { emoji: "🦁", text: "لعب مع الأسد صعب" },
                { emoji: "😤", text: "راح أخليكم تندمو على اليوم اللي فكرتو فيه تخونو الأمانة" },
                { emoji: "🚪", text: "وتدخل على جميلات" },
                { emoji: "👎", text: "تعوني يا قليلين الأصل يا جعانين" },
                { emoji: "🖕", text: "عيونكم فارغة يا شرميط" },
              ].map(({ emoji, text }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-right"
                >
                  <span className="text-xl shrink-0">{emoji}</span>
                  <span className="text-gray-300 flex-1">{text}</span>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <p className="mt-6 text-gray-600 text-xs">
              تم الحظر بواسطة النظام الأمني • madar-electronics.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
