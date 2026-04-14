import { useState, useEffect, useRef, useCallback, CSSProperties } from "react";
import { useResumeData } from "@/hooks/useResumeData";
import { useEditMode } from "@/hooks/useEditMode";
import { EditableText } from "@/components/EditableText";

type FilterType = "all" | "marketing" | "events" | "ops";

interface CardItem {
  id: string;
  title: string;
  org: string;
  dateRange: string;
  location?: string;
  badge: string;
  bullets: { id: string; text: string }[];
}

function CardSection({
  item,
  isEditing,
  defaultOpen,
  forceOpen,
  onUpdateTitle,
  onUpdateOrg,
  onUpdateDate,
  onUpdateLocation,
  onUpdateBadge,
  onUpdateBullet,
  showLocation = true,
}: {
  item: CardItem;
  isEditing: boolean;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  onUpdateTitle: (v: string) => void;
  onUpdateOrg: (v: string) => void;
  onUpdateDate: (v: string) => void;
  onUpdateLocation?: (v: string) => void;
  onUpdateBadge: (v: string) => void;
  onUpdateBullet: (id: string, v: string) => void;
  showLocation?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [hovered, setHovered] = useState(false);

  const bodyVisible = forceOpen || open || isEditing;

  return (
    <article
      style={{
        borderRadius: "22px",
        background: open ? "rgba(255,255,255,0.055)" : hovered ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.03)",
        border: open ? "1px solid rgba(139,92,246,0.3)" : hovered ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        transition: "border-color 180ms ease, background 180ms ease",
      }}
    >
      <div
        onClick={() => { if (!isEditing) setOpen((p) => !p); }}
        onMouseEnter={() => { if (!isEditing) setHovered(true); }}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "18px 20px",
          display: "grid",
          gridTemplateColumns: "1fr auto auto",
          gap: "12px",
          alignItems: "center",
          cursor: isEditing ? "default" : "pointer",
          userSelect: isEditing ? "text" : "none",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 6px", fontSize: "1.08rem", letterSpacing: "-0.02em", color: "#eef2ff" }}>
            <EditableText value={item.title} onChange={onUpdateTitle} isEditing={isEditing} />
            {" — "}
            <EditableText value={item.org} onChange={onUpdateOrg} isEditing={isEditing} />
          </h3>
          <div style={{ color: "#b8c0ea", display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "0.93rem" }}>
            <EditableText value={item.dateRange} onChange={onUpdateDate} isEditing={isEditing} />
            {showLocation && item.location && (
              <>
                <span>•</span>
                <EditableText
                  value={item.location}
                  onChange={onUpdateLocation ?? (() => {})}
                  isEditing={isEditing}
                />
              </>
            )}
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 12px",
            borderRadius: "8px",
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.3)",
            color: "#c4b5fd",
            whiteSpace: "nowrap",
            fontSize: "0.78rem",
            fontWeight: 600,
            flexShrink: 0,
            letterSpacing: "0.02em",
          }}
        >
          <EditableText value={item.badge} onChange={onUpdateBadge} isEditing={isEditing} />
        </div>
        {!isEditing && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              flexShrink: 0,
              transition: "transform 220ms ease",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              color: open ? "#a78bfa" : "#6b7280",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateRows: bodyVisible ? "1fr" : "0fr",
          transition: "grid-template-rows 220ms ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: bodyVisible ? "0 20px 18px" : "0 20px" }}>
            <ul style={{ margin: 0, paddingLeft: "18px", color: "#e7ebff", lineHeight: 1.7 }}>
              {item.bullets.map((b) => (
                <li key={b.id} style={{ marginTop: "8px" }}>
                  <EditableText
                    value={b.text}
                    onChange={(v) => onUpdateBullet(b.id, v)}
                    isEditing={isEditing}
                    multiline
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Resume() {
  const { data, updateField, updateNested } = useResumeData();
  const { isEditing, enterEdit, exitEdit } = useEditMode();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSection, setActiveSection] = useState("experience");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const headerRef = useRef<HTMLElement | null>(null);

  const scrollTo = useCallback((id: string) => {
    const target = sectionRefs.current[id];
    if (!target) return;
    const headerH = headerRef.current?.offsetHeight ?? 70;
    const y = target.getBoundingClientRect().top + window.pageYOffset - headerH - 22;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const navIds = new Set(navItems.map((n) => n.id));
    const sections = Object.entries(sectionRefs.current);
    const handler = () => {
      const trigger = window.scrollY + 180;
      let current = "experience";
      sections.forEach(([id, el]) => {
        if (navIds.has(id) && el && el.offsetTop <= trigger) current = id;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const glass = {
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    background: "rgba(18, 25, 54, 0.76)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  } as CSSProperties;

  const navItems = [
    { id: "experience", label: "Experience" },
    { id: "impact", label: "Highlights" },
    { id: "leadership", label: "Leadership" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        width: "min(calc(100% - 32px), 1200px)",
        margin: "16px auto 60px",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {isEditing && (
        <div
          onClick={exitEdit}
          title="Click to exit edit mode"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 40,
            padding: "10px 18px",
            borderRadius: "999px",
            background: "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(34,211,238,0.82))",
            color: "white",
            fontWeight: 700,
            fontSize: "0.85rem",
            boxShadow: "0 8px 24px rgba(139,92,246,0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "inherit",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", display: "inline-block", flexShrink: 0 }} />
          Editing — click to exit
        </div>
      )}

      {/* Header */}
      <header
        ref={(el) => { headerRef.current = el; }}
        style={{
          ...glass,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          borderRadius: "20px",
          padding: "12px 16px",
          position: "sticky",
          top: "10px",
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0, flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(1.2rem, 2vw, 1.8rem)", lineHeight: 1, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
            <span
              style={{
                background: "linear-gradient(135deg, #ffffff 20%, #b9b8ff 45%, #7ee7f8 85%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              <EditableText
                value={data.name.split(" ")[0] ?? ""}
                onChange={(v) => updateField("name", [v, ...data.name.split(" ").slice(1)].join(" "))}
                isEditing={isEditing}
              />
            </span>
            <span style={{ color: "#eef2ff" }}>
              {" "}
              <EditableText
                value={data.name.split(" ").slice(1).join(" ")}
                onChange={(v) => updateField("name", [data.name.split(" ")[0], v].join(" "))}
                isEditing={isEditing}
              />
            </span>
          </h1>
        </div>

        {!isEditing && (
          <button
            onClick={enterEdit}
            style={{
              padding: "7px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "#b8c0ea",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.05em",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            Edit
          </button>
        )}
      </header>

      {/* Summary */}
      <section
        ref={(el) => { sectionRefs.current["summary"] = el; }}
        id="summary"
        style={{ ...glass, borderRadius: "20px", padding: "20px 22px", marginTop: "16px", scrollMarginTop: "12px" }}
      >
        <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: "0 0 12px" }}>
          Summary
        </h2>
        <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.75, color: "#c8d0f0", fontWeight: 400 }}>
          <EditableText
            value={data.summary}
            onChange={(v) => updateField("summary", v)}
            isEditing={isEditing}
            multiline
          />
        </p>
      </section>

      {/* Body layout */}
      <div
        className="resume-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "24px",
          marginTop: "16px",
          alignItems: "start",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            ...glass,
            position: "sticky",
            top: "86px",
            borderRadius: "28px",
            padding: "18px",
            display: "grid",
            gap: "18px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: "0 0 12px" }}>
              Navigate
            </h2>
            <div style={{ display: "grid", gap: "6px" }}>
              {navItems.map((nav) => {
                const isActive = activeSection === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => scrollTo(nav.id)}
                    style={{
                      appearance: "none",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      color: isActive ? "#c4b5fd" : "#b8c0ea",
                      border: isActive
                        ? "1px solid rgba(139,92,246,0.45)"
                        : "1px solid rgba(255,255,255,0.09)",
                      background: isActive
                        ? "rgba(139,92,246,0.12)"
                        : "rgba(255,255,255,0.03)",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      fontSize: "0.92rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      transition: "all 150ms ease",
                      boxShadow: isActive ? "inset 3px 0 0 rgba(139,92,246,0.7)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                        (e.currentTarget as HTMLElement).style.color = "#eef2ff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
                        (e.currentTarget as HTMLElement).style.color = "#b8c0ea";
                      }
                    }}
                  >
                    {nav.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: "0 0 12px" }}>
              Strengths
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.04)",
                    border: "none",
                    color: "#9aa3c9",
                    fontSize: "0.81rem",
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ display: "grid", gap: "24px" }}>

          {/* Experience */}
          <section
            ref={(el) => { sectionRefs.current["experience"] = el; }}
            id="experience"
            style={{ ...glass, borderRadius: "28px", padding: "22px", scrollMarginTop: "12px" }}
          >
            <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: "0 0 16px" }}>
              Experience
            </h2>
            <div className="filter-row" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {(["all", "marketing", "events", "ops"] as FilterType[]).map((f) => {
                const isActive = activeFilter === f;
                const label = f === "ops" ? "Operations" : f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1);
                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      border: isActive
                        ? "1px solid rgba(139,92,246,0.5)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: isActive
                        ? "rgba(139,92,246,0.18)"
                        : "rgba(255,255,255,0.04)",
                      color: isActive ? "#c4b5fd" : "#9aa3c9",
                      cursor: "pointer",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.87rem",
                      fontFamily: "inherit",
                      transition: "all 150ms ease",
                      letterSpacing: "0.01em",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                        (e.currentTarget as HTMLElement).style.color = "#eef2ff";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                        (e.currentTarget as HTMLElement).style.color = "#9aa3c9";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                      }
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "grid", gap: "14px" }}>
              {data.experience.map((exp, i) => {
                const show = activeFilter === "all" || exp.category.includes(activeFilter);
                if (!show) return null;
                return (
                  <CardSection
                    key={exp.id}
                    defaultOpen={i === 0}
                    forceOpen={activeFilter === "all" || undefined}
                    item={{ ...exp, org: exp.company }}
                    isEditing={isEditing}
                    onUpdateTitle={(v) =>
                      updateNested((p) => ({ ...p, experience: p.experience.map((e) => e.id === exp.id ? { ...e, title: v } : e) }))
                    }
                    onUpdateOrg={(v) =>
                      updateNested((p) => ({ ...p, experience: p.experience.map((e) => e.id === exp.id ? { ...e, company: v } : e) }))
                    }
                    onUpdateDate={(v) =>
                      updateNested((p) => ({ ...p, experience: p.experience.map((e) => e.id === exp.id ? { ...e, dateRange: v } : e) }))
                    }
                    onUpdateLocation={(v) =>
                      updateNested((p) => ({ ...p, experience: p.experience.map((e) => e.id === exp.id ? { ...e, location: v } : e) }))
                    }
                    onUpdateBadge={(v) =>
                      updateNested((p) => ({ ...p, experience: p.experience.map((e) => e.id === exp.id ? { ...e, badge: v } : e) }))
                    }
                    onUpdateBullet={(bId, v) =>
                      updateNested((p) => ({
                        ...p,
                        experience: p.experience.map((e) =>
                          e.id === exp.id
                            ? { ...e, bullets: e.bullets.map((b) => b.id === bId ? { ...b, text: v } : b) }
                            : e
                        ),
                      }))
                    }
                    showLocation
                  />
                );
              })}
            </div>
          </section>

          {/* Highlights */}
          <section
            ref={(el) => { sectionRefs.current["impact"] = el; }}
            id="impact"
            style={{ ...glass, borderRadius: "28px", padding: "22px", scrollMarginTop: "12px" }}
          >
            <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: "0 0 16px" }}>
              Selected Highlights
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }} className="highlights-grid">
              {data.highlights.map((h) => (
                <div
                  key={h.id}
                  style={{
                    padding: "18px",
                    borderRadius: "22px",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    minHeight: "140px",
                  }}
                >
                  <strong style={{ display: "block", fontSize: "1.6rem", letterSpacing: "-0.04em", marginBottom: "8px", color: "#eef2ff", fontWeight: 800 }}>
                    <EditableText
                      value={h.stat}
                      onChange={(v) =>
                        updateNested((p) => ({ ...p, highlights: p.highlights.map((x) => x.id === h.id ? { ...x, stat: v } : x) }))
                      }
                      isEditing={isEditing}
                    />
                  </strong>
                  <p style={{ margin: 0, color: "#b8c0ea", lineHeight: 1.6, fontSize: "0.9rem" }}>
                    <EditableText
                      value={h.description}
                      onChange={(v) =>
                        updateNested((p) => ({ ...p, highlights: p.highlights.map((x) => x.id === h.id ? { ...x, description: v } : x) }))
                      }
                      isEditing={isEditing}
                      multiline
                    />
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Leadership */}
          <section
            ref={(el) => { sectionRefs.current["leadership"] = el; }}
            id="leadership"
            style={{ ...glass, borderRadius: "28px", padding: "22px", scrollMarginTop: "12px" }}
          >
            <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: "0 0 16px" }}>
              Leadership & Engagement
            </h2>
            <div style={{ display: "grid", gap: "14px" }}>
              {data.leadership.map((lead, i) => (
                <CardSection
                  key={lead.id}
                  defaultOpen={i === 0}
                  item={lead}
                  isEditing={isEditing}
                  onUpdateTitle={(v) =>
                    updateNested((p) => ({ ...p, leadership: p.leadership.map((l) => l.id === lead.id ? { ...l, title: v } : l) }))
                  }
                  onUpdateOrg={(v) =>
                    updateNested((p) => ({ ...p, leadership: p.leadership.map((l) => l.id === lead.id ? { ...l, org: v } : l) }))
                  }
                  onUpdateDate={(v) =>
                    updateNested((p) => ({ ...p, leadership: p.leadership.map((l) => l.id === lead.id ? { ...l, dateRange: v } : l) }))
                  }
                  onUpdateBadge={(v) =>
                    updateNested((p) => ({ ...p, leadership: p.leadership.map((l) => l.id === lead.id ? { ...l, badge: v } : l) }))
                  }
                  onUpdateBullet={(bId, v) =>
                    updateNested((p) => ({
                      ...p,
                      leadership: p.leadership.map((l) =>
                        l.id === lead.id
                          ? { ...l, bullets: l.bullets.map((b) => b.id === bId ? { ...b, text: v } : b) }
                          : l
                      ),
                    }))
                  }
                  showLocation={false}
                />
              ))}
            </div>
          </section>

          {/* Education */}
          <section
            ref={(el) => { sectionRefs.current["education"] = el; }}
            id="education"
            style={{ ...glass, borderRadius: "28px", padding: "22px", scrollMarginTop: "12px" }}
          >
            <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: "0 0 16px" }}>
              Education
            </h2>

            {/* Degree card */}
            <div
              style={{
                padding: "20px 22px",
                borderRadius: "18px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                marginBottom: "14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "6px" }}>
                <h3 style={{ margin: 0, fontSize: "1.05rem", color: "#eef2ff", lineHeight: 1.4 }}>
                  <EditableText value={data.educationSchool} onChange={(v) => updateField("educationSchool", v)} isEditing={isEditing} multiline />
                </h3>
                <span style={{ fontSize: "0.78rem", color: "#9aa3c9", padding: "3px 10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", whiteSpace: "nowrap" }}>
                  May 2026
                </span>
              </div>
              <p style={{ margin: "0 0 8px", color: "#c4b5fd", fontSize: "0.9rem", fontWeight: 600 }}>
                <EditableText value={data.educationDegree} onChange={(v) => updateField("educationDegree", v)} isEditing={isEditing} multiline />
              </p>
              <p style={{ margin: 0, color: "#9aa3c9", fontSize: "0.84rem", lineHeight: 1.6 }}>
                <EditableText value={data.educationMeta} onChange={(v) => updateField("educationMeta", v)} isEditing={isEditing} multiline />
              </p>
            </div>

            {/* Coursework + Additional in a two-column row */}
            <div className="edu-sub-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div
                style={{
                  padding: "16px 18px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p style={{ margin: "0 0 10px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280" }}>
                  Relevant Coursework
                </p>
                <ul style={{ margin: 0, paddingLeft: "18px", color: "#c8d0f0", lineHeight: 1.8, fontSize: "0.88rem" }}>
                  {data.courses.map((c) => (
                    <li key={c.id}>
                      <EditableText
                        value={c.name}
                        onChange={(v) => updateNested((p) => ({ ...p, courses: p.courses.map((x) => x.id === c.id ? { ...x, name: v } : x) }))}
                        isEditing={isEditing}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  padding: "16px 18px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p style={{ margin: "0 0 10px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280" }}>
                  Additional
                </p>
                {isEditing ? (
                  <p style={{ margin: 0, color: "#c8d0f0", lineHeight: 1.65, fontSize: "0.88rem" }}>
                    <EditableText value={data.additionalText} onChange={(v) => updateField("additionalText", v)} isEditing={isEditing} multiline />
                  </p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: "18px", color: "#c8d0f0", lineHeight: 1.8, fontSize: "0.88rem" }}>
                    {data.additionalText
                      .split(/\.\s+/)
                      .map((s) => s.replace(/\.$/, "").trim())
                      .filter(Boolean)
                      .map((sentence, i) => (
                        <li key={i}>{sentence}</li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section
            ref={(el) => { sectionRefs.current["contact"] = el; }}
            id="contact"
            style={{ ...glass, borderRadius: "28px", padding: "22px", scrollMarginTop: "12px" }}
          >
            <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: "0 0 16px" }}>
              Contact
            </h2>
            <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
              {(
                [
                  { label: "Email", value: data.email, href: `mailto:${data.email}`, field: "email" as const },
                  { label: "Phone", value: data.phone, href: `tel:+1${data.phone.replace(/\D/g, "")}`, field: "phone" as const },
                  { label: "LinkedIn", value: data.linkedin, href: `https://www.linkedin.com/in/${data.linkedin}`, field: "linkedin" as const },
                ] as const
              ).map(({ label, value, href, field }) => (
                <a
                  key={field}
                  href={isEditing ? undefined : href}
                  target={field === "linkedin" ? "_blank" : undefined}
                  rel={field === "linkedin" ? "noopener noreferrer" : undefined}
                  style={{
                    display: "block",
                    padding: "18px",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "transform 160ms ease, border-color 160ms ease",
                    cursor: isEditing ? "default" : "pointer",
                  }}
                >
                  <div style={{ color: "#aab4e8", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#eef2ff", wordBreak: "break-word" }}>
                    <EditableText
                      value={value}
                      onChange={(v) => updateField(field, v)}
                      isEditing={isEditing}
                    />
                  </div>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
