import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/site/Reveal";

/**
 * Interior page header. Renders the on-brand background image with the SAME
 * dark indigo overlay as the home hero, so every page's header reads
 * consistently. White text on the navy scrim. Top padding clears the fixed
 * navbar. Used on About / Work / Process / Contact / Reviews.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  background,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Path to the hero background image (e.g. /photos/about.jpg). */
  background?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden bg-navy-950 pt-28 pb-16 text-white sm:pt-32 sm:pb-20">
      {/* Background image */}
      {background && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${background}')` }}
        />
      )}
      {/* Dark indigo overlay — matches the home hero. Readable on the left,
          image stays visible toward the right, with a bottom fade into the page. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-navy-950/92 via-navy-950/70 to-navy-950/40 lg:to-navy-950/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-navy-950/50"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-canvas"
      />

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
          <span className="eyebrow justify-center text-cyan lg:justify-start">
            <span className="h-px w-6 bg-current opacity-60" />
            {eyebrow}
          </span>
          <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg lg:mx-0">
              {intro}
            </p>
          )}
          {children}
        </Reveal>
      </Container>
    </header>
  );
}
