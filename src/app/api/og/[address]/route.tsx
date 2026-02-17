import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;

  // Mock data for OG image
  const dna = [
    { label: "Perp Trading", percentage: 40, color: "#FF6B35" },
    { label: "DEX Swaps", percentage: 25, color: "#3B82F6" },
    { label: "Yield Farming", percentage: 20, color: "#10B981" },
    { label: "Lending", percentage: 15, color: "#8B5CF6" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #0D1B2A 100%)",
          padding: "48px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Left side (60%) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "60%",
            paddingRight: "48px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#71717A",
              marginBottom: "8px",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            {short}
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "#FAFAFA",
              marginBottom: "32px",
              display: "flex",
            }}
          >
            DeFi Identity 2025
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <div style={{ display: "flex", color: "#A1A1AA", fontSize: "18px" }}>
              5 Chains &middot; 2,847 Trades
            </div>
            <div style={{ display: "flex", color: "#A1A1AA", fontSize: "18px" }}>
              $1.2M Volume
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255, 215, 0, 0.15)",
              padding: "16px 20px",
              borderRadius: "8px",
            }}
          >
            <span style={{ fontSize: "28px", display: "flex" }}>🥇</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#FFD700",
                  display: "flex",
                }}
              >
                Gold Explorer
              </span>
              <span style={{ fontSize: "14px", color: "#71717A", display: "flex" }}>
                Top 8%
              </span>
            </div>
          </div>
        </div>

        {/* Right side (40%) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "40%",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#71717A", display: "flex" }}>
            DeFi DNA:
          </div>
          {dna.map((item) => (
            <div
              key={item.label}
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    height: "16px",
                    background: "#222222",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: "100%",
                      background: item.color,
                      borderRadius: "4px 0 0 4px",
                      display: "flex",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#FAFAFA",
                    width: "40px",
                    textAlign: "right",
                    display: "flex",
                  }}
                >
                  {item.percentage}%
                </span>
              </div>
              <span style={{ fontSize: "12px", color: "#A1A1AA", display: "flex" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "0",
            right: "0",
            textAlign: "center",
            fontSize: "14px",
            color: "#71717A",
            display: "flex",
            justifyContent: "center",
          }}
        >
          cryptree.xyz
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
