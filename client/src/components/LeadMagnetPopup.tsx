import { useState, useEffect } from "react";
import { X, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

const STORAGE_KEY = "opa_lead_dismissed";
const DELAY_MS = 8000; // show after 8 seconds

export function LeadMagnetPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Don't show if already dismissed or submitted
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError("");
    try {
      await apiRequest("POST", "/api/lead-magnet", { name, email });
      setSuccess(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
      // Auto-trigger ebook download
      const link = document.createElement("a");
      link.href = "/api/lead-magnet/download";
      link.download = "OPA-Beginners-Guide-to-Day-Trading.pdf";
      link.click();
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      data-testid="lead-popup"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden shadow-2xl"
        style={{ background: "hsl(37 26% 13%)", border: "1px solid hsl(40 28% 55%)" }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-[hsl(42 44% 97% / 0.5)] hover:text-[hsl(42 44% 97%)] transition-colors z-10"
          data-testid="button-popup-close"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-6" style={{ borderBottom: "1px solid hsl(40 28% 55% / 0.3)" }}>
          <p className="mono text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: "hsl(40 28% 55%)" }}>
            Free Download
          </p>
          <h2 className="serif text-3xl md:text-4xl leading-tight" style={{ fontWeight: 400, color: "hsl(42 44% 97%)" }}>
            The Beginner's Guide<br />
            <span className="italic">to Day Trading</span>
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "hsl(42 44% 97% / 0.7)" }}>
            Learn the exact foundations Byron teaches inside OPA — markets, risk management, and your first setup. Free.
          </p>

          {/* What's inside */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            {[
              "Understanding the markets",
              "Risk management rules",
              "Reading charts & candles",
              "The OPA trading approach",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "hsl(40 28% 55%)" }} />
                <span className="text-[12px]" style={{ color: "hsl(42 44% 97% / 0.65)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form / Success */}
        <div className="px-8 py-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "hsl(40 28% 55% / 0.2)" }}>
                <Download size={20} style={{ color: "hsl(40 28% 55%)" }} />
              </div>
              <p className="serif text-xl" style={{ color: "hsl(42 44% 97%)" }}>Your guide is downloading.</p>
              <p className="mt-2 text-[13px]" style={{ color: "hsl(42 44% 97% / 0.6)" }}>
                Check your inbox — we sent a copy to {email} as well.
              </p>
              <Button
                onClick={dismiss}
                className="mt-6 w-full h-11 rounded-none mono text-[11px] uppercase tracking-[0.15em]"
                style={{ background: "hsl(40 28% 55%)", color: "hsl(37 26% 13%)" }}
              >
                Continue to Site
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-none border-0 text-[14px] placeholder:text-[hsl(37 26% 13% / 0.4)]"
                style={{ background: "hsl(42 44% 97%)", color: "hsl(37 26% 13%)" }}
                data-testid="input-popup-name"
              />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-none border-0 text-[14px] placeholder:text-[hsl(37 26% 13% / 0.4)]"
                style={{ background: "hsl(42 44% 97%)", color: "hsl(37 26% 13%)" }}
                data-testid="input-popup-email"
              />
              {error && <p className="text-[12px] text-red-400">{error}</p>}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-none mono text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-2"
                style={{ background: "hsl(40 28% 55%)", color: "hsl(37 26% 13%)" }}
                data-testid="button-popup-submit"
              >
                {submitting ? "Sending..." : (
                  <>Send Me the Free Guide <ArrowRight size={14} /></>
                )}
              </Button>
              <p className="text-center text-[11px]" style={{ color: "hsl(42 44% 97% / 0.35)" }}>
                No spam. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
