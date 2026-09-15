import Button from "@/components/ui/Button";
import { translations } from "@/lib/constants/translations";

export default function AccountQuickLinks() {
  const { quickLinks } = translations.account;

  return (
    <div id="account-quick-links" className="grid gap-3 mb-8">
      <Button id="account-shop-link" variant="outline" fullWidth href="/shop">
        {quickLinks.continueShopping}
      </Button>
      <Button id="account-cart-link" variant="outline" fullWidth href="/cart">
        {quickLinks.viewCart}
      </Button>
      <Button
        id="account-custom-order-link"
        variant="outline"
        fullWidth
        href="/custom-order"
      >
        {quickLinks.customOrders}
      </Button>
    </div>
  );
}
