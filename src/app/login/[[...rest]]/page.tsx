import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up right where your last set left off."
      subtitle="Your library, crates, and set plans are exactly how you left them."
    >
      <SignIn appearance={clerkAppearance} routing="path" path="/login" signUpUrl="/signup" />
    </AuthShell>
  );
}
