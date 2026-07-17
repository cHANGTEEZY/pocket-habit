import { View } from "react-native";

import { FocusGlyph } from "@/components/icons";

import { Typography } from "heroui-native/text";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="gap-5">
      <View
        className="h-12 w-12 items-center justify-center rounded-2xl bg-accent"
        style={{ borderCurve: "continuous" }}
        accessible={false}
      >
        <FocusGlyph size={26} />
      </View>
      <View className="gap-1.5">
        <Typography type="h1" weight="semibold" className="text-foreground">
          {title}
        </Typography>
        <Typography type="body" color="muted">
          {subtitle}
        </Typography>
      </View>
    </View>
  );
}
