"use client";

import { useState } from "react";
import { ChevronDown, Share2 } from "lucide-react";
import { translations } from "@/lib/constants/translations";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import ProductImage from "@/components/ui/ProductImage";

interface ProductDetails {
  product: string;
  craftTechnique: string;
  pearlType: string;
  pearlColour: string;
  size: string;
}

interface ProductDetailClientProps {
  product: {
    brand: string;
    name: string;
    price: number;
    currency: string;
    image: string;
    details: ProductDetails;
    note: string;
    careInstructions: string;
    shippingInfo: string;
    packagingInfo: string;
  };
}

export default function ProductDetailClient({
  product,
}: Readonly<ProductDetailClientProps>) {
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
              src={product.image}
              alt={product.name}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <Text variant="label" className="mb-2">
              {product.brand}
            </Text>

            <Heading variant="product" className="mb-4">
              {product.name}
            </Heading>

            <Text variant="price" className="mb-8">
              {product.currency} {product.price.toLocaleString()}
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
                [translations.product.labels.product, product.details.product],
                [
                  translations.product.labels.craftTechnique,
                  product.details.craftTechnique,
                ],
                [
                  translations.product.labels.pearlType,
                  product.details.pearlType,
                ],
                [
                  translations.product.labels.pearlColour,
                  product.details.pearlColour,
                ],
                [translations.product.labels.size, product.details.size],
              ].map(([label, value]) => (
                <Text key={label} variant="body">
                  <span className="font-normal">{label}</span> {value}
                </Text>
              ))}
            </div>

            {/* Note */}
            {product.note && (
              <Text variant="muted" className="mb-6">
                <span className="font-normal">
                  {translations.product.labels.note}
                </span>{" "}
                {product.note}
              </Text>
            )}

            {/* Collapsible Sections */}
            <div className="border-t border-gray-200">
              {[
                {
                  key: "care",
                  section: translations.productSections.careInstructions,
                  content: product.careInstructions,
                },
                {
                  key: "shipping",
                  section: translations.productSections.shippingInformation,
                  content: product.shippingInfo,
                },
                {
                  key: "packaging",
                  section: translations.productSections.packagingInformation,
                  content: product.packagingInfo,
                },
              ]
                .filter(({ content }) => content)
                .map(({ key, section, content }) => (
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
