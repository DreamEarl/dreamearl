import Link from "next/link";
import { translations } from "@/lib/constants/translations";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <main className="text-center px-6">
        <h1 className="text-xl md:text-2xl font-light tracking-wide mb-8">
          {translations.cart.emptyMessage}
        </h1>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 bg-black text-white text-sm font-light tracking-wider hover:bg-gray-900 transition-colors"
        >
          {translations.cart.returnToShop}
        </Link>
      </main>
    </div>
  );
}
