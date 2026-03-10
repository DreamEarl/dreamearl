import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  href: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  href,
}: Readonly<ProductCardProps>) {
  return (
    <Link href={href} className="group">
      <div className="aspect-square relative overflow-hidden bg-gray-100 mb-4">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-lg font-light tracking-wide mb-2">{name}</h3>
      <p className="text-gray-600">${price.toFixed(2)}</p>
    </Link>
  );
}
