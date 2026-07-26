import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SplashScreen } from "@/components/site/SplashScreen";
import { getSiteContent } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();
  return (
    <>
      <SplashScreen />
      <Navbar />
      <main id="main">{children}</main>
      <Footer content={content} />
    </>
  );
}
