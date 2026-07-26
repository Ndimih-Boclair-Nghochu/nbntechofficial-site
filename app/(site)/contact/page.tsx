import type { Metadata } from "next";
import { Mail, Clock, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { SocialLinks } from "@/components/site/SocialLinks";
import { Reveal } from "@/components/site/Reveal";
import { getSiteContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with NBN TECH. Tell me what you're building and where it's stuck — I reply within two business days.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={content.contactHeadline}
        intro={content.contactBody}
        background="/photos/contact.jpg"
      />

      <section className="bg-canvas py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            {/* Left: details */}
            <Reveal className="space-y-8">
              <div className="space-y-5">
                {content.contactEmail && (
                  <a
                    href={`mailto:${content.contactEmail}`}
                    className="group flex items-start gap-4"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-navy transition-colors group-hover:bg-cyan/10 group-hover:text-cyan-deep">
                      <Mail className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink-muted">Email</span>
                      <span className="text-lg font-medium text-ink group-hover:text-cyan-deep">
                        {content.contactEmail}
                      </span>
                    </span>
                  </a>
                )}
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-navy">
                    <Clock className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink-muted">Response time</span>
                    <span className="text-lg font-medium text-ink">Within 2 business days</span>
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-navy">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink-muted">Working</span>
                    <span className="text-lg font-medium text-ink">Remote · worldwide</span>
                  </span>
                </div>
              </div>

              <div className="border-t border-ink-line pt-6">
                <p className="mb-3 text-sm font-medium text-ink-muted">Find me elsewhere</p>
                <SocialLinks links={content.socialLinks} variant="dark" />
              </div>
            </Reveal>

            {/* Right: form */}
            <Reveal delay={0.1}>
              <div className="rounded-xl2 border border-ink-line bg-surface p-6 shadow-card sm:p-8">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
