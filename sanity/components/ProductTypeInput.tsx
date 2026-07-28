import React, { useEffect, useState } from "react";
import {
  ArrayOfPrimitivesInputProps,
  set,
  unset,
  useFormValue,
  useClient,
} from "sanity";
import { Stack, Text, Card, Box, Checkbox, Flex, Button } from "@sanity/ui";

interface Subcategory {
  label: string;
  slug: { current: string };
}

interface Category {
  subcategories?: Subcategory[];
}

export function ProductTypeInput(props: Readonly<ArrayOfPrimitivesInputProps>) {
  const { onChange, value = [] } = props;
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const client = useClient({ apiVersion: "2024-01-01" });

  // Convert value to array of strings
  const selectedValues: string[] = Array.isArray(value) ? value : [];

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

  const handleToggle = (slug: string) => {
    const newValues = selectedValues.includes(slug)
      ? selectedValues.filter((v) => v !== slug)
      : [...selectedValues, slug];

    onChange(newValues.length > 0 ? set(newValues) : unset());
  };

  const handleAddCustom = () => {
    if (!customValue.trim()) return;

    const newValues = selectedValues.includes(customValue.trim())
      ? selectedValues
      : [...selectedValues, customValue.trim()];

    onChange(set(newValues));
    setCustomValue("");
  };

  const handleRemove = (slug: string) => {
    const newValues = selectedValues.filter((v) => v !== slug);
    onChange(newValues.length > 0 ? set(newValues) : unset());
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
            No subcategories defined for this category. You can add custom
            values below or add subcategories to the category.
          </Text>
        </Box>
      );
    }

    return (
      <Stack space={2}>
        <Text size={1} weight="semibold">
          Select subcategories (multiple):
        </Text>
        <Stack space={2}>
          {subcategories.map((sub) => (
            <Flex key={sub.slug.current} align="center" gap={2}>
              <Checkbox
                checked={selectedValues.includes(sub.slug.current)}
                onChange={() => handleToggle(sub.slug.current)}
              />
              <Text size={2}>{sub.label}</Text>
            </Flex>
          ))}
        </Stack>
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
              Add custom subcategory:
            </Text>
            <Flex gap={2}>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom();
                  }
                }}
                placeholder="e.g., phone-sling-bags"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <Button
                text="Add"
                tone="primary"
                onClick={handleAddCustom}
                disabled={!customValue.trim()}
              />
            </Flex>
          </Stack>

          {selectedValues.length > 0 && (
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Selected subcategories ({selectedValues.length}):
              </Text>
              <Stack space={2}>
                {selectedValues.map((val) => (
                  <Flex key={val} align="center" gap={2}>
                    <Button
                      text="×"
                      tone="critical"
                      mode="ghost"
                      fontSize={1}
                      padding={2}
                      onClick={() => handleRemove(val)}
                    />
                    <Text size={1}>
                      <strong>{val}</strong>
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
