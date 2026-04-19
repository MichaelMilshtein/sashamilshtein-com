import { useState, useEffect, useRef, useCallback, CSSProperties, ReactNode, ReactElement } from "react";
import { useResumeData } from "@/hooks/useResumeData";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileResume from "@/pages/MobileResume";
import sashaHeadshot from "@/assets/sasha-headshot.jpeg";
import { Mail, Phone, Linkedin, ChevronsUpDown, ChevronsDownUp, TrendingUp, CalendarCheck, Target, BarChart2, Users, Star, ClipboardList, Timer, Sparkles, ChevronDown, Settings } from "lucide-react";


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
  defaultOpen,
  showLocation = true,
  open: controlledOpen,
  onToggle,
}: {
  item: CardItem;
  defaultOpen?: boolean;
  showLocation?: boolean;
  open?: boolean;
  onToggle?: () => void;
}) {
  const [internalOpen, setInternalOpen] = useState(!!defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const toggle = isControlled ? (onToggle ?? (() => {})) : () => setInternalOpen((p) => !p);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      style={{
        background: open
          ? "rgba(255,255,255,0.04)"
          : hovered
            ? "rgba(255,255,255,0.025)"
            : "transparent",
        overflow: "hidden",
        transition: "border-color 180ms ease, background 180ms ease",
      }}
    >
      <div
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "18px 20px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "12px",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: "1.08rem",
              letterSpacing: "-0.02em",
              color: "#eef2ff",
            }}
          >
            {item.title} — {item.org}
          </h3>
          <div
            style={{
              color: "#b8c0ea",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              fontSize: "0.93rem",
            }}
          >
            {item.dateRange}
            {showLocation && item.location && (
              <>
                <span>•</span>
                {item.location}
              </>
            )}
          </div>
        </div>
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
            <path
              d="M4 2L8 6L4 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 220ms ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: open ? "0 20px 18px" : "0 20px" }}>
            <ul
              style={{
                margin: 0,
                paddingLeft: "18px",
                color: "#e7ebff",
                lineHeight: 1.7,
              }}
            >
              {item.bullets.map((b) => (
                <li key={b.id} style={{ marginTop: "8px" }}
                  dangerouslySetInnerHTML={{ __html: b.text }}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

function EduCard({
  title,
  date,
  defaultOpen,
  children,
  open: controlledOpen,
  onToggle,
}: {
  title: string;
  date?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  open?: boolean;
  onToggle?: () => void;
}) {
  const [internalOpen, setInternalOpen] = useState(!!defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const toggle = isControlled ? (onToggle ?? (() => {})) : () => setInternalOpen((p) => !p);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      style={{
        background: open
          ? "rgba(255,255,255,0.04)"
          : hovered
            ? "rgba(255,255,255,0.025)"
            : "transparent",
        overflow: "hidden",
        transition: "background 180ms ease",
      }}
    >
      <div
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "18px 20px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "12px",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: "1.08rem",
              letterSpacing: "-0.02em",
              color: "#eef2ff",
            }}
          >
            {title}
          </h3>
          {date && (
            <div style={{ color: "#b8c0ea", fontSize: "0.93rem" }}>
              {date}
            </div>
          )}
        </div>
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
            <path
              d="M4 2L8 6L4 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 220ms ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: open ? "0 20px 18px" : "0 20px" }}>
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Resume() {
  const { data } = useResumeData();
  const isMobile = useIsMobile();

  const [activeSection, setActiveSection] = useState("summary");

  const expCount = data.experience.length;
  const leadCount = data.leadership.length;
  const EDU_COUNT = 3;

  const [expOpen, setExpOpen] = useState<boolean[]>(() =>
    Array.from({ length: expCount }, (_, i) => i === 0)
  );
  const [leadOpen, setLeadOpen] = useState<boolean[]>(() =>
    Array.from({ length: leadCount }, (_, i) => i === 0)
  );
  const [eduOpen, setEduOpen] = useState<boolean[]>([true, false, false]);
  const [highlightsOpen, setHighlightsOpen] = useState(true);

  const allOpen = (states: boolean[]) => states.every(Boolean);

  const smartToggle = (states: boolean[], setter: (s: boolean[]) => void) => {
    const next = !allOpen(states);
    setter(states.map(() => next));
  };

  const expandSection = (id: string) => {
    if (id === "highlights") setHighlightsOpen(true);
    else if (id === "experience") setExpOpen(Array(expCount).fill(true));
    else if (id === "leadership") setLeadOpen(Array(leadCount).fill(true));
    else if (id === "education") setEduOpen(Array(EDU_COUNT).fill(true));
  };

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const headerRef = useRef<HTMLElement | null>(null);
  const navItems = [
    { id: "summary", label: "Summary" },
    { id: "highlights", label: "Key Numbers" },
    { id: "experience", label: "Work Experience" },
    { id: "leadership", label: "Leadership" },
    { id: "education", label: "Education" },
  ];

  const scrollTo = useCallback((id: string) => {
    const target = sectionRefs.current[id];
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const navIds = new Set(navItems.map((n) => n.id));
    const ACTIVE_THRESHOLD = 160;
    const handler = () => {
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 50;
      if (atBottom) {
        setActiveSection(navItems[navItems.length - 1].id);
        return;
      }
      const sections = Object.entries(sectionRefs.current);
      let current = navItems[0].id;
      sections.forEach(([id, el]) => {
        if (navIds.has(id) && el) {
          const top = el.getBoundingClientRect().top;
          if (top <= ACTIVE_THRESHOLD) current = id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (isMobile) {
    return <MobileResume data={data} />;
  }

  const glass = {
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    background: "rgba(18, 25, 54, 0.76)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  } as CSSProperties;

  const contactPill: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "30px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#b8c0ea",
    textDecoration: "none",
    flexShrink: 0,
    transition: "background 150ms ease, border-color 150ms ease",
  };

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        width: "min(calc(100% - 32px), 1200px)",
        margin: "16px auto 0",
        paddingBottom: "100vh",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header
        ref={(el) => { headerRef.current = el; }}
        className="resume-header"
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            minWidth: 0,
            flex: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid rgba(139,92,246,0.5)",
              flexShrink: 0,
            }}
          >
            <img
              src={sashaHeadshot}
              alt="Sasha Milshtein"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(1.05rem, 2vw, 1.65rem)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 20%, #b9b8ff 45%, #7ee7f8 85%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {data.name.split(" ")[0]}
              </span>
              <span style={{ color: "#eef2ff" }}>
                {" "}{data.name.split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <p style={{
              margin: 0,
              fontSize: "clamp(0.62rem, 1vw, 0.75rem)",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "#F7901E",
              whiteSpace: "nowrap",
            }}>
              Marketing &amp; Communications&nbsp;&nbsp;|&nbsp;&nbsp;Public Relations&nbsp;&nbsp;|&nbsp;&nbsp;Event Operations
            </p>
          </div>
        </div>

        {/* Contact icon pills */}
        <div
          className="contact-pills"
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <a
            href={`mailto:${data.email}`}
            style={{ ...contactPill, padding: "0 10px", gap: "7px" }}
            title={data.email}
          >
            <Mail size={13} />
            <span style={{ fontSize: "0.78rem", fontWeight: 500 }}>{data.email}</span>
          </a>
          <span
            style={{ ...contactPill, padding: "0 10px", gap: "7px" }}
            title={data.phone}
          >
            <Phone size={13} />
            <span style={{ fontSize: "0.78rem", fontWeight: 500 }}>{data.phone}</span>
          </span>
          <a
            href={`https://www.linkedin.com/in/${data.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...contactPill, padding: "0 10px" }}
            title={`linkedin.com/in/${data.linkedin}`}
          >
            <Linkedin size={13} />
          </a>
        </div>
      </header>

      {/* Horizontal sticky nav bar */}
      <nav
        className="resume-nav"
        style={{
          ...glass,
          position: "sticky",
          top: "88px",
          zIndex: 29,
          borderRadius: "16px",
          padding: "8px 12px",
          marginTop: "8px",
          display: "flex",
          gap: "6px",
          overflowX: "auto",
        }}
      >
        {navItems.map((nav) => {
          const isActive = activeSection === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => {
                expandSection(nav.id);
                requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(nav.id)));
              }}
              style={{
                appearance: "none",
                padding: "7px 16px",
                borderRadius: "10px",
                color: isActive ? "#c4b5fd" : "#b8c0ea",
                border: isActive
                  ? "1px solid rgba(139,92,246,0.45)"
                  : "1px solid transparent",
                background: isActive ? "rgba(139,92,246,0.15)" : "transparent",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
                transition: "all 150ms ease",
              }}
            >
              {nav.label}
            </button>
          );
        })}
      </nav>

      {/* Summary */}
      <section
        ref={(el) => { sectionRefs.current["summary"] = el; }}
        id="summary"
        style={{
          ...glass,
          borderRadius: "20px",
          padding: "20px 22px",
          marginTop: "16px",
          scrollMarginTop: "150px",
        }}
      >
        <h2
          style={{
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#a5b0e6",
            margin: "0 0 12px",
          }}
        >
          Summary
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.95rem",
            lineHeight: 1.75,
            color: "#c8d0f0",
            fontWeight: 400,
          }}
          dangerouslySetInnerHTML={{ __html: data.summary }}
        />
      </section>

      {/* Key Numbers — full width, collapsible */}
      {(() => {
        const iconMap: Record<string, ReactElement> = {
          h1: <TrendingUp size={15} />,
          h2: <CalendarCheck size={15} />,
          h3: <Target size={15} />,
          h4: <BarChart2 size={15} />,
          h5: <Users size={15} />,
          h6: <Star size={15} />,
          h7: <ClipboardList size={15} />,
          h8: <Timer size={15} />,
        };
        return (
          <div
            ref={(el) => { sectionRefs.current["highlights"] = el; }}
            id="highlights"
            style={{
              ...glass,
              borderRadius: "20px",
              marginTop: "12px",
              overflow: "hidden",
              scrollMarginTop: "150px",
            }}
          >
            {/* Header row */}
            <button
              onClick={() => setHighlightsOpen((p) => !p)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                color: "#a5b0e6",
                fontFamily: "inherit",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
                <Sparkles size={13} style={{ color: "#F7901E" }} />
                Key Numbers
              </span>
              <ChevronDown
                size={15}
                style={{ transition: "transform 220ms ease", transform: highlightsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Cards grid — animated */}
            <div style={{ display: "grid", gridTemplateRows: highlightsOpen ? "1fr" : "0fr", transition: "grid-template-rows 250ms ease" }}>
              <div style={{ overflow: "hidden" }}>
                <div style={{ padding: "0 14px 14px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {data.highlights.map((h) => (
                    <div
                      key={h.id}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      {/* Stat + icon */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", flexShrink: 0 }}>
                        <span style={{ color: "rgba(247,144,30,0.6)" }}>{iconMap[h.id]}</span>
                        <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#F7901E", letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>
                          {h.stat}
                        </span>
                      </div>
                      {/* Divider */}
                      <div style={{ width: "1px", alignSelf: "stretch", background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />
                      {/* Description */}
                      <p style={{ margin: 0, fontSize: "0.72rem", color: "#9aa3c9", lineHeight: 1.5 }}>
                        {h.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
            top: "150px",
            borderRadius: "28px",
            padding: "18px",
            display: "grid",
            gap: "22px",
          }}
        >
          {/* Core Competencies */}
          <div>
            <h2
              style={{
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#a5b0e6",
                margin: "0 0 12px",
              }}
            >
              Core Competencies
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <p style={{ margin: "0 0 6px", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#7b86b8", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}><Settings size={11} strokeWidth={2} style={{ flexShrink: 0 }} />Functional</p>
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
                        letterSpacing: "0.01em",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ margin: "0 0 6px", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8fb8a8", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}><Star size={11} strokeWidth={2} style={{ flexShrink: 0 }} />Soft Skills</p>
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
                        letterSpacing: "0.01em",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tools & Platforms */}
          <div>
            <h2
              style={{
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#a5b0e6",
                margin: "0 0 12px",
              }}
            >
              Tools &amp; Platforms
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {data.tools.map((tool, i) => (
                <span
                  key={i}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#9aa3c9",
                    fontSize: "0.81rem",
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Coursework */}
          <div>
            <h2
              style={{
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#a5b0e6",
                margin: "0 0 12px",
              }}
            >
              {data.courses.length > 5 ? "Coursework" : "Relevant Coursework"}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {data.courses.map((course) => (
                <span
                  key={course.id}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#9aa3c9",
                    fontSize: "0.81rem",
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                  }}
                >
                  {course.name}
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: 0 }}>
                Work Experience
              </h2>
              <button
                onClick={() => smartToggle(expOpen, setExpOpen)}
                title={allOpen(expOpen) ? "Collapse all" : "Expand all"}
                style={{ background: "none", border: "none", cursor: "pointer", color: allOpen(expOpen) ? "#a78bfa" : "#6b7280", padding: "4px 24px 4px 4px", display: "flex", alignItems: "center", transition: "color 150ms ease" }}
              >
                {allOpen(expOpen) ? <ChevronsDownUp size={16} /> : <ChevronsUpDown size={16} />}
              </button>
            </div>
            <div style={{ display: "grid", gap: "14px" }}>
              {data.experience.map((exp, i) => (
                <CardSection
                  key={exp.id}
                  item={{ ...exp, org: exp.company }}
                  showLocation
                  open={expOpen[i]}
                  onToggle={() => setExpOpen((prev) => prev.map((v, j) => j === i ? !v : v))}
                />
              ))}
            </div>
          </section>

          {/* Leadership */}
          <section
            ref={(el) => { sectionRefs.current["leadership"] = el; }}
            id="leadership"
            style={{ ...glass, borderRadius: "28px", padding: "22px", scrollMarginTop: "12px" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: 0 }}>
                Leadership &amp; Engagement
              </h2>
              <button
                onClick={() => smartToggle(leadOpen, setLeadOpen)}
                title={allOpen(leadOpen) ? "Collapse all" : "Expand all"}
                style={{ background: "none", border: "none", cursor: "pointer", color: allOpen(leadOpen) ? "#a78bfa" : "#6b7280", padding: "4px 24px 4px 4px", display: "flex", alignItems: "center", transition: "color 150ms ease" }}
              >
                {allOpen(leadOpen) ? <ChevronsDownUp size={16} /> : <ChevronsUpDown size={16} />}
              </button>
            </div>
            <div style={{ display: "grid", gap: "14px" }}>
              {data.leadership.map((lead, i) => (
                <CardSection
                  key={lead.id}
                  item={lead}
                  showLocation={false}
                  open={leadOpen[i]}
                  onToggle={() => setLeadOpen((prev) => prev.map((v, j) => j === i ? !v : v))}
                />
              ))}
            </div>
          </section>

          {/* Education */}
          <section
            ref={(el) => { sectionRefs.current["education"] = el; }}
            id="education"
            style={{
              ...glass,
              borderRadius: "28px",
              padding: "22px",
              scrollMarginTop: "150px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b0e6", margin: 0 }}>
                Education &amp; Certifications
              </h2>
              <button
                onClick={() => smartToggle(eduOpen, setEduOpen)}
                title={allOpen(eduOpen) ? "Collapse all" : "Expand all"}
                style={{ background: "none", border: "none", cursor: "pointer", color: allOpen(eduOpen) ? "#a78bfa" : "#6b7280", padding: "4px 24px 4px 4px", display: "flex", alignItems: "center", transition: "color 150ms ease" }}
              >
                {allOpen(eduOpen) ? <ChevronsDownUp size={16} /> : <ChevronsUpDown size={16} />}
              </button>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>

              <EduCard
                title={data.educationSchool}
                date="Graduating May 2026"
                open={eduOpen[0]}
                onToggle={() => setEduOpen((p) => p.map((v, j) => j === 0 ? !v : v))}
              >
                <div style={{ color: "#b8c0ea", fontSize: "0.93rem", marginBottom: "2px" }}>
                  {data.educationDegree}
                </div>
                <div style={{ color: "#9aa3c9", fontSize: "0.84rem", lineHeight: 1.6, marginBottom: "14px" }}>
                  {data.educationMeta}
                </div>
                <p style={{ margin: "0 0 8px", fontSize: "0.88rem", fontWeight: 700, color: "#eef2ff" }}>
                  Honors Program
                </p>
                <ul style={{ margin: 0, paddingLeft: "18px", color: "#e7ebff", lineHeight: 1.7 }}>
                  {data.honorsProgram.map((b, i) => (
                    <li key={i} style={{ marginTop: "8px" }}>{b}</li>
                  ))}
                </ul>
              </EduCard>

              <EduCard
                title="University of Cambridge (UK)"
                date={data.cambridgeDate}
                open={eduOpen[1]}
                onToggle={() => setEduOpen((p) => p.map((v, j) => j === 1 ? !v : v))}
              >
                <p style={{ margin: 0, color: "#e7ebff", lineHeight: 1.7 }}>
                  {data.cambridgeDescription}
                </p>
              </EduCard>

              <EduCard
                title="Certifications"
                open={eduOpen[2]}
                onToggle={() => setEduOpen((p) => p.map((v, j) => j === 2 ? !v : v))}
              >
                <p style={{ margin: 0, color: "#e7ebff", lineHeight: 1.7 }}>
                  {data.certifications}
                </p>
              </EduCard>

            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
