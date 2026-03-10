import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 px-6 md:px-12 max-w-4xl mx-auto pb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-8">
          SHOPPING CART
        </h1>
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
