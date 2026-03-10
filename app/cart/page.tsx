export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 px-6 md:px-12 max-w-4xl mx-auto pb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-8">
          SHOPPING CART
        </h1>
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </main>
    </div>
  );
}
