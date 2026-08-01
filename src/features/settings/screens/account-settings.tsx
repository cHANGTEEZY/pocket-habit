import { useAuth } from "@/api/hooks/use-auth";
import GoBackButton from "@/components/GoBackButton";
import CollapsedLargeHeader from "@/components/layouts/CollapsedLargeHeader";
import { DangerIcon } from "@hugeicons/core-free-icons";
import { Separator } from "heroui-native/separator";
import { useState } from "react";
import { Alert, View } from "react-native";
import { SettingsRow } from "../components/settings-row";
import { SettingsSection } from "../components/settings-section";
import { AccountEditSheet } from "../components/account-edit-sheet";
import type { AccountEditField, AccountEditValues } from "../schemas/account-edit";
import { logger } from "@/utils/logger";

const AccountSettings = () => {
  const user = useAuth().session;
  const [editField, setEditField] = useState<AccountEditField | null>(null);

  const record = user?.record as Record<string, unknown> | null | undefined;
  const email = typeof record?.email === "string" ? record.email : "";
  const username =
    (typeof record?.username === "string" ? record.username : "") ||
    (typeof record?.name === "string" ? record.name : "");
  const phone = typeof record?.phone === "string" ? record.phone : "";

  const handleEditSubmit = (values: AccountEditValues) => {
    logger.info("TODO: persist account update", values);
  };

  return (
    <View className="flex-1 bg-background">
      <CollapsedLargeHeader
        title={"Account Settings"}
        leading={<GoBackButton />}
      >
        <View className="gap-6 px-4 pb-8 mt-5">
          <SettingsSection title="Basic Info">
            <SettingsRow
              title="Email"
              description={email || "Email, password, security"}
              edit={true}
              onPress={() => setEditField("email")}
            />
            <Separator className="ml-5" />

            <SettingsRow
              title="Phone Number"
              description={phone || "Change your phone number"}
              edit={true}
              onPress={() => setEditField("phone")}
            />
            <Separator className="ml-5" />

            <SettingsRow
              title="Username"
              description={username || "Change your username"}
              edit={true}
              onPress={() => setEditField("username")}
            />
            <Separator className="ml-5" />
          </SettingsSection>

          <SettingsSection title="Security">
            <SettingsRow
              title="Password"
              description="Change your password"
              edit={true}
              onPress={() => setEditField("password")}
            />
          </SettingsSection>

          <SettingsSection title="Danger Zone" className="bg-danger-soft">
            <SettingsRow
              title="Delete Account"
              iconBackground="#F44336"
              icon={DangerIcon}
              trailing={null}
              onPress={() =>
                Alert.alert(
                  "Delete Account",
                  "Are you sure you want to delete your account? This action is irreversible.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        console.log("Delete account");
                      },
                    },
                  ],
                )
              }
            />
          </SettingsSection>
        </View>
      </CollapsedLargeHeader>

      <AccountEditSheet
        field={editField}
        onClose={() => setEditField(null)}
        onSubmit={handleEditSubmit}
      />
    </View>
  );
};

export default AccountSettings;
