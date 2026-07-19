import { View } from "react-native";

import { Typography } from "heroui-native/text";

type FieldLabelProps = {
  children: string;
  /** When true, shows a Required badge. When false, shows Optional. */
  required?: boolean;
};

/** Compact label row with a Required / Optional distinction. */
export function FieldLabel({ children, required = false }: FieldLabelProps) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <View className="min-w-0 flex-1 flex-row items-center gap-1">
        <Typography type="body-sm" weight="medium" className="text-muted">
          {children}
        </Typography>
        {required ? (
          <Typography
            type="body-sm"
            weight="semibold"
            className="text-accent"
            accessibilityLabel="required"
          >
            *
          </Typography>
        ) : null}
      </View>
      <Typography type="body-xs" className="text-muted/80">
        {required ? "Required" : "Optional"}
      </Typography>
    </View>
  );
}
