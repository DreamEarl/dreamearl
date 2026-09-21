"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import AddressCard from "@/components/account/AddressCard";
import AddressForm from "@/components/account/AddressForm";
import { translations } from "@/lib/constants/translations";
import type { Address, AddressInput } from "@/lib/addresses/types";

interface AddressesPanelProps {
  addresses: Address[];
}

type View =
  | { mode: "list" }
  | { mode: "add" }
  | { mode: "edit"; address: Address };

async function parseErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = await response.json();
    return typeof data?.error === "string" ? data.error : fallback;
  } catch {
    return fallback;
  }
}

export default function AddressesPanel({
  addresses: initialAddresses,
}: Readonly<AddressesPanelProps>) {
  const t = translations.account.addresses;
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [view, setView] = useState<View>({ mode: "list" });
  const [listError, setListError] = useState<string | null>(null);

  const sortAddresses = (list: Address[]) =>
    [...list].sort((a, b) => {
      if (a.is_default !== b.is_default) return a.is_default ? -1 : 1;
      return a.created_at.localeCompare(b.created_at);
    });

  const handleCreate = async (input: AddressInput): Promise<string | void> => {
    const response = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      return parseErrorMessage(response, t.errors.generic);
    }
    const { address } = await response.json();
    setAddresses((prev) =>
      sortAddresses([
        ...(address.is_default
          ? prev.map((a) => ({ ...a, is_default: false }))
          : prev),
        address,
      ]),
    );
    setView({ mode: "list" });
  };

  const handleUpdate = async (
    address: Address,
    input: AddressInput,
  ): Promise<string | void> => {
    const response = await fetch(`/api/addresses/${address.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      return parseErrorMessage(response, t.errors.generic);
    }
    const { address: updated } = await response.json();
    setAddresses((prev) =>
      sortAddresses(
        prev.map((a) => {
          if (a.id === updated.id) return updated;
          return updated.is_default ? { ...a, is_default: false } : a;
        }),
      ),
    );
    setView({ mode: "list" });
  };

  const handleRemove = async (address: Address) => {
    setListError(null);
    const response = await fetch(`/api/addresses/${address.id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setListError(await parseErrorMessage(response, t.errors.generic));
      return;
    }
    setAddresses((prev) => prev.filter((a) => a.id !== address.id));
  };

  const handleSetDefault = async (address: Address) => {
    setListError(null);
    const response = await fetch(`/api/addresses/${address.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    if (!response.ok) {
      setListError(await parseErrorMessage(response, t.errors.generic));
      return;
    }
    setAddresses((prev) =>
      sortAddresses(
        prev.map((a) => ({ ...a, is_default: a.id === address.id })),
      ),
    );
  };

  if (view.mode === "add") {
    return (
      <AddressForm
        id="address-form-add"
        onCancel={() => setView({ mode: "list" })}
        onSubmit={handleCreate}
      />
    );
  }

  if (view.mode === "edit") {
    return (
      <AddressForm
        id="address-form-edit"
        address={view.address}
        onCancel={() => setView({ mode: "list" })}
        onSubmit={(input) => handleUpdate(view.address, input)}
      />
    );
  }

  return (
    <div id="addresses-panel">
      <div className="flex items-center justify-between border-b border-black mb-6 pb-2">
        <Heading
          id="addresses-panel-title"
          variant="cart"
          className="uppercase"
        >
          {t.title}
        </Heading>
        {addresses.length > 0 && (
          <Button
            id="addresses-panel-add"
            variant="primary"
            size="sm"
            onClick={() => setView({ mode: "add" })}
          >
            + {t.addNew}
          </Button>
        )}
      </div>

      {listError && (
        <p role="alert" className="text-xs text-red-600 mb-4">
          {listError}
        </p>
      )}

      {addresses.length === 0 ? (
        <div
          id="addresses-panel-empty"
          className="flex flex-col items-center text-center py-16 px-6"
        >
          <MapPin
            id="addresses-panel-empty-icon"
            className="w-16 h-16 text-[#5f1631] mb-4"
            strokeWidth={1.25}
          />
          <Heading
            id="addresses-panel-empty-title"
            variant="product"
            className="mb-3 font-glacial"
          >
            {t.emptyTitle}
          </Heading>
          <Text
            id="addresses-panel-empty-message"
            variant="muted"
            className="mb-8"
          >
            {t.empty}
          </Text>
          <Button
            id="addresses-panel-empty-cta"
            variant="primary"
            size="sm"
            onClick={() => setView({ mode: "add" })}
          >
            {t.addNew}
          </Button>
        </div>
      ) : (
        <div id="addresses-panel-list" className="flex flex-col gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={(a) => setView({ mode: "edit", address: a })}
              onRemove={handleRemove}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
}
