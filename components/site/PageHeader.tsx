import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/site/Reveal";

/**
 * Interior page header. Includes top padding to clear the fixed navbar and a
 * navy hairline motif. Used on About / Work / Process / Contact.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-ink-line bg-white pt-28 pb-14 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0B1E3C 1px, transparent 1px), linear-gradient(to bottom, #0B1E3C 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at top right, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at top right, black, transparent 70%)",
        }}
      />
      <Container className="relative">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">
            <span className="h-px w-6 bg-current opacity-60" />
            {eyebrow}
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 text-lg leading-relaxed text-ink-body">{intro}</p>
          )}
          {children}
        </Reveal>
      </Container>
    </header>
  );
}
