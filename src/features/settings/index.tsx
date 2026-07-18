import Constants from "expo-constants";
import { router } from "expo-router";
import { Alert, Linking, Platform, View } from "react-native";
import { useUniwind } from "uniwind";

import {
  AccountSetting01Icon,
  AlarmClockIcon,
  BellIcon,
  Logout01Icon,
  Mail01Icon,
  PaintBrush01Icon,
  SecurityCheckIcon,
  Shield01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { Separator } from "heroui-native";
import { Avatar } from "heroui-native/avatar";
import { Typography } from "heroui-native/text";

import { useSession } from "@/api";
import GoBackButton from "@/components/GoBackButton";
import CollapsedLargeHeader from "@/components/layouts/CollapsedLargeHeader";
import { getInitials } from "@/features/today/lib/greeting";

import { SettingsRow } from "./components/settings-row";
import { SettingsSection } from "./components/settings-section";
import {
  cycleAppearance,
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

  const name =
    typeof session?.record?.name === "string" && session.record.name.trim()
      ? session.record.name.trim()
      : "Your profile";
  const email =
    typeof session?.record?.email === "string" ? session.record.email : null;
  const initials = getInitials(name === "Your profile" ? null : name);
  const appearance = resolveAppearancePreference(theme, hasAdaptiveThemes);
  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "1.0.0";

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
      <CollapsedLargeHeader title="Settings" leading={<GoBackButton />}>
        <View className="gap-6 px-4 pb-8">
          <SettingsSection>
            <SettingsRow
              title={name}
              description="View Profile"
              leading={
                <Avatar size="md" color="accent" variant="soft">
                  {initials ? (
                    <Avatar.Fallback
                      styles={{
                        text: { color: "white" },
                      }}
                    >
                      {initials}
                    </Avatar.Fallback>
                  ) : (
                    <Avatar.Fallback />
                  )}
                </Avatar>
              }
              onPress={() =>
                Alert.alert("Profile", "Profile details are coming soon.")
              }
            />
            <Separator className="ml-[68px] mr-4" />
            <SettingsRow
              title="Edit Profile"
              onPress={() =>
                Alert.alert(
                  "Edit Profile",
                  "Editing your profile is coming soon.",
                )
              }
            />
          </SettingsSection>

          <SettingsSection>
            <SettingsRow
              title="Account"
              description={email ?? "Email, password, security"}
              icon={AccountSetting01Icon}
              iconBackground="#636366"
              onPress={() =>
                Alert.alert(
                  "Account",
                  "Manage email and password from here soon.",
                )
              }
            />
            <Separator className="ml-14 mr-4" />
            <SettingsRow
              title="Reminders"
              description="Daily habit check-in times"
              icon={AlarmClockIcon}
              iconBackground="#AF52DE"
              onPress={() =>
                Alert.alert(
                  "Reminders",
                  "Habit reminder times will live here.",
                )
              }
            />
          </SettingsSection>

          <SettingsSection title="Preferences">
            <SettingsRow
              title="Notifications"
              icon={BellIcon}
              iconBackground="#FF3B30"
              onPress={openSystemSettings}
            />
            <Separator className="ml-14 mr-4" />
            <SettingsRow
              title="Permissions"
              icon={SecurityCheckIcon}
              iconBackground="#34C759"
              onPress={openSystemSettings}
            />
            <Separator className="ml-14 mr-4" />
            <SettingsRow
              title="Appearance"
              description={getAppearanceLabel(appearance)}
              icon={PaintBrush01Icon}
              iconBackground="#FF2D55"
              onPress={() => {
                cycleAppearance(appearance);
              }}
            />
          </SettingsSection>

          <SettingsSection title="Resources">
            <SettingsRow
              title="Contact Support"
              icon={Mail01Icon}
              iconBackground="#007AFF"
              onPress={openSupport}
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
            />
          </SettingsSection>

          <SettingsSection>
            <SettingsRow
              title="Sign Out"
              icon={Logout01Icon}
              iconBackground="#FF3B30"
              trailing={null}
              onPress={confirmSignOut}
            />
          </SettingsSection>

          <Typography
            type="body-xs"
            className="text-center text-muted"
            accessibilityLabel={`App version ${version}`}
          >
            Version {version}
          </Typography>
        </View>
      </CollapsedLargeHeader>
    </View>
  );
}
