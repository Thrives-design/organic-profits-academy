// Plausible Analytics helper
// Loaded via the <script> tag in index.html, exposed on window.plausible.
// Safe to call before the script has loaded — events are queued.
//
// Use the named helpers below for the events we care about, or call
// `track(name, props)` directly for one-off events.

declare global {
  interface Window {
    plausible?: {
      (
        eventName: string,
        options?: { props?: Record<string, string | number | boolean> },
      ): void;
      q?: unknown[];
    };
  }
}

export function track(
  name: string,
  props?: Record<string, string | number | boolean>,
) {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.plausible === "function") {
      window.plausible(name, props ? { props } : undefined);
    }
  } catch {
    // Never let analytics break the app.
  }
}

// === Conversion events ===

export function trackSignup() {
  track("Signup");
}

export function trackLogin() {
  track("Login");
}

/** Fires when the user clicks Buy / Start Plan, before redirect to Stripe. */
export function trackCheckoutStarted(planType: string) {
  track("Checkout Started", { plan: planType });
}

/** Fires when the user lands on the success page after a Stripe purchase. */
export function trackPurchaseCompleted(planType: string) {
  track("Purchase Completed", { plan: planType });
}

export function trackForgotPasswordRequested() {
  track("Forgot Password Requested");
}

export function trackPasswordReset() {
  track("Password Reset Completed");
}

/** Generic CTA tracking — pass a label so we can tell different CTAs apart. */
export function trackCTA(label: string) {
  track("CTA Click", { label });
}
