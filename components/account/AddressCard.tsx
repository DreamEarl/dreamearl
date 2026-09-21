import Text from "@/components/ui/Text";
import { translations } from "@/lib/constants/translations";
import type { Address } from "@/lib/addresses/types";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onRemove: (address: Address) => void;
  onSetDefault: (address: Address) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onRemove,
  onSetDefault,
}: Readonly<AddressCardProps>) {
  const t = translations.account.addresses;
  const id = `address-card-${address.id}`;

  return (
    <div id={id} className="border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-3">
        {address.is_default ? (
          <span
            id={`${id}-default-badge`}
            className="inline-block bg-green-50 text-green-700 text-xs tracking-wide px-2 py-1"
          >
            {t.defaultBadge}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3 shrink-0">
          <button
            id={`${id}-edit`}
            type="button"
            onClick={() => onEdit(address)}
            className="text-xs tracking-wide underline underline-offset-2"
          >
            {t.edit}
          </button>
          <button
            id={`${id}-remove`}
            type="button"
            onClick={() => onRemove(address)}
            className="text-xs tracking-wide text-red-600 underline underline-offset-2"
          >
            {t.remove}
          </button>
        </div>
      </div>

      <Text variant="body" className="font-medium">
        {address.full_name}
      </Text>
      <Text variant="caption" className="mt-1">
        {address.line1}
        {address.line2 ? <>, {address.line2}</> : null}
        <br />
        {address.city}, {address.state}
        {address.pincode ? ` \u2013 ${address.pincode}` : ""}
        <br />
        +91 {address.phone}
      </Text>

      {!address.is_default && (
        <button
          id={`${id}-set-default`}
          type="button"
          onClick={() => onSetDefault(address)}
          className="mt-3 text-xs tracking-wide underline underline-offset-2"
        >
          {t.setDefault}
        </button>
      )}
    </div>
  );
}
