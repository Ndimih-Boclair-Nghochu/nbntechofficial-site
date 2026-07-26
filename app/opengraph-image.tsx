import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NBN TECH — Software Engineering, Done Properly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Auto-generated social share card. No external assets — draws the brand marks
// directly so it works on the edge runtime.
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #07142A 0%, #0B1E3C 55%, #12305C 100%)",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
          <div
            style={{
              width: 72,
              height: 84,
              borderRadius: 12,
              border: "4px solid #4FC3F7",
              background: "#0B1E3C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "#4FC3F7" }} />
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            <span style={{ color: "white" }}>NBN</span>
            <span style={{ color: "#4FC3F7" }}>&nbsp;TECH</span>
          </div>
        </div>

        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 900, letterSpacing: -2 }}>
          Software engineering, done properly.
        </div>
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.7)", marginTop: 28 }}>
          Web · Mobile · Cloud · DevOps
        </div>

        <div
          style={{
            position: "absolute",
            right: -120,
            bottom: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(79,195,247,0.18)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
