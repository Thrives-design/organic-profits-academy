import { ReactNode } from "react";
import { Layout } from "@/components/Layout";

/**
 * Shared wrapper for legal pages (Privacy, Terms, Refund).
 * Renders title, eyebrow, last-updated date, and a constrained
 * prose container with editorial typography.
 */
export function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  children,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-2">{eyebrow}</p>
            <h1 className="serif text-4xl md:text-5xl tracking-tight">{title}</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none legal-prose">
            {children}
          </div>
        </div>
      </section>
    </Layout>
  );
}
