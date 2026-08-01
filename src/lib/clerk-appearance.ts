import type { Appearance } from "@clerk/types";

/**
 * Reskins Clerk's hosted form components to the R-SYNC design tokens.
 * Keep this the single source of truth — both /login and /signup import it,
 * so any future palette change only happens here.
 */
export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: "#22D3EE",
    colorBackground: "#111113",
    colorText: "#FAFAFA",
    colorTextSecondary: "#8A8A93",
    colorInputBackground: "#09090B",
    colorInputText: "#FAFAFA",
    colorDanger: "#F87171",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-body)",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-transparent shadow-none border-none p-0 w-full",
    headerTitle: "font-display text-2xl font-semibold text-foreground",
    headerSubtitle: "text-muted text-sm",
    socialButtonsBlockButton:
      "border border-border bg-surface hover:bg-surface-raised text-foreground transition-colors",
    socialButtonsBlockButtonText: "text-sm font-medium",
    dividerLine: "bg-border",
    dividerText: "text-muted-2 text-xs",
    formFieldLabel: "text-foreground/90 text-sm font-medium",
    formFieldInput:
      "bg-background border border-border rounded-xl h-11 text-sm focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20",
    formButtonPrimary:
      "bg-cyan text-background hover:brightness-110 shadow-glow text-sm font-medium normal-case h-11",
    footerActionText: "text-muted text-sm",
    footerActionLink: "text-cyan hover:text-cyan-soft",
    identityPreviewText: "text-foreground",
    identityPreviewEditButtonIcon: "text-cyan",
    formResendCodeLink: "text-cyan",
    otpCodeFieldInput: "border-border bg-background text-foreground",
    formFieldInputShowPasswordButton: "text-muted hover:text-foreground",
  },
};
