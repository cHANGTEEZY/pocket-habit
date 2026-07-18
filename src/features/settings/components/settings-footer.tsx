import Constants from "expo-constants";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import { BloomDoodle } from "@/assets/icons";

import { Typography } from "heroui-native/text";

const buildNumber = "123";

const SettingsFooter = () => {
  const muted = useCSSVariable("--color-muted");
  const doodleColor = typeof muted === "string" ? muted : "#8A8A8F";
  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "1.0.0";

  return (
    <View className="mt-6 items-center gap-1">
      <BloomDoodle size={100} color={doodleColor} />
      <Typography
        type="body-sm"
        className="text-center text-muted/90"
        accessibilityLabel={`App version ${version}`}
      >
        Version {version} (Build {buildNumber})
      </Typography>

      <Typography type="body-sm" className="text-center text-muted/90">
        Terms & Privacy · Data & Acknowledgements
      </Typography>
    </View>
  );
};

export default SettingsFooter;
