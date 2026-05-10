import Image from "next/image";
import { IoAdd, IoRemove, IoCloseOutline } from "react-icons/io5";

const fmt = (n: number) => n.toLocaleString("en-US");

interface CartItemProps {
  product: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    originalPrice?: number;
    images?: string[];
    image?: string;
  };
  qty: number;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : `${API}${src}`;

export default function CartItem({ product, qty, onUpdateQty, onRemove }: CartItemProps) {
  const price = product.salePrice ?? product.originalPrice ?? product.price;
  const rawImg = product.images?.[0] || product.image;
  const img = rawImg ? resolveImg(rawImg) : undefined;
  const hasDiscount = product.salePrice && product.originalPrice && product.salePrice < product.originalPrice;
  const discountPercent = hasDiscount ? Math.round((1 - product.salePrice! / product.originalPrice!) * 100) : 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#05313220] transition-all duration-300 p-3 sm:p-4">
      <div className="flex gap-3 sm:gap-4">
        {/* Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-gray-50 to-gray-100">
          {img ? (
            <Image src={img} alt={product.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">📱</div>
          )}
          {hasDiscount && (
            <span className="absolute top-1 right-1 text-[9px] font-black text-white bg-red-500 px-1.5 py-0.5 rounded-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Top: name + remove */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-relaxed line-clamp-2">{product.name}</h3>
            <button
              onClick={() => onRemove(product._id)}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-50 flex items-center justify-center transition shrink-0 group/btn"
            >
              <IoCloseOutline size={14} className="text-gray-400 group-hover/btn:text-red-500 transition" />
            </button>
          </div>

          {/* Bottom: price + qty */}
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-base sm:text-lg font-black text-[#053132]">{fmt(price * qty)}</span>
              <span className="text-[10px] text-gray-400 mr-1">ر.س</span>
              {hasDiscount && (
                <span className="text-[10px] text-gray-300 line-through mr-2">{fmt(product.originalPrice! * qty)}</span>
              )}
            </div>

            {/* Qty */}
            <div className="flex items-center bg-gray-50 rounded-full overflow-hidden border border-gray-100">
              <button
                onClick={() => onUpdateQty(product._id, qty - 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <IoRemove size={13} className="text-gray-500" />
              </button>
              <span className="w-8 text-center text-sm font-black text-gray-900">{qty}</span>
              <button
                onClick={() => onUpdateQty(product._id, qty + 1)}
                className="w-8 h-8 flex items-center justify-center bg-[#053132] hover:bg-[#064445] transition text-white rounded-full"
              >
                <IoAdd size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
