import React, { useEffect, useState } from "react";
import { StringInputProps, set, unset, useFormValue, useClient } from "sanity";
import { Stack, Text, Card, Box, Select } from "@sanity/ui";

interface Subcategory {
  label: string;
  slug: { current: string };
}

interface Category {
  subcategories?: Subcategory[];
}

export function ProductTypeInput(props: Readonly<StringInputProps>) {
  const { onChange, value = "" } = props;
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useClient({ apiVersion: "2024-01-01" });

  // Get the category reference from the current form
  const categoryRef = useFormValue(["category"]) as
    | { _ref: string }
    | undefined;

  useEffect(() => {
    if (!categoryRef?._ref) {
      setSubcategories([]);
      return;
    }

    setLoading(true);

    // Fetch the category document to get subcategories
    client
      .fetch<Category>(
        `*[_type == "category" && _id == $categoryId][0]{
        subcategories[] {
          label,
          slug
        }
      }`,
        { categoryId: categoryRef._ref },
      )
      .then((category) => {
        setSubcategories(category?.subcategories || []);
      })
      .catch((error) => {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryRef?._ref, client]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    onChange(newValue ? set(newValue) : unset());
  };

  // Render different states
  const renderContent = () => {
    if (!categoryRef?._ref) {
      return (
        <Box>
          <Text size={1} muted>
            Please select a category first to see available subcategories
          </Text>
        </Box>
      );
    }

    if (loading) {
      return (
        <Box>
          <Text size={1} muted>
            Loading subcategories...
          </Text>
        </Box>
      );
    }

    if (subcategories.length === 0) {
      return (
        <Box>
          <Text size={1} muted>
            No subcategories defined for this category. You can still enter a
            custom value below or add subcategories to the category.
          </Text>
        </Box>
      );
    }

    return (
      <Stack space={2}>
        <Text size={1} weight="semibold">
          Select from category subcategories:
        </Text>
        <Select
          fontSize={2}
          padding={3}
          radius={2}
          value={value || ""}
          onChange={handleChange}
        >
          <option value="">-- Select subcategory --</option>
          {subcategories.map((sub) => (
            <option key={sub.slug.current} value={sub.slug.current}>
              {sub.label} ({sub.slug.current})
            </option>
          ))}
        </Select>
      </Stack>
    );
  };

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} shadow={1}>
        <Stack space={3}>
          {renderContent()}

          <Stack space={2}>
            <Text size={1} weight="semibold">
              Or enter custom value:
            </Text>
            <input
              type="text"
              value={value || ""}
              onChange={(e) =>
                onChange(e.target.value ? set(e.target.value) : unset())
              }
              placeholder="e.g., phone-sling-bags"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </Stack>

          {value && (
            <Box paddingTop={2}>
              <Text size={1} muted>
                Current value: <strong>{value}</strong>
              </Text>
            </Box>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
