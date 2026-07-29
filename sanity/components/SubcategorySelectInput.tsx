import React, { useEffect, useState } from "react";
import { StringInputProps, set, unset, useClient, PatchEvent } from "sanity";
import { Select, Text, Stack, Card } from "@sanity/ui";

interface SubcategoryOption {
  title: string;
  value: string;
}

export function SubcategorySelectInput(props: Readonly<StringInputProps>) {
  const { onChange, value, elementProps } = props;
  const { readOnly, onFocus, onBlur, id, ref } = elementProps;
  const [options, setOptions] = useState<SubcategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const client = useClient({ apiVersion: "2024-01-01" });

  useEffect(() => {
    setLoading(true);
    client
      .fetch<
        Array<{ name: string; subcats: Array<{ label: string; slug: string }> }>
      >(
        `*[_type == "category"] | order(name asc) {
          name,
          "subcats": subcategories[]{
            label,
            "slug": slug.current
          }
        }`,
      )
      .then((categories) => {
        const opts = categories.flatMap((cat) =>
          (cat.subcats ?? []).map((sub) => ({
            title: `${cat.name} › ${sub.label}`,
            value: sub.slug,
          })),
        );
        setOptions(opts);
      })
      .catch((err) => {
        console.error("Error fetching subcategories:", err);
      })
      .finally(() => setLoading(false));
  }, [client]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.currentTarget.value;
    onChange(PatchEvent.from(val ? set(val) : unset()));
  }

  return (
    <Stack space={2}>
      <Card padding={1}>
        {loading ? (
          <Text size={1} muted>
            Loading subcategories…
          </Text>
        ) : (
          <Select
            id={id}
            ref={ref}
            value={value ?? ""}
            disabled={readOnly}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
          >
            <option value="">— None —</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.title}
              </option>
            ))}
          </Select>
        )}
      </Card>
    </Stack>
  );
}
