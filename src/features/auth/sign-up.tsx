import { AuthScreenShell } from "./components/auth-screen-shell";
import { SignUpForm } from "./components/sign-up-form";

export default function SignUp() {
  return (
    <AuthScreenShell
      title="Create Your"
      titleLine2="Account"
      description="Set up your workspace in a few seconds."
      heroRatio={0.1}
    >
      <SignUpForm />
    </AuthScreenShell>
  );
}
