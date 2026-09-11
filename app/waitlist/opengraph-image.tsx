import { ImageResponse } from "next/og";

export const alt = "FNJ Marketplace — Coming Soon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#FAFAFA",
          padding: 72,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "#0A0A0A",
            marginBottom: 18,
          }}
        >
          FNJ Marketplace is launching soon.
        </div>
        <div style={{ fontSize: 26, color: "#5C5C5C" }}>
          Early access, free conversion credits, and free template listing.
        </div>
      </div>
    ),
    size,
  );
}
