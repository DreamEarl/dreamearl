"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useCart } from "@/lib/cart/CartContext";
import { translations } from "@/lib/constants/translations";
import { computeOrderTotals } from "@/lib/orders/pricing";
import {
  isValidEmail,
  isValidPhone,
  isValidPincode,
} from "@/lib/orders/validate";
import type { ShippingAddress } from "@/lib/orders/types";
import type { Address } from "@/lib/addresses/types";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import FormField from "@/components/checkout/FormField";

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: { description?: string };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: RazorpayFailureResponse) => void,
  ) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
}

const emptyShipping: ShippingAddress = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

function validateCustomer(customer: CustomerForm): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!customer.name.trim()) errors.customerName = "Full name is required.";
  if (!isValidEmail(customer.email))
    errors.customerEmail = "Enter a valid email address.";
  if (!isValidPhone(customer.phone))
    errors.customerPhone = "Enter a valid phone number.";
  return errors;
}

function validateNewShipping(
  shipping: ShippingAddress,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!shipping.fullName.trim())
    errors.shippingFullName = "Recipient name is required.";
  if (!shipping.line1.trim())
    errors.shippingLine1 = "Address line 1 is required.";
  if (!shipping.city.trim()) errors.shippingCity = "City is required.";
  if (!shipping.state.trim()) errors.shippingState = "State is required.";
  if (!isValidPincode(shipping.pincode))
    errors.shippingPincode = "Enter a valid pincode.";
  if (!isValidPhone(shipping.phone))
    errors.shippingPhone = "Enter a valid phone number.";
  return errors;
}

function toShippingAddress(address: Address): ShippingAddress {
  return {
    fullName: address.full_name,
    line1: address.line1,
    line2: address.line2 ?? undefined,
    city: address.city,
    state: address.state,
    pincode: address.pincode ?? "",
    phone: address.phone,
  };
}

interface CheckoutClientProps {
  defaultName: string;
  defaultEmail: string;
  addresses?: Address[];
}

