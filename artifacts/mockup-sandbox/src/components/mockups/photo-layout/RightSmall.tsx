import sashaPhoto from "../../../sasha-photo.png";

const glass = {
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  background: "rgba(18, 25, 54, 0.82)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
} as React.CSSProperties;

export function RightSmall() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top left, rgba(139,92,246,0.22), transparent 35%), radial-gradient(circle at top right, rgba(34,211,238,0.15), transparent 30%), linear-gradient(180deg, #090d1b 0%, #0b1020 100%)",
      padding: "20px",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      color: "#eef2ff",
    }}>
      {/* Header with small headshot on RIGHT */}
      <div style={{ ...glass, borderRadius: "20px", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <h1 style={{ margin: 0, fontSize: "1.7rem", lineHeight: 1, letterSpacing: "-0.04em" }}>
          <span style={{ background: "linear-gradient(135deg, #ffffff 20%, #b9b8ff 45%, #7ee7f8 85%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            Sasha
          </span>
          <span style={{ color: "#eef2ff" }}> Milshtein</span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button style={{ padding: "6px 14px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#b8c0ea", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
          {/* Headshot */}
          <div style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid rgba(139,92,246,0.5)",
            boxShadow: "0 0 0 3px rgba(139,92,246,0.15)",
            flexShrink: 0,
          }}>
            <img src={sashaPhoto} alt="Sasha" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
          </div>
        </div>
      </div>

      {/* Summary — full width */}
      <div style={{ ...glass, borderRadius: "20px", padding: "18px 22px", marginBottom: "14px" }}>
        <p style={{ margin: "0 0 8px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6" }}>Summary</p>
        <p style={{ margin: 0, fontSize: "0.93rem", lineHeight: 1.75, color: "#c8d0f0" }}>
          Marketing & Psychology graduate from USD's Knauss School of Business, with hands-on experience across CRM operations, campaign execution, event coordination, and content strategy. Known for building organized workflows, keeping complex projects on track, and delivering polished work under pressure.
        </p>
      </div>

      {/* Hint of the two-column layout below */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "16px", opacity: 0.35 }}>
        <div style={{ ...glass, borderRadius: "18px", height: "60px" }} />
        <div style={{ ...glass, borderRadius: "18px", height: "60px" }} />
      </div>
    </div>
  );
}
