import Link from "next/link";
import { translations } from "@/lib/constants/translations";

export default function Footer() {
  const { footer, common } = translations;

  return (
    <footer className="bg-white text-black py-16 px-6 md:px-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Brand Header */}
        <div className="mb-12">
          <h3 className="text-2xl font-light tracking-[0.3em] mb-4">
            {common.brand}
          </h3>
          <div className="border-t border-gray-300" />
        </div>

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Contact Us */}
          <div>
            <h4 className="text-sm font-medium tracking-wider mb-6">
              {footer.contactUs.title}
            </h4>
            <div className="space-y-4 text-sm">
              <p className="leading-relaxed">
                {footer.contactUs.text}
                <br />
                <span className="font-semibold">{footer.contactUs.email}</span>
              </p>
              <p className="text-sm leading-relaxed">
                {footer.contactUs.responseTime}
              </p>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-medium tracking-wider mb-6">
              {footer.explore.title}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:underline transition-all">
                  {footer.explore.links.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                  href="/customization"
                  className="hover:underline transition-all"
                >
                  {footer.explore.links.customization}
                </Link>
              </li>
              <li>
                <Link
                  href="/jewellery-care"
                  className="hover:underline transition-all"
                >
                  {footer.explore.links.jewelleryCare}
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:underline transition-all">
                  {footer.explore.links.blogs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-medium tracking-wider mb-6">
              {footer.support.title}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/shipping-policy"
                  className="hover:underline transition-all"
                >
                  {footer.support.links.shippingPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="hover:underline transition-all"
                >
                  {footer.support.links.termsConditions}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:underline transition-all"
                >
                  {footer.support.links.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="hover:underline transition-all"
                >
                  {footer.support.links.shippingPolicy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm">
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
