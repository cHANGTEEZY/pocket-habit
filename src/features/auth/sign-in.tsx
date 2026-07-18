import { AuthScreenShell } from "./components/auth-screen-shell";
import { SignInForm } from "./components/sign-in-form";

export default function SignIn() {
  return (
    <AuthScreenShell
      title="Hello"
      titleLine2="Sign in!"
      description="Sign in to pick up where you left off with your habits."
      heroRatio={0.1}
    >
      <SignInForm />
    </AuthScreenShell>
  );
}
