import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { CtaBand } from "@/components/site/CtaBand";
import { getGalleryImages, getSiteContent } from "@/lib/data";
import { OWNER } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photos of ${OWNER.name} (${OWNER.brand}) — talks, work and moments from building software across web, mobile, cloud and DevOps.`,
};

export const revalidate = 60;

export default async function GalleryPage() {
  const [images, content] = await Promise.all([getGalleryImages(), getSiteContent()]);

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments & milestones."
        intro="A visual record — talks, projects, teams and the work behind NBN TECH."
        background="/photos/about.jpg"
      />

      <section className="bg-canvas py-section">
        <Container>
          {images.length > 0 ? (
            <GalleryGrid images={images} />
          ) : (
            <div className="mx-auto max-w-lg rounded-xl2 border border-dashed border-ink-line bg-surface p-12 text-center">
              <p className="text-lg font-medium text-ink">The gallery is coming together.</p>
              <p className="mt-2 text-ink-body">
                Photos are being added. Check back soon, or get in touch in the meantime.
              </p>
            </div>
          )}
        </Container>
      </section>

      <CtaBand
        headline={content.contactHeadline}
        body={content.contactBody}
        email={content.contactEmail}
      />
    </>
  );
}