export default function CheckoutClient({
  defaultName,
  defaultEmail,
  addresses = [],
}: Readonly<CheckoutClientProps>) {
  const router = useRouter();
  const { cartItems, itemCount, clearCart } = useCart();
  const t = translations.checkout;

  const [customer, setCustomer] = useState<CustomerForm>({
    name: defaultName,
    email: defaultEmail,
    phone: "",
  });
  const [shipping, setShipping] = useState<ShippingAddress>(emptyShipping);
  const [addressMode, setAddressMode] = useState<"saved" | "new">(
    addresses.length > 0 ? "saved" : "new",
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.is_default)?.id ?? addresses[0]?.id ?? null,
  );
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const totals = useMemo(
    () =>
      computeOrderTotals(
        cartItems.map((i) => ({ price: i.price, quantity: i.quantity })),
      ),
    [cartItems],
  );

  const validate = useCallback((): Record<string, string> => {
    let addressErrors: Record<string, string> = {};
    if (addressMode === "saved") {
      if (!selectedAddressId)
        addressErrors = { shippingAddress: t.shippingAddress.selectError };
    } else {
      addressErrors = validateNewShipping(shipping);
    }

    return { ...validateCustomer(customer), ...addressErrors };
  }, [customer, shipping, addressMode, selectedAddressId, t]);

  const handlePay = useCallback(async () => {
    if (isSubmitting) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setPaymentError(null);
    setIsSubmitting(true);

    const savedAddress =
      addressMode === "saved"
        ? addresses.find((a) => a.id === selectedAddressId)
        : undefined;
    const shippingAddress = savedAddress
      ? toShippingAddress(savedAddress)
      : shipping;

    if (addressMode === "new" && saveNewAddress) {
      // Fire-and-forget: don't block checkout if saving to the address book fails.
      fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: shipping.fullName,
          phone: shipping.phone,
          line1: shipping.line1,
          line2: shipping.line2 || undefined,
          city: shipping.city,
          state: shipping.state,
          pincode: shipping.pincode || undefined,
        }),
      }).catch(() => {});
    }

    try {
      const createRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((i) => ({ id: i.id, quantity: i.quantity })),
          customer,
          shippingAddress,
        }),
      });
      const createData = await createRes.json();

      if (!createRes.ok) {
        setPaymentError(createData.error ?? t.errors.generic);
        setIsSubmitting(false);
        return;
      }

      if (!scriptReady || !window.Razorpay) {
        setPaymentError(t.errors.gatewayLoad);
        setIsSubmitting(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: createData.keyId,
        amount: createData.amount,
        currency: createData.currency,
        name: translations.common.brand,
        description: "DreamEarl order",
        order_id: createData.razorpayOrderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        notes: { orderId: createData.orderId },
        theme: { color: "#5f1631" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: createData.orderId,
                ...response,
              }),
            });
            if (!verifyRes.ok) {
              setPaymentError(t.errors.verifyFailed);
              setIsSubmitting(false);
              return;
            }
            clearCart();
            router.push(`/order-success/${createData.orderId}`);
          } catch {
            setPaymentError(t.errors.verifyFailed);
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      });

      rzp.on("payment.failed", () => {
        setPaymentError(t.paymentFailed.message);
        setIsSubmitting(false);
        fetch("/api/payments/mark-failed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: createData.orderId }),
        }).catch(() => {});
      });

      rzp.open();
    } catch {
      setPaymentError(t.errors.generic);
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    validate,
    cartItems,
    customer,
    shipping,
    addressMode,
    selectedAddressId,
    addresses,
    saveNewAddress,
    scriptReady,
    clearCart,
    router,
    t,
  ]);

  if (itemCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center min-h-screen">
        <Heading variant="cart" className="mb-8">
          {t.emptyCart}
        </Heading>
        <Button variant="primary" size="sm" href="/shop">
          {t.returnToShop}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => setPaymentError(t.errors.gatewayLoad)}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <Heading variant="page" className="mb-8">
          {t.title}
        </Heading>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Forms */}
          <div className="flex-1 flex flex-col gap-10">
            <section>
              <Text
                variant="small"
                className="font-medium tracking-widest mb-4"
              >
                {t.customerInfo.title}
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  id="customer-name"
                  label={t.customerInfo.fullName}
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, name: e.target.value }))
                  }
                  error={errors.customerName}
                  autoComplete="name"
                />
                <FormField
                  id="customer-email"
                  type="email"
                  label={t.customerInfo.email}
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, email: e.target.value }))
                  }
                  error={errors.customerEmail}
                  autoComplete="email"
                />
                <FormField
                  id="customer-phone"
                  type="tel"
                  label={t.customerInfo.phone}
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, phone: e.target.value }))
                  }
                  error={errors.customerPhone}
                  autoComplete="tel"
                  className="md:col-span-1"
                />
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <Text variant="small" className="font-medium tracking-widest">
                  {t.shippingAddress.title}
                </Text>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    id="shipping-address-toggle"
                    className="text-xs tracking-wide underline underline-offset-2"
                    onClick={() =>
                      setAddressMode((mode) =>
                        mode === "saved" ? "new" : "saved",
                      )
                    }
                  >
                    {addressMode === "saved"
                      ? t.shippingAddress.addNew
                      : t.shippingAddress.useSaved}
                  </button>
                )}
              </div>

              {errors.shippingAddress && (
                <Text
                  role="alert"
                  variant="caption"
                  className="text-red-600 mb-4"
                >
                  {errors.shippingAddress}
                </Text>
              )}

              {addressMode === "saved" ? (
                <div className="flex flex-col gap-3">
                  {addresses.map((address) => {
                    const id = `shipping-address-${address.id}`;
                    const isSelected = selectedAddressId === address.id;
                    return (
                      <label
                        key={address.id}
                        htmlFor={id}
                        aria-label={`${address.full_name}, ${address.line1}, ${address.city}, ${address.state}`}
                        className={`flex items-start gap-3 border p-4 cursor-pointer ${
                          isSelected ? "border-[#5f1631]" : "border-gray-200"
                        }`}
                      >
                        <input
                          id={id}
                          type="radio"
                          name="shipping-address"
                          className="mt-1"
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(address.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <Text variant="body" className="font-medium">
                              {address.full_name}
                            </Text>
                            {address.is_default && (
                              <span className="shrink-0 bg-green-50 text-green-700 text-xs tracking-wide px-2 py-1">
                                {t.shippingAddress.defaultBadge}
                              </span>
                            )}
                          </div>
                          <Text variant="caption" className="mt-1">
                            {address.line1}
                            {address.line2 ? <>, {address.line2}</> : null}
                            <br />
                            {address.city}, {address.state}
                            {address.pincode
                              ? ` \u2013 ${address.pincode}`
                              : ""}
                            <br />
                            +91 {address.phone}
                          </Text>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      id="shipping-fullName"
                      label={t.shippingAddress.fullName}
                      value={shipping.fullName}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, fullName: e.target.value }))
                      }
                      error={errors.shippingFullName}
                      autoComplete="name"
                    />
                    <FormField
                      id="shipping-phone"
                      type="tel"
                      label={t.shippingAddress.phone}
                      value={shipping.phone}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, phone: e.target.value }))
                      }
                      error={errors.shippingPhone}
                      autoComplete="tel"
                    />
                    <FormField
                      id="shipping-line1"
                      label={t.shippingAddress.line1}
                      value={shipping.line1}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, line1: e.target.value }))
                      }
                      error={errors.shippingLine1}
                      autoComplete="address-line1"
                      className="md:col-span-2"
                    />
                    <FormField
                      id="shipping-line2"
                      label={t.shippingAddress.line2}
                      value={shipping.line2}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, line2: e.target.value }))
                      }
                      autoComplete="address-line2"
                      className="md:col-span-2"
                    />
                    <FormField
                      id="shipping-city"
                      label={t.shippingAddress.city}
                      value={shipping.city}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, city: e.target.value }))
                      }
                      error={errors.shippingCity}
                      autoComplete="address-level2"
                    />
                    <FormField
                      id="shipping-state"
                      label={t.shippingAddress.state}
                      value={shipping.state}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, state: e.target.value }))
                      }
                      error={errors.shippingState}
                      autoComplete="address-level1"
                    />
                    <FormField
                      id="shipping-pincode"
                      label={t.shippingAddress.pincode}
                      value={shipping.pincode}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, pincode: e.target.value }))
                      }
                      error={errors.shippingPincode}
                      autoComplete="postal-code"
                    />
                  </div>
                  <label
                    htmlFor="shipping-save-address"
                    className="flex items-center gap-2 mt-4 text-sm text-gray-700"
                  >
                    <input
                      id="shipping-save-address"
                      type="checkbox"
                      checked={saveNewAddress}
                      onChange={(e) => setSaveNewAddress(e.target.checked)}
                    />
                    {t.shippingAddress.saveForFuture}
                  </label>
                </>
              )}
            </section>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-[#faf7f4] p-6">
              <Text
                variant="small"
                className="font-medium tracking-widest mb-6"
              >
                {t.summary.title}
              </Text>

              <ul className="flex flex-col gap-4 mb-6">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <Link href={item.href} className="shrink-0">
                      <div className="relative w-16 h-16 bg-white overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Text variant="body" className="truncate">
                        {item.name}
                      </Text>
                      {item.color && (
                        <Text variant="caption">Color: {item.color}</Text>
                      )}
                      <Text variant="caption">
                        {t.summary.qty}: {item.quantity} × {item.currency}{" "}
                        {item.price.toLocaleString()}
                      </Text>
                    </div>
                    <Text variant="body" className="shrink-0">
                      {item.currency}{" "}
                      {(item.price * item.quantity).toLocaleString()}
                    </Text>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <Text variant="body">{t.summary.subtotal}</Text>
                  <Text variant="body">
                    {translations.common.currency}{" "}
                    {totals.subtotal.toLocaleString()}
                  </Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text variant="body">{t.summary.shipping}</Text>
                  <Text variant="body">
                    {totals.shippingFee === 0
                      ? "Free"
                      : `${translations.common.currency} ${totals.shippingFee.toLocaleString()}`}
                  </Text>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between items-center">
                    <Text variant="body">{t.summary.discount}</Text>
                    <Text variant="body">
                      -{translations.common.currency}{" "}
                      {totals.discount.toLocaleString()}
                    </Text>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <Text variant="label" className="font-medium">
                    {t.summary.total}
                  </Text>
                  <Text variant="price">
                    {translations.common.currency}{" "}
                    {totals.total.toLocaleString()}
                  </Text>
                </div>
              </div>

              {paymentError && (
                <Text
                  role="alert"
                  variant="caption"
                  className="text-red-600 mt-4"
                >
                  {paymentError}
                </Text>
              )}

              <Button
                variant="primary"
                size="md"
                fullWidth
                className="mt-6"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                onClick={handlePay}
              >
                {isSubmitting
                  ? t.processing
                  : `${t.payButton} ₹${totals.total.toLocaleString()}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
