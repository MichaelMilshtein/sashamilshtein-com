import { useState, useEffect, useRef, useCallback } from "react";
import { useResumeData } from "@/hooks/useResumeData";
import { useEditMode } from "@/hooks/useEditMode";
import { EditableText } from "@/components/EditableText";
import { PasswordModal } from "@/components/PasswordModal";

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
  onUpdateTitle: (v: string) => void;
  onUpdateOrg: (v: string) => void;
  onUpdateDate: (v: string) => void;
  onUpdateLocation?: (v: string) => void;
  onUpdateBadge: (v: string) => void;
  onUpdateBullet: (id: string, v: string) => void;
  showLocation?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  const bodyVisible = open || isEditing;

  return (
    <article
      style={{
        borderRadius: "22px",
        background: open ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.04)",
        border: open ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        transition: "border-color 180ms ease, background 180ms ease",
      }}
    >
      <div
        onClick={() => { if (!isEditing) setOpen((p) => !p); }}
        style={{
          padding: "18px 20px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "12px",
          alignItems: "start",
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
            padding: "8px 12px",
            borderRadius: "999px",
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.25)",
            color: "#ddd3ff",
            whiteSpace: "nowrap",
            fontSize: "0.82rem",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          <EditableText value={item.badge} onChange={onUpdateBadge} isEditing={isEditing} />
        </div>
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
  const { isEditing, showPrompt, passwordError, tryEnterEdit, exitEdit, openPrompt, closePrompt } = useEditMode();

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
    const sections = Object.entries(sectionRefs.current);
    const handler = () => {
      const trigger = window.scrollY + 180;
      let current = "experience";
      sections.forEach(([id, el]) => {
        if (el && el.offsetTop <= trigger) current = id;
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
  } as React.CSSProperties;

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
      {showPrompt && (
        <PasswordModal onSubmit={tryEnterEdit} onClose={closePrompt} hasError={passwordError} />
      )}

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
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 10px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#b8c0ea",
              fontSize: "12px",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            <EditableText
              value={data.tagline}
              onChange={(v) => updateField("tagline", v)}
              isEditing={isEditing}
            />
          </div>
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
            onClick={openPrompt}
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
            <div style={{ display: "grid", gap: "8px" }}>
              {navItems.map((nav) => (
                <button
                  key={nav.id}
                  onClick={() => scrollTo(nav.id)}
                  style={{
                    appearance: "none",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    color: activeSection === nav.id ? "#eef2ff" : "#b8c0ea",
                    border: activeSection === nav.id ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
                    background: activeSection === nav.id ? "rgba(255,255,255,0.06)" : "transparent",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    fontSize: "0.95rem",
                    transform: activeSection === nav.id ? "translateX(2px)" : "none",
                    transition: "all 150ms ease",
                  }}
                >
                  {nav.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: "0 0 12px" }}>
              Strengths
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#dde5ff",
                    fontSize: "0.84rem",
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
              {(["all", "marketing", "events", "ops"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "999px",
                    border: activeFilter === f ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(255,255,255,0.08)",
                    background: activeFilter === f ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
                    color: activeFilter === f ? "#eef2ff" : "#b8c0ea",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                    transition: "all 150ms ease",
                  }}
                >
                  {f === "ops" ? "Operations" : f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gap: "14px" }}>
              {data.experience.map((exp, i) => {
                const show = activeFilter === "all" || exp.category.includes(activeFilter);
                if (!show) return null;
                return (
                  <CardSection
                    key={exp.id}
                    defaultOpen={i === 0}
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
            <div className="edu-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px" }}>
              <div
                style={{
                  padding: "20px",
                  borderRadius: "22px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h3 style={{ margin: "0 0 8px", fontSize: "1.05rem", color: "#eef2ff" }}>
                  <EditableText
                    value={data.educationSchool}
                    onChange={(v) => updateField("educationSchool", v)}
                    isEditing={isEditing}
                    multiline
                  />
                </h3>
                <p style={{ margin: "0 0 6px", color: "#b8c0ea", lineHeight: 1.6, fontSize: "0.92rem", fontWeight: 600 }}>
                  <EditableText
                    value={data.educationDegree}
                    onChange={(v) => updateField("educationDegree", v)}
                    isEditing={isEditing}
                    multiline
                  />
                </p>
                <p style={{ margin: "0 0 14px", color: "#b8c0ea", lineHeight: 1.65, fontSize: "0.88rem" }}>
                  <EditableText
                    value={data.educationMeta}
                    onChange={(v) => updateField("educationMeta", v)}
                    isEditing={isEditing}
                    multiline
                  />
                </p>
                <div style={{ display: "grid", gap: "10px" }}>
                  {data.courses.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "14px",
                        padding: "12px 14px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "#ebefff",
                        fontSize: "0.9rem",
                      }}
                    >
                      <EditableText
                        value={c.name}
                        onChange={(v) =>
                          updateNested((p) => ({ ...p, courses: p.courses.map((x) => x.id === c.id ? { ...x, name: v } : x) }))
                        }
                        isEditing={isEditing}
                      />
                      <span style={{ color: "#b8c0ea", whiteSpace: "nowrap" }}>
                        <EditableText
                          value={c.grade}
                          onChange={(v) =>
                            updateNested((p) => ({ ...p, courses: p.courses.map((x) => x.id === c.id ? { ...x, grade: v } : x) }))
                          }
                          isEditing={isEditing}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: "20px",
                  borderRadius: "22px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h3 style={{ margin: "0 0 8px", fontSize: "1.05rem", color: "#eef2ff" }}>Additional</h3>
                <p style={{ margin: 0, color: "#b8c0ea", lineHeight: 1.65, fontSize: "0.9rem" }}>
                  <EditableText
                    value={data.additionalText}
                    onChange={(v) => updateField("additionalText", v)}
                    isEditing={isEditing}
                    multiline
                  />
                </p>
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
