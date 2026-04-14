export interface BulletItem {
  id: string;
  text: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  dateRange: string;
  location: string;
  badge: string;
  category: string;
  bullets: BulletItem[];
}

export interface LeadershipItem {
  id: string;
  title: string;
  org: string;
  dateRange: string;
  badge: string;
  bullets: BulletItem[];
}

export interface HighlightItem {
  id: string;
  stat: string;
  description: string;
}

export interface CourseItem {
  id: string;
  name: string;
}

export interface ResumeData {
  name: string;
  tagline: string;
  summary: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  skills: string[];
  experience: ExperienceItem[];
  leadership: LeadershipItem[];
  highlights: HighlightItem[];
  educationSchool: string;
  educationDegree: string;
  educationMeta: string;
  courses: CourseItem[];
  additionalText: string;
}

export const defaultResumeData: ResumeData = {
  name: "Sasha Milshtein",
  tagline: "Marketing • Events • CRM • Content",
  summary:
    "Hello ladies! Marketing & Psychology graduate from USD's Knauss School of Business, with hands-on experience across CRM operations, campaign execution, event coordination, and content strategy. Known for building organized workflows, keeping complex projects on track, and delivering polished work under pressure. Currently contributing as a Corporate Engagement Consultant at Per Scholas while completing her BBA (May 2026).",
  email: "sasha.milshtein@gmail.com",
  phone: "925-949-9398",
  linkedin: "alexandra-milshtein",
  location: "San Diego, CA",
  skills: [
    "Marketing Strategy",
    "Campaign Management",
    "Marketing Analytics",
    "Digital Marketing",
    "Email Marketing",
    "Social Media Marketing",
    "Business Development",
    "Content Marketing",
    "Content Creation",
    "Social Media Management",
    "Social Media Communications",
    "Event Planning",
    "CRM Workflows",
    "Market Research",
    "Presentation Skills",
    "Generative AI for Marketing",
    "Prompt Engineering",
    "Data Management",
    "Salesforce",
    "Airtable",
    "Mailchimp",
    "HubSpot",
    "Google Suite",
    "Tableau",
    "Canva",
    "Apollo",
    "Microsoft Office",
  ],
  highlights: [
    {
      id: "h1",
      stat: "50%",
      description:
        "Increase in engagement from targeted social campaigns shaped by segmentation and performance analysis.",
    },
    {
      id: "h2",
      stat: "100",
      description:
        "Chapter members coordinated during a 9-month recruitment campaign involving cross-functional planning and communication standards.",
    },
    {
      id: "h3",
      stat: "5★",
      description:
        "Student feedback earned while mentoring first-year students through academic and social transition at USD.",
    },
  ],
  experience: [
    {
      id: "e1",
      title: "Corporate Engagement Consultant",
      company: "Per Scholas",
      dateRange: "Jan 2026 – Present",
      location: "Contract",
      badge: "CRM + Partnerships",
      category: "marketing ops",
      bullets: [
        {
          id: "e1b1",
          text: "Built and refined Salesforce and Airtable workflows that improved project visibility, supported team coordination, and helped keep moving priorities, audience lists, and follow-up activities organized across partnership and growth initiatives.",
        },
        {
          id: "e1b2",
          text: "Supported projects from planning through execution by building materials, coordinating timelines, tracking deliverables, and helping keep multiple workstreams on schedule in a fast-moving, detail-oriented environment.",
        },
        {
          id: "e1b3",
          text: "Managed project logistics, stakeholder communications, and execution details across multiple workstreams, helping keep assets and deliverables on schedule and ensuring strong follow-through from planning through final execution.",
        },
      ],
    },
    {
      id: "e2",
      title: "Event and Business Development Intern",
      company: "Per Scholas",
      dateRange: "Jun 2025 – Jan 2026",
      location: "San Diego, CA",
      badge: "Research + CRM",
      category: "marketing ops",
      bullets: [
        {
          id: "e2b1",
          text: "Maintained organized records, conducted research, and prepared reports, decks, and support materials that helped teams stay aligned and support content, client-facing materials, and campaign execution efficiently.",
        },
        {
          id: "e2b2",
          text: "Conducted market research and assembled reports that helped inform team decisions around outreach opportunities and relationship development.",
        },
      ],
    },
    {
      id: "e3",
      title: "Marketing Strategy Associate",
      company: "Sukin Kot LLC",
      dateRange: "Jul 2024 – Jun 2025",
      location: "Freelance",
      badge: "Content + Growth",
      category: "marketing",
      bullets: [
        {
          id: "e3b1",
          text: "Developed social and audience-facing content that increased engagement 50% and contributed to a 10% lift in book sales within four months through strong messaging, performance analysis, and consistent execution.",
        },
        {
          id: "e3b2",
          text: "Supported content and communication execution by writing and editing audience-focused copy, coordinating rollout across channels, performing quality checks, and tracking performance to strengthen engagement and support broader marketing goals.",
        },
      ],
    },
    {
      id: "e4",
      title: "Production Director, Summer Camp",
      company: "Berkeley Playhouse",
      dateRange: "Jun 2021 – Jul 2024",
      location: "Berkeley, CA",
      badge: "Leadership + Live Production",
      category: "events ops",
      bullets: [
        {
          id: "e4b1",
          text: "Led large-scale live productions for 5–15 performers, managing schedules, teams, and moving parts under tight deadlines.",
        },
        {
          id: "e4b2",
          text: "Earned two promotions for reliability, leadership, and the ability to keep programs running smoothly in fast-paced settings.",
        },
        {
          id: "e4b3",
          text: "Built practical experience in team coordination, communication, and execution pressure that translates directly to event and operations work.",
        },
      ],
    },
  ],
  leadership: [
    {
      id: "l1",
      title: "Vice President of Operations",
      org: "American Marketing Association",
      dateRange: "May 2025 – Present",
      badge: "Operations",
      bullets: [
        {
          id: "l1b1",
          text: "Led planning and operational coordination for AMA events, managing timelines, logistics, approvals, meeting agendas, and cross-functional communication to deliver polished experiences and keep projects moving.",
        },
        {
          id: "l1b2",
          text: "Managed shared planning tools and digital resources for onboarding, events, and member communications, helping standardize workflows, improve coordination, and strengthen follow-up across the executive board.",
        },
      ],
    },
    {
      id: "l2",
      title: "Vice President of Membership",
      org: "Kappa Alpha Theta — Eta Iota Chapter",
      dateRange: "Dec 2024 – Present",
      badge: "Campaign Leadership",
      bullets: [
        {
          id: "l2b1",
          text: "Directed a 9-month recruitment campaign with a $5K budget, coordinating 100 members, timelines, communications, and event execution, resulting in the largest new-member class on campus (50).",
        },
        {
          id: "l2b2",
          text: "Partnered with campus Panhellenic representatives and the national organization to coordinate recruitment execution, compliance, and deadlines.",
        },
        {
          id: "l2b3",
          text: "Designed and led recruitment training for one hundred chapter members, setting communication, presentation, and behavioral standards.",
        },
      ],
    },
    {
      id: "l3",
      title: "Alcala Club Associate",
      org: "USD Alcala Club",
      dateRange: "Feb 2023 – Present",
      badge: "Representation",
      bullets: [
        {
          id: "l3b1",
          text: "Acted as a liaison between the president's office and campus visitors, representing USD at events and providing polished, welcoming support to VIPs, alumni, and community members.",
        },
        {
          id: "l3b2",
          text: "Assisted in organizing key campus events, including fundraising, graduation, and alumni gatherings, coordinating logistics and helping ensure a professional, positive student and guest experience.",
        },
      ],
    },
    {
      id: "l4",
      title: "Scholastic Assistant",
      org: "USD Leadership",
      dateRange: "Aug 2023 – May 2024",
      badge: "Mentorship",
      bullets: [
        {
          id: "l4b1",
          text: "Mentored first-year students at USD, helping them navigate academic and social transitions and serving as a liaison between students and faculty advisors. Received 5-star student feedback.",
        },
        {
          id: "l4b2",
          text: "Built strong, supportive relationships with students and helped encourage ongoing campus involvement, with many mentees later choosing to become Scholastic Assistants themselves.",
        },
      ],
    },
  ],
  educationSchool: "University of San Diego — Knauss School of Business",
  educationDegree:
    "Bachelor of Business Administration in Marketing and Psychology",
  educationMeta:
    "Graduating May 2026 · GPA 3.6 · Dean's List · USD Alcala Scholarship · Honors Program",
  courses: [
    { id: "c1", name: "Marketing Strategy" },
    { id: "c2", name: "Advertising Campaigns" },
    { id: "c3", name: "Public Relations" },
    { id: "c4", name: "Consumer Behavior" },
    { id: "c5", name: "Marketing Research" },
    { id: "c6", name: "Fashion Marketing" },
  ],
  additionalText:
    "Summer Business Program student at the University of Cambridge, UK. Lead Volunteer for Ukraine Humanitarian Relief (March–June 2022). Certifications: Microsoft Excel Certification, GenAI for Marketing Professional by AMA, National Honor Society, California Scholarship Federation. Foreign Languages: Russian (fluent).",
};
