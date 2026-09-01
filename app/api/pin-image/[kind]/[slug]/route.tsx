import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getProductBySlug } from "@/lib/marketplace-data";
import { getCourseBySlug } from "@/lib/courses-data";
import { categoryLabel, money } from "@/lib/marketplace";
import { courseCategoryLabel } from "@/lib/courses";

export const runtime = "nodejs";

// Vertical 2:3 pin (Pinterest's recommended ratio).
const W = 1000;
const H = 1500;

const THEMES = [
  { bg: "#0a1f44", accent: "#E0A93B" }, // navy + gold
  { bg: "#111633", accent: "#2FB49A" }, // ink + cyan
  { bg: "#0c1a3a", accent: "#E0A93B" }, // deep navy + gold
];

type Data = { name: string; image: string | null; eyebrow: string; price: string | null };

async function load(kind: string, slug: string): Promise<Data | null> {
  if (kind === "course") {
    const c = await getCourseBySlug(slug);
    if (!c) return null;
    return {
      name: c.title,
      image: c.image,
      eyebrow: "ONLINE COURSE",
      price: c.price != null ? money(c.price, c.currency || "USD") : null,
    };
  }
  const p = await getProductBySlug(slug);
  if (!p) return null;
  return {
    name: p.name,
    image: p.imageUrl,
    eyebrow: (categoryLabel(p.category) || "NBN MARKET").toUpperCase(),
    price: p.price != null ? money(p.price, p.currency || "EUR") : null,
  };
}

export async function GET(req: NextRequest, { params }: { params: { kind: string; slug: string } }) {
  const v = Math.max(1, Math.min(THEMES.length, Number(req.nextUrl.searchParams.get("v")) || 1));
  const theme = THEMES[v - 1];
  const data = (await load(params.kind, params.slug)) || { name: "NBN MARKET", image: null, eyebrow: "NBN MARKET", price: null };
  const headline = data.name.length > 68 ? data.name.slice(0, 67) + "…" : data.name;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: theme.bg, color: "#fff", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 4, color: theme.accent }}>{data.eyebrow}</div>

          <div style={{ display: "flex", marginTop: 36, height: 760, borderRadius: 32, background: "#ffffff", alignItems: "center", justifyContent: "center", padding: 28 }}>
            {data.image ? (
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img src={data.image} width={820} height={700} style={{ objectFit: "contain" }} />
            ) : (
              <div style={{ display: "flex", fontSize: 80, fontWeight: 800, color: theme.bg }}>NBN MARKET</div>
            )}
          </div>

          <div style={{ display: "flex", fontSize: 54, fontWeight: 800, marginTop: 40, lineHeight: 1.12 }}>{headline}</div>

          {data.price && (
            <div style={{ display: "flex", marginTop: 24 }}>
              <div style={{ display: "flex", background: theme.accent, color: theme.bg, fontSize: 40, fontWeight: 800, padding: "10px 26px", borderRadius: 14 }}>{data.price}</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28, fontSize: 30 }}>
          <div style={{ display: "flex", fontWeight: 800 }}>🛍️ NBN MARKET</div>
          <div style={{ display: "flex", color: theme.accent, fontWeight: 700 }}>Tap for the live price →</div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
}
