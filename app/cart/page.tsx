import { translations } from "@/lib/constants/translations";
import { getSiteContent } from "@/lib/sanity/queries";
import CartClient from "./CartClient";

const defaultCart = translations.cart;

export default async function CartPage() {
  const content = await getSiteContent();

  const heroTitle = content?.cart?.hero?.title ?? defaultCart.hero.title;
  const heroSubtitle =
    content?.cart?.hero?.subtitle ?? defaultCart.hero.subtitle;
  const emptyMessage = content?.cart?.emptyMessage ?? defaultCart.emptyMessage;
  const returnToShop = content?.cart?.returnToShop ?? defaultCart.returnToShop;

  // Prefer image uploaded in Sanity, fall back to the default local asset
  const heroImageUrl =
    content?.cart?.hero?.backgroundImage?.asset?.url ??
    defaultCart.hero.backgroundImage;

  return (
    <CartClient
      heroImageUrl={heroImageUrl}
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      emptyMessage={emptyMessage}
      returnToShop={returnToShop}
    />
  );
}
