import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-black py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Brand Header */}
        <div className="mb-12">
          <h3 className="text-2xl font-light tracking-[0.3em] mb-4">
            DREAMEARL
          </h3>
          <div className="border-t border-gray-300" />
        </div>

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Contact Us */}
          <div>
            <h4 className="text-sm font-medium tracking-wider mb-6">
              CONTACT US
            </h4>
            <div className="space-y-4 text-sm">
              <p className="leading-relaxed">
                For all customer queries, please
                <br />
                contact us here or send an email to
                <br />
                <span className="font-semibold">
                  mydreamearl.shop@gmail.com
                </span>
              </p>
              <p className="text-sm leading-relaxed">
                We&apos;ll respond to all customer queries
                <br />
                within 24 hours Monday to Friday
              </p>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-medium tracking-wider mb-6">EXPLORE</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:underline transition-all">
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/customization"
                  className="hover:underline transition-all"
                >
                  Customization
                </Link>
              </li>
              <li>
                <Link
                  href="/jewellery-care"
                  className="hover:underline transition-all"
                >
                  Jewellery Care
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:underline transition-all">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-medium tracking-wider mb-6">SUPPORT</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/shipping-policy"
                  className="hover:underline transition-all"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="hover:underline transition-all"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:underline transition-all"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="hover:underline transition-all"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm">
          <p>2026, DREAMEARL. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
