import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { Separator } from "heroui-native/separator";
import { Typography } from "heroui-native/text";

export type ProgressCardProps = {
  /** Primary label in the card header (leading). */
  leadingTitle: string;
  /** Optional secondary label in the header (trailing). */
  trailingTitle?: ReactNode;
  /** Tint for the leading title — matches Today stat card accents. */
  accentColor?: string;
  /** Supporting copy under the title row (e.g. momentum insight). */
  subtitle?: ReactNode;
  /** Main card body below the header. */
  children: ReactNode;
  /** Optional block below the body (e.g. callout). */
  footer?: ReactNode;
  /** Optional separator below the header. */
  separator?: boolean;
  contentClassName?: string;
  className?: string;
} & Pick<ViewProps, "accessibilityRole" | "accessibilityLabel">;

export default function ProgressCard({
  leadingTitle,
  trailingTitle,
  accentColor,
  subtitle,
  children,
  footer,
  contentClassName,
  className,
  accessibilityRole = "summary",
  accessibilityLabel,
  separator = false,
}: ProgressCardProps) {
  return (
    <View
      className={`gap-4 rounded-4xl bg-surface px-4 py-5 ${className ?? ""}`}
      style={{ borderCurve: "continuous" }}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
    >
      <View className="gap-3">
        <View className="flex-row items-center justify-between gap-3">
          <Typography
            type="h5"
            weight="semibold"
            className={accentColor ? undefined : "text-foreground"}
            style={accentColor ? { color: accentColor } : undefined}
          >
            {leadingTitle}
          </Typography>
          {trailingTitle != null ? (
            typeof trailingTitle === "string" ? (
              <Typography type="body-xs" weight="medium" className="text-muted">
                {trailingTitle}
              </Typography>
            ) : (
              trailingTitle
            )
          ) : null}
        </View>

        {subtitle != null ? (
          typeof subtitle === "string" ? (
            <Typography type="body-sm" className="text-foreground/90">
              {subtitle}
            </Typography>
          ) : (
            subtitle
          )
        ) : null}
      </View>

      {separator && <Separator />}

      <View className={contentClassName}>{children}</View>

      {footer}
    </View>
  );
}
