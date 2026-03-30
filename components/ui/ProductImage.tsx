import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  quality?: number;
  className?: string;
}

export default function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  quality,
  className = "object-cover",
}: Readonly<ProductImageProps>) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      quality={quality}
    />
  );
}
