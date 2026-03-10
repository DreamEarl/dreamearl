import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-light tracking-wider mb-4">DREAMEARL</h3>
          <p className="text-gray-400 text-sm">
            Exquisite pearl accessories for the modern connoisseur.
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4">Connect</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Pinterest</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
        <p>&copy; 2026 DREAMEARL. All rights reserved.</p>
      </div>
    </footer>
  );
}
