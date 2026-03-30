import { translations } from "@/lib/constants/translations";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <main className="text-center px-6">
        <Heading variant="cart" className="mb-8">
          {translations.cart.emptyMessage}
        </Heading>
        <Button variant="primary" size="sm" href="/shop">
          {translations.cart.returnToShop}
        </Button>
      </main>
    </div>
  );
}
