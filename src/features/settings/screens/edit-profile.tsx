import GoBackButton from "@/components/GoBackButton";
import CollapsedLargeHeader from "@/components/layouts/CollapsedLargeHeader";
import { View } from "react-native";
import ProfileForm from "../components/profile-form";

const EditProfile = () => {
  return (
    <View className="flex-1 bg-background">
      <CollapsedLargeHeader title={"Edit Profile"} leading={<GoBackButton />}>
        <View className="mt-5 gap-2 px-4 pb-8">
          <ProfileForm />
        </View>
      </CollapsedLargeHeader>
    </View>
  );
};

export default EditProfile;
