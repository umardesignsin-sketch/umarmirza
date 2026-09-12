import { ImageResponse } from "next/og";

export const alt = "Umar Mirza";
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
          background: "#FFFFFF",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "#B0B0B0",
            marginBottom: 18,
          }}
        >
          Umar Mirza
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.15,
            color: "#111111",
            maxWidth: 900,
          }}
        >
          Designer, developer, and creator.
        </div>
      </div>
    ),
    size,
  );
}
