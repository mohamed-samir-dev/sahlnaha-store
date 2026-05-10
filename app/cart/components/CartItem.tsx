import Image from "next/image";
import { IoAdd, IoRemove, IoTrashOutline } from "react-icons/io5";

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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden">
      <div className="flex gap-0">
        {/* Image panel */}
        <div className="relative w-28 sm:w-32 shrink-0 self-stretch" style={{ background: "linear-gradient(145deg,#f0f4f4,#e8f0f0)" }}>
          {img ? (
            <Image src={img} alt={product.name} fill className="object-contain p-3" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">📱</div>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 text-[10px] font-black text-white px-1.5 py-0.5 rounded-md" style={{ background: "#053132" }}>
              خصم
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2">{product.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-black" style={{ color: "#053132" }}>{fmt(price)}<span className="text-xs font-medium text-gray-400 mr-0.5"> ر.س</span></span>
              {hasDiscount && (
                <span className="text-xs text-gray-300 line-through">{fmt(product.originalPrice!)} ر.س</span>
              )}
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            {/* Qty control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQty(product._id, qty - 1)}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-300 hover:bg-gray-50 transition"
              >
                <IoRemove size={15} className="text-gray-500" />
              </button>
              <span className="text-sm font-black text-gray-900 w-7 text-center">{qty}</span>
              <button
                onClick={() => onUpdateQty(product._id, qty + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition text-white"
                style={{ background: "#053132" }}
              >
                <IoAdd size={15} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {qty > 1 && (
                <span className="text-xs text-gray-400 font-semibold bg-gray-50 px-2 py-1 rounded-lg">
                  {fmt(price * qty)} ر.س
                </span>
              )}
              <button
                onClick={() => onRemove(product._id)}
                className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition group"
              >
                <IoTrashOutline size={15} className="text-red-400 group-hover:text-red-500 transition" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
