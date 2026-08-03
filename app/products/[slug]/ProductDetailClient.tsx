"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { translations } from "@/lib/constants/translations";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import ProductImage from "@/components/ui/ProductImage";

// ─── Types ────────────────────────────────────────────────────────────────────

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
    images: string[];
    details: ProductDetails;
    note: string;
    careInstructions: string;
    shippingInfo: string;
    packagingInfo: string;
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ImageCarousel({
  images,
  productName,
}: Readonly<{ images: string[]; productName: string }>) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeImages = images?.length ? images : [""];
  const hasMultiple = safeImages.length > 1;

  const prev = () =>
    setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setActiveIndex((i) => (i + 1) % safeImages.length);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <ProductImage
          src={safeImages[activeIndex]}
          alt={`${productName} – image ${activeIndex + 1}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={activeIndex === 0}
        />
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {safeImages.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === activeIndex ? "bg-gray-800" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto">
          {safeImages.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative shrink-0 w-16 h-16 bg-gray-50 border-2 transition-colors ${
                i === activeIndex ? "border-gray-800" : "border-transparent"
              }`}
            >
              <ProductImage
                src={src}
                alt={`${productName} thumbnail ${i + 1}`}
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetailsList({
  details,
  note,
}: Readonly<{ details: ProductDetails; note: string }>) {
  const rows = [
    [translations.product.labels.product, details?.product ?? ""],
    [translations.product.labels.craftTechnique, details?.craftTechnique ?? ""],
    [translations.product.labels.pearlType, details?.pearlType ?? ""],
    [translations.product.labels.pearlColour, details?.pearlColour ?? ""],
    [translations.product.labels.size, details?.size ?? ""],
  ].filter(([, value]) => value);

  return (
    <>
      <div className="space-y-2 mb-6">
        {rows.map(([label, value]) => (
          <Text key={label} variant="body">
            <span className="font-normal">{label}</span> {value}
          </Text>
        ))}
      </div>

      {note && (
        <Text variant="muted" className="mb-6">
          <span className="font-normal">
            {translations.product.labels.note}
          </span>{" "}
          {note}
        </Text>
      )}
    </>
  );
}

function CollapsibleSections({
  careInstructions,
  shippingInfo,
  packagingInfo,
}: Readonly<{
  careInstructions: string;
  shippingInfo: string;
  packagingInfo: string;
}>) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggle = (key: string) =>
    setExpandedSection((current) => (current === key ? null : key));

  const sections = [
    {
      key: "care",
      section: translations.productSections.careInstructions,
      content: careInstructions,
    },
    {
      key: "shipping",
      section: translations.productSections.shippingInformation,
      content: shippingInfo,
    },
    {
      key: "packaging",
      section: translations.productSections.packagingInformation,
      content: packagingInfo,
    },
  ].filter(({ content }) => content);

  return (
    <div className="border-t border-gray-200">
      {sections.map(({ key, section, content }) => (
        <div key={key} className="border-b border-gray-200">
          <button
            onClick={() => toggle(key)}
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
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function ProductDetailClient({
  product,
}: Readonly<ProductDetailClientProps>) {
  const [copied, setCopied] = useState(false);
  const isSharing = useRef(false);

  const handleShare = async () => {
    if (isSharing.current) return;
    isSharing.current = true;

    const url = globalThis.location.href;
    const shareData = {
      title: product?.name,
      text: `${product?.brand} – ${product?.name}`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } finally {
      isSharing.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24 md:pt-32 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ImageCarousel images={product.images} productName={product.name} />

          <div className="flex flex-col">
            <Text variant="label" className="mb-2">
              {product.brand}
            </Text>

            <Heading variant="product" className="mb-4">
              {product.name}
            </Heading>

            <Text variant="price" className="mb-8">
              {product.currency} {product.price?.toLocaleString() ?? "—"}
            </Text>

            <div className="space-y-3 mb-8">
              <Button variant="primary" fullWidth>
                {translations.product.addToCart}
              </Button>

              {/* Will be used later  */}
              {/* <Button variant="primary" fullWidth>
                {translations.product.buyNow}
              </Button> */}
            </div>

            <ProductDetailsList details={product.details} note={product.note} />

            <CollapsibleSections
              careInstructions={product.careInstructions}
              shippingInfo={product.shippingInfo}
              packagingInfo={product.packagingInfo}
            />

            <Button variant="ghost" className="mt-6" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              {copied
                ? translations.product.linkCopied
                : translations.product.share}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
