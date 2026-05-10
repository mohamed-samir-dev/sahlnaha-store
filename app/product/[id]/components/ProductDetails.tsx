"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IoStar } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

interface ProductDetailsProps {
  description?: string;
  specs?: Product["specs"];
  gallery?: Product["gallery"];
  specifications?: Product["specifications"];
  rating?: Product["rating"];
  reviews?: Product["reviews"];
}

export default function ProductDetails({ gallery, specifications, rating, reviews }: ProductDetailsProps) {
  return (
    <div className="mt-14 space-y-14">
      {/* Gallery Cards */}
      {gallery && gallery.length > 0 && (
        <div className={`grid grid-cols-1 gap-4 ${gallery.length === 1 ? 'sm:grid-cols-1' : gallery.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
          {gallery.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative h-52 sm:h-64 rounded-2xl overflow-hidden group"
            >
              <Image
                src={item.url}
                alt={item.caption}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 right-4 left-4 text-white text-sm font-bold">
                {item.caption}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Specifications */}
      {specifications && specifications.length > 0 && (
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#053132] mb-4 sm:mb-6">المواصفات</h2>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            {specifications.map((group, gi) => (
              <div key={gi}>
                <div className="bg-[#053132]/5 px-5 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-[#053132]">{group.groupName}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {group.items.map((item, ii) => (
                    <div
                      key={ii}
                      className={`flex items-center justify-between px-5 py-3.5 border-b border-gray-100 ${
                        ii % 2 === 0 ? "sm:border-l" : ""
                      }`}
                    >
                      <span className="text-xs text-gray-500">{item.label}</span>
                      <span className="text-xs font-semibold text-[#053132]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base sm:text-xl font-black text-[#053132]">التقييمات</h2>
            {rating && (
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full">
                <IoStar size={14} className="text-amber-400" />
                <span className="text-sm font-bold text-amber-700">{rating.average}</span>
                <span className="text-[10px] text-amber-600">({rating.count})</span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#053132]/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#053132]">{review.name[0]}</span>
                    </div>
                    <span className="text-sm font-bold text-[#053132]">{review.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{review.date}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <IoStar
                      key={si}
                      size={12}
                      className={si < review.rate ? "text-amber-400" : "text-gray-200"}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
