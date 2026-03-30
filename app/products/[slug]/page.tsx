"use client";

import { useState } from "react";
import { ChevronDown, Share2 } from "lucide-react";
import { getProductBySlug } from "@/lib/data/products";
import { translations } from "@/lib/constants/translations";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import ProductImage from "@/components/ui/ProductImage";

const sampleProduct = getProductBySlug("ethereal-pearl")!;

export default function ProductDetailPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24 md:pt-32 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-50">
            <ProductImage
              src={sampleProduct.image}
              alt={sampleProduct.name}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <Text variant="label" className="mb-2">
              {sampleProduct.brand}
            </Text>

            <Heading variant="product" className="mb-4">
              {sampleProduct.name}
            </Heading>

            <Text variant="price" className="mb-8">
              {sampleProduct.currency} {sampleProduct.price.toLocaleString()}
            </Text>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <Button variant="outline" fullWidth>
                {translations.product.addToCart}
              </Button>
              <Button variant="primary" fullWidth>
                {translations.product.buyNow}
              </Button>
            </div>

            {/* Product Details */}
            <div className="space-y-2 mb-6">
              {[
                [
                  translations.product.labels.product,
                  sampleProduct.details.product,
                ],
                [
                  translations.product.labels.craftTechnique,
                  sampleProduct.details.craftTechnique,
                ],
                [
                  translations.product.labels.pearlType,
                  sampleProduct.details.pearlType,
                ],
                [
                  translations.product.labels.pearlColour,
                  sampleProduct.details.pearlColour,
                ],
                [translations.product.labels.size, sampleProduct.details.size],
              ].map(([label, value]) => (
                <Text key={label} variant="body">
                  <span className="font-normal">{label}</span> {value}
                </Text>
              ))}
            </div>

            {/* Note */}
            <Text variant="muted" className="mb-6">
              <span className="font-normal">
                {translations.product.labels.note}
              </span>{" "}
              {sampleProduct.note}
            </Text>

            {/* Collapsible Sections */}
            <div className="border-t border-gray-200">
              {[
                {
                  key: "care",
                  section: translations.productSections.careInstructions,
                  content: sampleProduct.careInstructions,
                },
                {
                  key: "shipping",
                  section: translations.productSections.shippingInformation,
                  content: sampleProduct.shippingInfo,
                },
                {
                  key: "packaging",
                  section: translations.productSections.packagingInformation,
                  content: sampleProduct.packagingInfo,
                },
              ].map(({ key, section, content }) => (
                <div key={key} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full py-4 flex items-center justify-between text-left text-sm tracking-wider hover:text-gray-600 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{section.icon}</span>
                      {section.title}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedSection === key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedSection === key && (
                    <Text variant="muted" className="pb-4">
                      {content}
                    </Text>
                  )}
                </div>
              ))}
            </div>

            {/* Share */}
            <Button variant="ghost" className="mt-6">
              <Share2 className="w-4 h-4" />
              {translations.product.share}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
