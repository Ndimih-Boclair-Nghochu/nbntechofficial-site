import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/site/Reveal";

/**
 * Interior page header. Renders a professional on-brand background image with a
 * light editorial overlay: the image reads on the right, while a canvas gradient
 * keeps the heading area clean and the text crisp. Top padding clears the fixed
 * navbar. Used on About / Work / Process / Contact.
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
  /** Path to the hero background image (e.g. /hero/about.png). */
  background?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-ink-line bg-canvas pt-28 pb-16 sm:pt-32 sm:pb-20">
      {/* Background image */}
      {background && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${background}')` }}
        />
      )}
      {/* Light overlay — opaque on the left (text), fading to reveal the image
          on the right, plus a bottom fade into the page. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/88 to-canvas/40"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-canvas"
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
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-body">{intro}</p>
          )}
          {children}
        </Reveal>
      </Container>
    </header>
  );
}
