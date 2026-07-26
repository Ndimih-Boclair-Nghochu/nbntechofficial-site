import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getSiteContent } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer content={content} />
    </>
  );
}
