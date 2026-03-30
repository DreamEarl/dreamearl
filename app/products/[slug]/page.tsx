"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Share2 } from "lucide-react";
import { getProductBySlug } from "@/lib/data/products";
import { translations } from "@/lib/constants/translations";

// In a real app, this would use params to fetch the actual product
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
            <Image
              src={sampleProduct.image}
              alt={sampleProduct.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Brand */}
            <p className="text-sm tracking-widest text-gray-700 mb-2">
              {sampleProduct.brand}
            </p>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
              {sampleProduct.name}
            </h1>

            {/* Price */}
            <p className="text-2xl mb-8">
              {sampleProduct.currency} {sampleProduct.price.toLocaleString()}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <button className="w-full py-4 border-2 border-black text-black font-light tracking-wide hover:bg-gray-50 transition-colors">
                {translations.product.addToCart}
              </button>
              <button className="w-full py-4 bg-black text-white font-light tracking-wide hover:bg-gray-900 transition-colors">
                {translations.product.buyNow}
              </button>
            </div>

            {/* Product Details */}
            <div className="space-y-2 mb-6 text-sm">
              <p>
                <span className="font-normal">
                  {translations.product.labels.product}
                </span>{" "}
                {sampleProduct.details.product}
              </p>
              <p>
                <span className="font-normal">
                  {translations.product.labels.craftTechnique}
                </span>{" "}
                {sampleProduct.details.craftTechnique}
              </p>
              <p>
                <span className="font-normal">
                  {translations.product.labels.pearlType}
                </span>{" "}
                {sampleProduct.details.pearlType}
              </p>
              <p>
                <span className="font-normal">
                  {translations.product.labels.pearlColour}
                </span>{" "}
                {sampleProduct.details.pearlColour}
              </p>
              <p>
                <span className="font-normal">
                  {translations.product.labels.size}
                </span>{" "}
                {sampleProduct.details.size}
              </p>
            </div>

            {/* Note */}
            <div className="mb-6 text-sm text-gray-700 leading-relaxed">
              <span className="font-normal">
                {translations.product.labels.note}
              </span>{" "}
              {sampleProduct.note}
            </div>

            {/* Collapsible Sections */}
            <div className="border-t border-gray-200">
              {/* Care Instructions */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("care")}
                  className="w-full py-4 flex items-center justify-between text-left text-sm tracking-wider hover:text-gray-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">
                      {translations.productSections.careInstructions.icon}
                    </span>
                    {translations.productSections.careInstructions.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSection === "care" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSection === "care" && (
                  <div className="pb-4 text-sm text-gray-700">
                    {sampleProduct.careInstructions}
                  </div>
                )}
              </div>

              {/* Shipping Information */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("shipping")}
                  className="w-full py-4 flex items-center justify-between text-left text-sm tracking-wider hover:text-gray-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">
                      {translations.productSections.shippingInformation.icon}
                    </span>
                    {translations.productSections.shippingInformation.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSection === "shipping" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSection === "shipping" && (
                  <div className="pb-4 text-sm text-gray-700">
                    {sampleProduct.shippingInfo}
                  </div>
                )}
              </div>

              {/* Packaging Information */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("packaging")}
                  className="w-full py-4 flex items-center justify-between text-left text-sm tracking-wider hover:text-gray-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">
                      {translations.productSections.packagingInformation.icon}
                    </span>
                    {translations.productSections.packagingInformation.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSection === "packaging" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSection === "packaging" && (
                  <div className="pb-4 text-sm text-gray-700">
                    {sampleProduct.packagingInfo}
                  </div>
                )}
              </div>
            </div>

            {/* Share */}
            <button className="mt-6 flex items-center gap-2 text-sm tracking-wider hover:text-gray-600 transition-colors">
              <Share2 className="w-4 h-4" />
              {translations.product.share}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
