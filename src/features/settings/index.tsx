import { router } from "expo-router";
import { Alert, Linking, Platform, View } from "react-native";
import { useUniwind } from "uniwind";

import {
  BellIcon,
  Logout01Icon,
  Mail01Icon,
  PaintBrush01Icon,
  SecurityCheckIcon,
  Shield01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { Separator } from "heroui-native";

import { useSession } from "@/api";
import GoBackButton from "@/components/GoBackButton";
import CollapsedLargeHeader from "@/components/layouts/CollapsedLargeHeader";

import MeshBackground from "@/components/MeshBackground";
import ProfileButton from "@/components/ProfileButton";
import SettingsFooter from "./components/settings-footer";
import { SettingsRow } from "./components/settings-row";
import { SettingsSection } from "./components/settings-section";
import {
  getAppearanceLabel,
  resolveAppearancePreference,
} from "./lib/appearance";

function openSupport() {
  void Linking.openURL(
    "mailto:support@example.com?subject=Focus%20app%20support",
  );
}

function openStoreReview() {
  const iosUrl = "https://apps.apple.com";
  const androidUrl = "https://play.google.com/store";
  void Linking.openURL(Platform.OS === "ios" ? iosUrl : androidUrl);
}

function openSystemSettings() {
  void Linking.openSettings();
}

export default function Settings() {
  const { session, signOut } = useSession();
  const { theme, hasAdaptiveThemes } = useUniwind();
  const appearance = resolveAppearancePreference(theme, hasAdaptiveThemes);

  const name =
    typeof session?.record?.name === "string" && session.record.name.trim()
      ? session.record.name.trim()
      : "Your profile";
  const confirmSignOut = () => {
    Alert.alert(
      "Sign out?",
      "You’ll need your email and password to sign back in.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: () => {
            signOut();
            router.replace("/sign-in");
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-background">
      <MeshBackground />
      <CollapsedLargeHeader title="Settings" leading={<GoBackButton />}>
        <View className="gap-6 px-4 pb-8 mt-5">
          <SettingsSection>
            <SettingsRow
              title={name}
              description="Profile, account & reminders"
              leading={<ProfileButton size="md" />}
              trailing={null}
              onPress={() =>
                router.navigate("/(screens)/settings/account-settings")
              }
            />
          </SettingsSection>

          <SettingsSection title="Preferences">
            <SettingsRow
              title="Notifications"
              icon={BellIcon}
              iconBackground="#FF3B30"
              onPress={openSystemSettings}
              external
            />
            <Separator className="ml-14 mr-4" />
            <SettingsRow
              title="Permissions"
              icon={SecurityCheckIcon}
              iconBackground="#34C759"
              onPress={openSystemSettings}
              external
            />
            <Separator className="ml-14 mr-4" />
            <SettingsRow
              title="Appearance"
              description={getAppearanceLabel(appearance)}
              icon={PaintBrush01Icon}
              iconBackground="#FF2D55"
              onPress={() => {
                router.navigate("/(screens)/settings/appearance");
              }}
            />
          </SettingsSection>

          <SettingsSection title="Resources">
            <SettingsRow
              title="Contact Support"
              icon={Mail01Icon}
              iconBackground="#8B6FC7"
              onPress={openSupport}
              external
            />
            <Separator className="ml-14 mr-4" />
            <SettingsRow
              title="Rate in App Store"
              icon={StarIcon}
              iconBackground="#FFCC00"
              iconColor="#1C1C1E"
              external
              onPress={openStoreReview}
            />
            <Separator className="ml-14 mr-4" />
            <SettingsRow
              title="Privacy"
              description="How we handle your data"
              icon={Shield01Icon}
              iconBackground="#5856D6"
              onPress={() =>
                Alert.alert(
                  "Privacy",
                  "Your habits stay in your account. A full privacy policy will be linked here.",
                )
              }
              external
            />
          </SettingsSection>

          <SettingsSection className="bg-danger-soft">
            <SettingsRow
              title="Sign Out"
              icon={Logout01Icon}
              iconBackground="#FF3B30"
              trailing={null}
              onPress={confirmSignOut}
            />
          </SettingsSection>

          <SettingsFooter />
        </View>
      </CollapsedLargeHeader>
    </View>
  );
}
