"use client";

import { useState, type SubmitEvent } from "react";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import FormField from "@/components/checkout/FormField";
import { translations } from "@/lib/constants/translations";
import type { Address, AddressInput } from "@/lib/addresses/types";

interface AddressFormProps {
  id: string;
  address?: Address;
  onCancel: () => void;
  onSubmit: (input: AddressInput) => Promise<string | void>;
}

function toInput(address: Address | undefined): AddressInput {
  return {
    fullName: address?.full_name ?? "",
    phone: address?.phone ?? "",
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    pincode: address?.pincode ?? "",
    isDefault: address?.is_default ?? false,
  };
}

export default function AddressForm({
  id,
  address,
  onCancel,
  onSubmit,
}: Readonly<AddressFormProps>) {
  const { form: t } = translations.account.addresses;
  const [values, setValues] = useState<AddressInput>(toInput(address));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field: keyof AddressInput) => (value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    const result = await onSubmit(values);
    setIsSubmitting(false);
    if (result) {
      setError(result);
    }
  };

  return (
    <div id={id}>
      <Heading
        id={`${id}-title`}
        variant="cart"
        className="border-b border-black inline-block pb-2 mb-6 uppercase"
      >
        {address ? t.editTitle : t.addTitle}
      </Heading>

      <form id={`${id}-form`} onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            id={`${id}-full-name`}
            label={t.fullName}
            placeholder={t.fullNamePlaceholder}
            value={values.fullName}
            onChange={(e) => setField("fullName")(e.target.value)}
            autoComplete="name"
            required
          />
          <FormField
            id={`${id}-phone`}
            label={t.phone}
            placeholder={t.phonePlaceholder}
            value={values.phone}
            onChange={(e) => setField("phone")(e.target.value)}
            autoComplete="tel"
            required
          />
        </div>

        <div className="mb-4">
          <FormField
            id={`${id}-line1`}
            label={t.line1}
            placeholder={t.line1Placeholder}
            value={values.line1}
            onChange={(e) => setField("line1")(e.target.value)}
            autoComplete="address-line1"
            required
          />
        </div>

        <div className="mb-4">
          <FormField
            id={`${id}-line2`}
            label={t.line2}
            placeholder={t.line2Placeholder}
            value={values.line2 ?? ""}
            onChange={(e) => setField("line2")(e.target.value)}
            autoComplete="address-line2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FormField
            id={`${id}-city`}
            label={t.city}
            placeholder={t.cityPlaceholder}
            value={values.city}
            onChange={(e) => setField("city")(e.target.value)}
            autoComplete="address-level2"
            required
          />
          <FormField
            id={`${id}-state`}
            label={t.state}
            placeholder={t.statePlaceholder}
            value={values.state}
            onChange={(e) => setField("state")(e.target.value)}
            autoComplete="address-level1"
            required
          />
          <FormField
            id={`${id}-pincode`}
            label={t.pincode}
            placeholder={t.pincodePlaceholder}
            value={values.pincode ?? ""}
            onChange={(e) => setField("pincode")(e.target.value)}
            autoComplete="postal-code"
          />
        </div>

        <label
          htmlFor={`${id}-save-default`}
          className="flex items-center gap-2 mb-6 text-sm text-gray-700"
        >
          <input
            id={`${id}-save-default`}
            type="checkbox"
            checked={Boolean(values.isDefault)}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, isDefault: e.target.checked }))
            }
          />
          {t.saveAsDefault}
        </label>

        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs text-red-600 mb-4"
          >
            {error}
          </p>
        )}

        <div className="flex gap-4">
          <Button
            id={`${id}-cancel`}
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t.cancel}
          </Button>
          <Button
            id={`${id}-submit`}
            type="submit"
            size="sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? t.saving : t.save}
          </Button>
        </div>
      </form>
    </div>
  );
}
