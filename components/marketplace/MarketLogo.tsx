/**
 * NBN MARKET brand mark — a unique inline-SVG logo: a shopping bag with an
 * upward "market growth" arrow, in the marketplace's colours (navy → teal
 * gradient badge, orange accent arrow). Replaces the NBN TECH logo so the
 * storefront reads as its own brand.
 */
export function MarketLogo({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="NBN MARKET"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nbm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0A0A85" />
          <stop offset="1" stopColor="#2FB49A" />
        </linearGradient>
      </defs>

      {/* rounded gradient badge */}
      <rect x="1" y="1" width="46" height="46" rx="13" fill="url(#nbm-grad)" />

      {/* shopping-bag body */}
      <path
        d="M13.5 18.5 H34.5 L33.1 35.6 A3 3 0 0 1 30.1 38.3 H17.9 A3 3 0 0 1 14.9 35.6 Z"
        fill="#ffffff"
        opacity="0.97"
      />

      {/* bag handle */}
      <path
        d="M18.6 19.5 V16.9 a5.4 5.4 0 0 1 10.8 0 V19.5"
        fill="none"
        stroke="#04045E"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* upward growth arrow (orange) */}
      <path d="M18.8 33 L28.6 23.4" fill="none" stroke="#ff9900" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23.9 23 H29.2 V28.3" fill="none" stroke="#ff9900" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
