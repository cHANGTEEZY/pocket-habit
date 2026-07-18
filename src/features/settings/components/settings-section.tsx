import { type ReactNode } from "react";
import { View } from "react-native";

import { ListGroup } from "heroui-native";
import { Typography } from "heroui-native/text";

type SettingsSectionProps = {
  title?: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="gap-2">
      {title ? (
        <Typography
          type="body-sm"
          weight="medium"
          className="px-3 text-muted"
          accessibilityRole="header"
        >
          {title}
        </Typography>
      ) : null}
      <ListGroup className="overflow-hidden rounded-2xl">
        {children}
      </ListGroup>
    </View>
  );
}
