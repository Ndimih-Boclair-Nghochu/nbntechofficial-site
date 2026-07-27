const VALUES = [
  "Reliability",
  "Clean code",
  "Performance",
  "Security",
  "Scalability",
  "End-to-end ownership",
  "Accessibility",
  "Observability",
  "Automation",
  "Craftsmanship",
];

/**
 * A continuously scrolling band of values — echoes hooyia's rotating keyword
 * strip. Sits on the deep navy so it bridges the hero into the light body.
 */
export function ValuesMarquee() {
  const track = [...VALUES, ...VALUES];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-navy-900 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-navy-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-navy-900 to-transparent" />
      <div
        className="nbn-marquee-track items-center gap-10"
        style={{ ["--marquee-duration" as string]: "38s" }}
      >
        {track.map((v, i) => (
          <span key={`${v}-${i}`} className="flex shrink-0 items-center gap-10">
            <span className="text-lg font-semibold tracking-tight text-white/85 sm:text-xl">{v}</span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
