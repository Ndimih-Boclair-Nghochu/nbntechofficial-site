/**
 * Small, dependency-free SVG charts for the admin dashboard. Themed with the
 * site tokens (cyan = primary/views, navy = secondary/clicks). Responsive via
 * viewBox; accessible via titles + aria-labels.
 */

export function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0) + "m";
  if (n >= 1_000) return (n / 1_000).toFixed(n % 1_000 ? 1 : 0) + "k";
  return String(n);
}

const CYAN = "#2FB49A";
const NAVY = "#04045E";
const LINE = "#E4E7F2";
const MUTED = "#6B7192";

/** Two-series area/line chart over a day range. */
export function AreaLineChart({
  series,
}: {
  series: { day: string; views: number; clicks: number }[];
}) {
  const W = 760;
  const H = 240;
  const padL = 34;
  const padR = 12;
  const padT = 14;
  const padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = series.length;
  const max = Math.max(1, ...series.map((d) => Math.max(d.views, d.clicks)));

  const x = (i: number) => padL + (n <= 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const y = (v: number) => padT + innerH - (v / max) * innerH;

  const line = (key: "views" | "clicks") =>
    series.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ");
  const area =
    `M${x(0).toFixed(1)},${(padT + innerH).toFixed(1)} ` +
    series.map((d, i) => `L${x(i).toFixed(1)},${y(d.views).toFixed(1)}`).join(" ") +
    ` L${x(n - 1).toFixed(1)},${(padT + innerH).toFixed(1)} Z`;

  const grid = [0, 0.25, 0.5, 0.75, 1];
  const ticks = n > 1 ? [0, Math.floor((n - 1) / 2), n - 1] : [0];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Views and affiliate clicks over the last ${n} days`}
      preserveAspectRatio="none"
    >
      {grid.map((g, i) => {
        const gy = padT + innerH - g * innerH;
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={gy} y2={gy} stroke={LINE} strokeWidth={1} />
            <text x={4} y={gy + 3} fontSize={9} fill={MUTED}>{fmt(Math.round(g * max))}</text>
          </g>
        );
      })}
      <path d={area} fill={CYAN} opacity={0.12} />
      <path d={line("views")} fill="none" stroke={CYAN} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
      <path d={line("clicks")} fill="none" stroke={NAVY} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
      {ticks.map((i) => (
        <text key={i} x={x(i)} y={H - 8} fontSize={9} fill={MUTED} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}>
          {series[i]?.day.slice(5)}
        </text>
      ))}
    </svg>
  );
}

/** Compact multi-point sparkline for KPI cards. */
export function Sparkline({ values, color = CYAN }: { values: number[]; color?: string }) {
  const W = 120;
  const H = 34;
  const max = Math.max(1, ...values);
  const n = values.length;
  const x = (i: number) => (n <= 1 ? W / 2 : (i * W) / (n - 1));
  const y = (v: number) => H - 2 - (v / max) * (H - 4);
  const d = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-8 w-full" preserveAspectRatio="none" aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Horizontal bar list (top products, countries, providers). */
export function BarList({
  items,
  color = CYAN,
  empty = "No data yet",
}: {
  items: { label: React.ReactNode; value: number; sub?: string }[];
  color?: string;
  empty?: string;
}) {
  if (!items.length) return <p className="py-6 text-center text-sm text-ink-muted">{empty}</p>;
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-ink">{it.label}</span>
            <span className="shrink-0 font-semibold text-ink">
              {fmt(it.value)}
              {it.sub && <span className="ml-1 text-xs font-normal text-ink-muted">{it.sub}</span>}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink-line/60">
            <div className="h-full rounded-full" style={{ width: `${(it.value / max) * 100}%`, background: color }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
