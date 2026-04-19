import sashaHeadshot from "@/assets/sasha-headshot.jpeg";
import type { ResumeData } from "@/data/resumeData";
import { TrendingUp, CalendarCheck, Target, BarChart2, Users, Star, ClipboardList, Timer } from "lucide-react";

const c = {
  bg: "transparent",
  text: "#c8d0f0",
  textBright: "#eef2ff",
  label: "#a5b0e6",
  accent: "#c4b5fd",
  muted: "#9aa3c9",
  divider: "rgba(255,255,255,0.08)",
};

function Divider() {
  return (
    <div style={{ borderTop: `1px solid ${c.divider}`, margin: "22px 0" }} />
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{
      margin: "0 0 14px",
      fontSize: "0.72rem",
      textTransform: "uppercase",
      letterSpacing: "0.13em",
      color: c.label,
      fontWeight: 600,
    }}>
      {children}
    </p>
  );
}

export default function MobileResume({ data }: { data: ResumeData }) {
  return (
    <div style={{
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      color: c.text,
      padding: "24px 20px 60px",
      maxWidth: "560px",
      margin: "0 auto",
      lineHeight: 1.6,
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
        <img
          src={sashaHeadshot}
          alt={data.name}
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "center top",
            border: "2px solid rgba(139,92,246,0.45)",
            flexShrink: 0,
          }}
        />
        <div>
          <h1 style={{
            margin: 0,
            fontSize: "1.65rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #ffffff 20%, #b9b8ff 45%, #7ee7f8 85%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}>
            {data.name}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: c.muted, letterSpacing: "0.03em" }}>
            {data.tagline}
          </p>
        </div>
      </div>

      {/* ── Contact ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "6px" }}>
        {[
          { label: data.email, href: `mailto:${data.email}` },
          { label: data.phone },
          { label: `linkedin.com/in/${data.linkedin}`, href: `https://www.linkedin.com/in/${data.linkedin}` },
          { label: data.location },
        ].map(({ label, href }) =>
          href ? (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              style={{ fontSize: "0.82rem", color: c.label, textDecoration: "none" }}>
              {label}
            </a>
          ) : (
            <span key={label} style={{ fontSize: "0.82rem", color: c.muted }}>{label}</span>
          )
        )}
      </div>

      <Divider />

      {/* ── Summary ── */}
      <SectionLabel>Summary</SectionLabel>
      <p style={{ margin: 0, fontSize: "0.88rem", color: c.text, lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: data.summary }}
      />

      <Divider />

      {/* ── Key Numbers ── */}
      <SectionLabel>Key Numbers</SectionLabel>
      {(() => {
        const iconMap: Record<string, JSX.Element> = {
          h1: <TrendingUp size={14} />,
          h2: <CalendarCheck size={14} />,
          h3: <Target size={14} />,
          h4: <BarChart2 size={14} />,
          h5: <Users size={14} />,
          h6: <Star size={14} />,
          h7: <ClipboardList size={14} />,
          h8: <Timer size={14} />,
        };
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {data.highlights.map((h) => (
              <div
                key={h.id}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px",
                  padding: "10px 12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                  <span style={{ color: "rgba(247,144,30,0.65)" }}>{iconMap[h.id]}</span>
                  <span style={{ fontSize: "1rem", fontWeight: 800, color: "#F7901E", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {h.stat}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.72rem", color: c.muted, lineHeight: 1.5 }}>
                  {h.description}
                </p>
              </div>
            ))}
          </div>
        );
      })()}

      <Divider />

      {/* ── Experience ── */}
      <SectionLabel>Experience</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {data.experience.map((exp) => (
          <div key={exp.id}>
            <p style={{ margin: "0 0 1px", fontSize: "0.95rem", fontWeight: 700, color: c.textBright }}>
              {exp.title}
            </p>
            <p style={{ margin: "0 0 2px", fontSize: "0.85rem", color: c.accent, fontWeight: 600 }}>
              {exp.company}
            </p>
            <p style={{ margin: "0 0 8px", fontSize: "0.78rem", color: c.muted }}>
              {exp.dateRange}{exp.location ? ` · ${exp.location}` : ""}
            </p>
            <ul style={{ margin: 0, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "5px" }}>
              {exp.bullets.map((b) => (
                <li key={b.id} style={{ fontSize: "0.84rem", color: c.text, lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: b.text }}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Leadership ── */}
      <SectionLabel>Leadership & Campus</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {data.leadership.map((item) => (
          <div key={item.id}>
            <p style={{ margin: "0 0 1px", fontSize: "0.95rem", fontWeight: 700, color: c.textBright }}>
              {item.title}
            </p>
            <p style={{ margin: "0 0 2px", fontSize: "0.85rem", color: c.accent, fontWeight: 600 }}>
              {item.org}
            </p>
            <p style={{ margin: "0 0 8px", fontSize: "0.78rem", color: c.muted }}>
              {item.dateRange}
            </p>
            <ul style={{ margin: 0, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "5px" }}>
              {item.bullets.map((b) => (
                <li key={b.id} style={{ fontSize: "0.84rem", color: c.text, lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: b.text }}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Education ── */}
      <SectionLabel>Education &amp; Certifications</SectionLabel>

      <p style={{ margin: "0 0 1px", fontSize: "0.95rem", fontWeight: 700, color: c.textBright }}>
        {data.educationSchool}
      </p>
      <p style={{ margin: "0 0 1px", fontSize: "0.82rem", color: c.muted }}>Graduating May 2026</p>
      <p style={{ margin: "0 0 2px", fontSize: "0.84rem", color: c.text }}>
        {data.educationDegree}
      </p>
      <p style={{ margin: "0 0 10px", fontSize: "0.82rem", color: c.muted, lineHeight: 1.6 }}>
        {data.educationMeta}
      </p>
      <p style={{ margin: "0 0 6px", fontSize: "0.84rem", fontWeight: 700, color: c.textBright }}>
        Honors Program
      </p>
      <ul style={{ margin: "0 0 20px", paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "5px" }}>
        {data.honorsProgram.map((b, i) => (
          <li key={i} style={{ fontSize: "0.84rem", color: c.text, lineHeight: 1.6 }}>{b}</li>
        ))}
      </ul>

      <p style={{ margin: "0 0 1px", fontSize: "0.95rem", fontWeight: 700, color: c.textBright }}>
        University of Cambridge (UK)
      </p>
      <p style={{ margin: "0 0 8px", fontSize: "0.82rem", color: c.muted }}>{data.cambridgeDate}</p>
      <p style={{ margin: "0 0 20px", fontSize: "0.84rem", color: c.text, lineHeight: 1.6 }}>
        {data.cambridgeDescription}
      </p>

      <p style={{ margin: "0 0 4px", fontSize: "0.95rem", fontWeight: 700, color: c.textBright }}>
        Certifications
      </p>
      <p style={{ margin: 0, fontSize: "0.84rem", color: c.text }}>{data.certifications}</p>

      <Divider />

      {/* ── Core Competencies ── */}
      <SectionLabel>Core Competencies</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
        <div>
          <p style={{ margin: "0 0 6px", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#7b86b8", fontWeight: 600 }}>Functional</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {data.competencies.functional.map((item, i) => (
              <span
                key={i}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  background: "rgba(165,176,230,0.08)",
                  border: "1px solid rgba(165,176,230,0.18)",
                  color: "#9aa3c9",
                  fontSize: "0.81rem",
                  fontWeight: 400,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p style={{ margin: "0 0 6px", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8fb8a8", fontWeight: 600 }}>Soft Skills</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {data.competencies.soft.map((item, i) => (
              <span
                key={i}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  background: "rgba(143,184,168,0.08)",
                  border: "1px solid rgba(143,184,168,0.18)",
                  color: "#96bfac",
                  fontSize: "0.81rem",
                  fontWeight: 400,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tools & Platforms ── */}
      <SectionLabel>Tools &amp; Platforms</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
        {data.tools.map((tool, i) => (
          <span
            key={i}
            style={{
              padding: "5px 10px",
              borderRadius: "6px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: c.muted,
              fontSize: "0.81rem",
              fontWeight: 400,
            }}
          >
            {tool}
          </span>
        ))}
      </div>

    </div>
  );
}
