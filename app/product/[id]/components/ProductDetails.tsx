"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoDocumentTextOutline, IoListOutline } from "react-icons/io5";
import type { Product } from "../../../components/products/types";


const specLabels: [keyof NonNullable<Product["specs"]>, string, string][] = [
  ["screen", "الشاشة", "📱"],
  ["processor", "المعالج", "⚡"],
  ["ram", "الرام", "🧠"],
  ["storage", "التخزين", "💾"],
  ["rearCamera", "الكاميرا الخلفية", "📸"],
  ["frontCamera", "الكاميرا الأمامية", "🤳"],
  ["battery", "البطارية", "🔋"],
  ["batteryLife", "عمر البطارية", "⏱️"],
  ["charging", "الشحن", "🔌"],
  ["os", "نظام التشغيل", "💻"],
  ["extras", "مميزات إضافية", "✨"],
];

interface ProductDetailsProps {
  description?: string;
  specs?: Product["specs"];
}

type Tab = "specs" | "description";

export default function ProductDetails({ description, specs }: ProductDetailsProps) {
  const hasSpecs = specs && Object.values(specs).some(Boolean);
  const tabs: { key: Tab; label: string; icon: typeof IoListOutline; show: boolean }[] = [
    { key: "specs", label: "المواصفات", icon: IoListOutline, show: !!hasSpecs },
    { key: "description", label: "الوصف", icon: IoDocumentTextOutline, show: !!description },
  ];
  const visibleTabs = tabs.filter((t) => t.show);
  const [active, setActive] = useState<Tab>(visibleTabs[0]?.key || "specs");

  if (!visibleTabs.length) return null;

  return (
    <div className="mt-12 sm:mt-16">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {visibleTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              active === t.key
                ? "bg-[#053132] text-white shadow-lg shadow-[#053132]/15"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
        >
          {/* Specs */}
          {active === "specs" && hasSpecs && (
            <div className="divide-y divide-gray-50">
              {specLabels.map(([key, label, emoji]) =>
                specs[key] ? (
                  <div key={key} className="flex items-center px-5 sm:px-7 py-4 sm:py-5 gap-4 hover:bg-[#053132]/[0.02] transition-colors">
                    <span className="text-lg w-7 text-center shrink-0">{emoji}</span>
                    <span className="text-xs sm:text-sm text-gray-400 w-28 sm:w-36 shrink-0 font-medium">{label}</span>
                    <span className="text-xs sm:text-sm text-[#053132] flex-1 font-semibold">{specs[key]}</span>
                  </div>
                ) : null
              )}
            </div>
          )}

          {/* Description */}
          {active === "description" && description && (() => {
            const lines = description.split("\n").map((l) => l.trim()).filter(Boolean);
            const title = lines[0];
            const items = lines.slice(1);
            return (
              <div className="p-5 sm:p-8">
                {title && (
                  <div className="mb-6 pb-5 border-b border-gray-100">
                    <h3 className="text-lg font-black text-[#053132]">{title}</h3>
                  </div>
                )}
                {items.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {items.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#053132]/[0.02] border border-[#053132]/[0.05]"
                      >
                        <span className="w-6 h-6 rounded-lg bg-[#053132] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-[#092C32] font-medium leading-relaxed">
                          {line.replace(/^[•\-\*]\s*/, "")}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
