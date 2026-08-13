/**
 * NBN MARKET brand mark — an inline SVG shopping-bag icon in the marketplace's
 * colors (navy → teal gradient with an orange accent). Replaces the NBN TECH
 * logo inside the marketplace so it reads as its own storefront.
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
      {/* rounded badge */}
      <rect x="1" y="1" width="46" height="46" rx="12" fill="url(#nbm-grad)" />
      {/* shopping bag body */}
      <path
        d="M14 19h20l-1.6 16.2a2 2 0 0 1-2 1.8H17.6a2 2 0 0 1-2-1.8L14 19Z"
        fill="#ffffff"
        opacity="0.96"
      />
      {/* bag handle */}
      <path
        d="M19 20v-2a5 5 0 0 1 10 0v2"
        fill="none"
        stroke="#04045E"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* orange accent dot */}
      <circle cx="24" cy="27.5" r="3.1" fill="#ff9900" />
    </svg>
  );
}
