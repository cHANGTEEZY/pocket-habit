import { useEffect, useRef } from "react";
import { Pressable, type TextInputProps } from "react-native";
import { useCSSVariable } from "uniwind";

import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { InputGroup } from "heroui-native";

type SearchProps = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  hasDebounce?: boolean;
  debounceTime?: number;
  autoFocus?: boolean;
  className?: string;
} & Omit<TextInputProps, "value" | "onChange" | "onChangeText" | "placeholder">;

export default function Search({
  placeholder = "Search",
  value,
  onChange,
  onSearch,
  hasDebounce = false,
  debounceTime = 300,
  autoFocus,
  className,
  ...inputProps
}: SearchProps) {
  const muted = useCSSVariable("--color-muted");
  const iconColor = typeof muted === "string" ? muted : "#8A8A8F";
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasDebounce || !onSearch) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, debounceTime);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, hasDebounce, debounceTime, onSearch]);

  const handleChange = (next: string) => {
    onChange(next);
    if (!hasDebounce) {
      onSearch?.(next.trim());
    }
  };

  const handleClear = () => {
    onChange("");
    onSearch?.("");
  };

  const handleSubmit = () => {
    onSearch?.(value.trim());
  };

  return (
    <InputGroup className={className}>
      <InputGroup.Prefix isDecorative>
        <HugeiconsIcon
          icon={Search01Icon}
          size={20}
          color={iconColor}
          strokeWidth={1.75}
        />
      </InputGroup.Prefix>

      <InputGroup.Input
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel={placeholder}
        onSubmitEditing={handleSubmit}
        {...inputProps}
      />

      {value.length > 0 ? (
        <InputGroup.Suffix>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            onPress={handleClear}
            className="h-9 w-9 items-center justify-center"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={18}
              color={iconColor}
              strokeWidth={1.75}
            />
          </Pressable>
        </InputGroup.Suffix>
      ) : null}
    </InputGroup>
  );
}
