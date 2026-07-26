import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { WorkGrid } from "@/components/site/WorkGrid";
import { CtaBand } from "@/components/site/CtaBand";
import { getProjects, getSiteContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by NBN TECH across web, mobile, cloud and DevOps — full case studies of software built to last.",
};

export const revalidate = 60;

export default async function WorkPage() {
  const [projects, content] = await Promise.all([getProjects(), getSiteContent()]);

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Selected projects."
        intro="A cross-section of engagements — web platforms, mobile apps, and the cloud infrastructure underneath them. Filter by discipline below."
        background="/photos/work.jpg"
      />

      <section className="bg-canvas py-section">
        <Container>
          <WorkGrid projects={projects} />
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
