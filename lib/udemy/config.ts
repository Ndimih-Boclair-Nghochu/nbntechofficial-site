/**
 * Udemy-via-Impact sync — configuration.
 *
 * All knobs are environment-driven so the catalogue selection can be tuned
 * without a code change. Nothing here has side effects or touches the network;
 * it is safe to import from tests. Secrets are read lazily inside getImpactAuth()
 * so importing this module never requires credentials.
 */

/** Read a positive integer env var with a fallback. */
function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  const n = raw != null ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}
function floatEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  const n = raw != null ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

export type UdemySyncConfig = {
  /** Hard cap on how many courses ever enter the DB (protects the database). */
  maxCourses: number;
  /** Informational cadence, shown in the admin panel; the cron schedule is in vercel.json. */
  syncIntervalHours: number;
  /** Aggressive pre-insert filters. */
  minRating: number;
  minReviews: number;
  /** Pagination bounds so a single run never scans the whole 313k catalogue. */
  maxPages: number;
  pageSize: number;
  /** Memory bound: the in-flight candidate list is trimmed to this many best-scored items. */
  maxCandidates: number;
  /** Impact catalog id for the Udemy feed (from the Impact dashboard). */
  catalogId: string | null;
  /** Deep-link base: the Impact tracking link the course URL is appended to. */
  trackingBase: string | null;
  /** Deep-link query parameter (Impact uses "u"). */
  deeplinkParam: string;
};

export function getUdemySyncConfig(): UdemySyncConfig {
  return {
    maxCourses: intEnv("UDEMY_MAX_COURSES", 100),
    syncIntervalHours: intEnv("UDEMY_SYNC_INTERVAL_HOURS", 24),
    minRating: floatEnv("UDEMY_MIN_RATING", 4.3),
    minReviews: intEnv("UDEMY_MIN_REVIEWS", 100),
    maxPages: intEnv("UDEMY_SYNC_MAX_PAGES", 50),
    pageSize: intEnv("UDEMY_SYNC_PAGE_SIZE", 100),
    maxCandidates: intEnv("UDEMY_MAX_CANDIDATES", 4000),
    catalogId: process.env.IMPACT_UDEMY_CATALOG_ID?.trim() || null,
    trackingBase: process.env.IMPACT_UDEMY_TRACKING_BASE?.trim() || null,
    deeplinkParam: process.env.IMPACT_UDEMY_DEEPLINK_PARAM?.trim() || "u",
  };
}

/** Impact Basic-auth credentials (server-only). Returns null if not configured. */
export function getImpactAuth(): { accountSid: string; authToken: string } | null {
  const accountSid = process.env.IMPACT_ACCOUNT_SID?.trim();
  const authToken = process.env.IMPACT_AUTH_TOKEN?.trim();
  if (!accountSid || !authToken) return null;
  return { accountSid, authToken };
}

/** Rows this system manages carry this marker in Course.trackingId so the sync
 *  only ever deactivates/updates its own rows and never touches manual courses. */
export const UDEMY_SYNC_MARKER = "udemy-catalog-sync";

/** Deterministic slug for a catalogue item so re-runs upsert instead of duplicating. */
export function udemyCourseSlug(externalId: string): string {
  return `udemy-${externalId}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-");
}

/**
 * Build the per-course tracked affiliate URL via Impact's supported deep-link
 * mechanism: append the percent-encoded Udemy course URL to the tracking link
 * as `?u=<encoded url>` (verified against Impact's deep-link docs). Returns null
 * when deep-linking isn't configured — the caller then stores the raw course
 * URL and the admin can paste a per-course tracked link instead. We NEVER invent
 * an Impact API endpoint here.
 */
export function buildUdemyAffiliateUrl(courseUrl: string, cfg: UdemySyncConfig): string | null {
  const base = cfg.trackingBase;
  if (!base || !courseUrl) return null;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${encodeURIComponent(cfg.deeplinkParam)}=${encodeURIComponent(courseUrl)}`;
}

/* ------------------------------------------------------------------ *
 * Priority topics — the high-demand, commercial-intent subjects to keep.
 * Each maps to a site category slug (lib/courses.ts) and carries keywords
 * used for relevance scoring. Fully editable; add a topic and it's picked up.
 * ------------------------------------------------------------------ */

export type PriorityTopic = {
  /** Site category slug (must exist in COURSE_CATEGORIES). */
  category: string;
  /** Lower-cased keywords; a match in title/category raises relevance. */
  keywords: string[];
  /** Relative importance (higher = more strongly preferred). */
  weight: number;
};

export const PRIORITY_TOPICS: PriorityTopic[] = [
  { category: "artificial-intelligence", keywords: ["generative ai", "gen ai", "chatgpt", "prompt engineering", "llm", "openai", "artificial intelligence", " ai "], weight: 1.0 },
  { category: "machine-learning", keywords: ["machine learning", "deep learning", "neural network", "tensorflow", "pytorch"], weight: 0.95 },
  { category: "data-science", keywords: ["data science", "data analytics", "data analysis", "power bi", "tableau"], weight: 0.9 },
  { category: "python", keywords: ["python", "django", "flask", "pandas", "numpy"], weight: 0.9 },
  { category: "cybersecurity", keywords: ["cybersecurity", "cyber security", "ethical hacking", "penetration testing", "security+", "comptia security"], weight: 0.9 },
  { category: "aws", keywords: ["aws", "amazon web services", "solutions architect", "aws certified"], weight: 0.95 },
  { category: "cloud-computing", keywords: ["cloud computing", "cloud practitioner", "google cloud", "gcp"], weight: 0.85 },
  { category: "microsoft-azure", keywords: ["azure", "az-900", "az-104", "microsoft azure"], weight: 0.85 },
  { category: "devops", keywords: ["devops", "docker", "kubernetes", "terraform", "ci/cd", "jenkins", "ansible"], weight: 0.9 },
  { category: "javascript", keywords: ["javascript", "typescript", "es6"], weight: 0.8 },
  { category: "react", keywords: ["react", "react.js", "redux"], weight: 0.85 },
  { category: "nextjs", keywords: ["next.js", "nextjs"], weight: 0.8 },
  { category: "web-development", keywords: ["web development", "full stack", "full-stack", "node.js", "nodejs", "html css", "frontend", "backend"], weight: 0.8 },
  { category: "excel-office", keywords: ["excel", "microsoft office", "spreadsheet", "vba"], weight: 0.75 },
  { category: "digital-marketing", keywords: ["digital marketing", "seo", "google ads", "social media marketing", "facebook ads"], weight: 0.75 },
  { category: "project-management", keywords: ["project management", "pmp", "scrum", "agile", "prince2"], weight: 0.75 },
  { category: "business", keywords: ["business analytics", "business analysis", "financial analysis", "entrepreneurship"], weight: 0.7 },
  { category: "programming", keywords: ["programming", "java ", "c++", "c#", "golang", "rust "], weight: 0.7 },
];
