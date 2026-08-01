import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Start free"
      title="Find your perfect next transition, tonight."
      subtitle="No credit card. Unlimited search on the free tier, upgrade whenever you're ready."
    >
      <SignUp appearance={clerkAppearance} routing="path" path="/signup" signInUrl="/login" />
    </AuthShell>
  );
}
