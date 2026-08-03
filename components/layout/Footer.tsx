import Link from "next/link";
import { translations } from "@/lib/constants/translations";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";

export default function Footer() {
  const { footer, common } = translations;

  return (
    <footer
      id="footer"
      className="bg-white text-black py-16 px-6 md:px-12 border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto">
        {/* Brand Header */}
        <div id="footer-brand" className="mb-12">
          <Heading variant="footer-brand" className="mb-4">
            {common.brand}
          </Heading>
          <div className="border-t border-gray-300" />
        </div>

        {/* Footer Content Grid */}
        <div
          id="footer-grid"
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
        >
          {/* Contact Us */}
          <div id="footer-contact">
            <Heading variant="footer-section" className="mb-6">
              {footer.contactUs.title}
            </Heading>
            <div className="space-y-4">
              <Text variant="body">
                {`${footer.contactUs.text} `}

                <span className="font-semibold">{footer.contactUs.email}</span>
              </Text>
              <Text variant="body">{footer.contactUs.responseTime}</Text>
            </div>
          </div>

          {/* Explore */}
          <div id="footer-explore">
            <Heading variant="footer-section" className="mb-6">
              {footer.explore.title}
            </Heading>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:underline transition-all">
                  {footer.explore.links.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-order"
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
            </ul>
          </div>

          {/* Support */}
          <div id="footer-support">
            <Heading variant="footer-section" className="mb-6">
              {footer.support.title}
            </Heading>
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
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <Text variant="caption" as="p" className="text-center">
          {footer.copyright}
        </Text>
      </div>
    </footer>
  );
}
