import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-8">
          SHOP
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product cards will go here */}
          <p className="text-gray-500">Products coming soon...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
