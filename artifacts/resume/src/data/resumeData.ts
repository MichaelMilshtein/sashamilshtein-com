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
  competencies: { functional: string[]; soft: string[] };
  tools: string[];
  experience: ExperienceItem[];
  leadership: LeadershipItem[];
  highlights: HighlightItem[];
  educationSchool: string;
  educationDegree: string;
  educationMeta: string;
  honorsProgram: string[];
  cambridgeDate: string;
  cambridgeDescription: string;
  certifications: string;
  courses: CourseItem[];
}

export const defaultResumeData: ResumeData = {
  name: "Sasha Milshtein",
  tagline: "Marketing • Events • CRM • Content",
  summary:
    "Marketing graduate with 2 years of hands-on experience in <strong>campaign execution, content strategy, CRM management, and event operations</strong>. Proven ability to increase engagement, support sales initiatives, and manage projects from start to finish. Detail-oriented, reliable, and comfortable working in fast-paced, team-driven environments. Authorized to work in the U.S.",
  email: "sasha.milshtein@gmail.com",
  phone: "925-949-9398",
  linkedin: "alexandra-milshtein",
  location: "San Diego, CA",
  competencies: {
    functional: [
      "CRM Management",
      "Sales Development",
      "Performance Tracking",
      "Market Research & Data Analysis",
      "Event & Program Management",
      "Business Development Support",
      "Content Creation & Strategy",
    ],
    soft: [
      "Clear Communication",
      "Ownership & Accountability",
      "Cross-Functional Collaboration",
      "Leadership & Team Coordination",
      "Adaptability & Learning Agility",
      "Pipeline & Task Prioritization",
      "Problem Solving & Critical Thinking",
    ],
  },
  tools: [
    "Google Suite",
    "MS Office",
    "Slack",
    "Salesforce",
    "Airtable",
    "Apollo",
    "Qualtrics",
    "HubSpot",
    "Tableau",
    "Smartsheet",
  ],
  highlights: [
    {
      id: "h1",
      stat: "15%",
      description: "CRM outreach targeting improvement via Salesforce & Airtable workflow optimization.",
    },
    {
      id: "h2",
      stat: "45+",
      description: "Virtual corporate engagement events managed end-to-end with multi-stakeholder coordination.",
    },
    {
      id: "h3",
      stat: "10/wk",
      description: "Activation quota consistently exceeded as a Corporate Engagement Consultant.",
    },
    {
      id: "h4",
      stat: "50%",
      description: "Engagement lift from targeted social campaigns built on audience segmentation and analytics.",
    },
    {
      id: "h5",
      stat: "100",
      description: "Chapter members coordinated across a 9-month, $5K recruitment campaign — largest new-member class on campus.",
    },
    {
      id: "h6",
      stat: "5★",
      description: "Student feedback earned while mentoring first-year students through academic and social transition at USD.",
    },
    {
      id: "h7",
      stat: "15",
      description: "AMA events planned and executed as VP of Operations, including venue, speakers, and funding.",
    },
    {
      id: "h8",
      stat: "5 hrs/mo",
      description: "Administrative time saved through automated AMA calendar and planning workflows.",
    },
  ],
  experience: [
    {
      id: "e1",
      title: "Corporate Engagement Consultant",
      company: "Per Scholas",
      dateRange: "06/2025 – Present",
      location: "Remote, CA",
      badge: "CRM + Events",
      category: "marketing ops",
      bullets: [
        {
          id: "e1b1",
          text: "Built and optimized Salesforce & Airtable CRM workflows that improved outreach targeting by <strong>15%</strong> and enabled pipeline tracking for corporate partnerships and fundraising campaigns.",
        },
        {
          id: "e1b2",
          text: "Conducted <strong>targeted market and client research</strong>, synthesizing insights into <strong>actionable reports</strong> that supported strategic planning across Sales and Development teams; <strong>consistently exceeded a quota of 10 activations per week</strong>.",
        },
        {
          id: "e1b3",
          text: "Managed logistics and communications for <strong>45+ virtual corporate engagement events</strong>, ensuring attendee readiness and smooth execution across multi-stakeholder team.",
        },
        {
          id: "e1b4",
          text: "As an Events & Business Development Intern, streamlined and updated CRM records; conducted market research, and compiled reports to inform <strong>Sales and Development team decision-making</strong>.",
        },
      ],
    },
    {
      id: "e2",
      title: "Marketing Strategy Associate",
      company: "Sukin Kot LLC",
      dateRange: "07/2024 – 06/2025",
      location: "Walnut Creek, CA",
      badge: "Content + Growth",
      category: "marketing",
      bullets: [
        {
          id: "e2b1",
          text: "Designed targeted social campaigns that <strong>increased engagement 50%</strong> and directly drove a <strong>10% lift in book sales</strong> within four months through audience segmentation and performance analytics.",
        },
        {
          id: "e2b2",
          text: "Led daily end-to-end content creation and campaign management by designing visually compelling posts, writing persuasive captions and analyzing performance metrics with the goal of expanding audience reach.",
        },
      ],
    },
    {
      id: "e3",
      title: "Production Director — Summer Camp",
      company: "Berkeley Playhouse",
      dateRange: "06/2019 – 07/2024",
      location: "Berkeley, CA",
      badge: "Leadership + Live Production",
      category: "events ops",
      bullets: [
        {
          id: "e3b1",
          text: "Led large-scale live productions for <strong>15-30 performers</strong>, managing schedules, teams, and logistics under tight deadlines; promoted twice for reliability, leadership, and program impact.",
        },
        {
          id: "e3b2",
          text: "Demonstrated strong leadership and team building abilities by increasing <strong>student retention</strong> and <strong>participation</strong> in programs <strong>by 12%.</strong> Earned two promotions in two years in recognition of impact to program and <strong>100% parent satisfaction score</strong> based on post-program feedback, resulting in repeat enrollment.",
        },
      ],
    },
  ],
  leadership: [
    {
      id: "l1",
      title: "Vice President of Membership",
      org: "Kappa Alpha Theta — Eta Iota Chapter",
      dateRange: "01/2025 – 01/2026",
      badge: "Campaign Leadership",
      bullets: [
        {
          id: "l1b1",
          text: "Partnered with campus Panhellenic representatives and national organization to coordinate recruitment execution, compliance, and deadlines.",
        },
        {
          id: "l1b2",
          text: "Directed a <strong>9-months</strong> recruitment campaign ($5K budget), coordinating <strong>100 members</strong> and cross-functional event execution, resulting in the <strong>largest</strong> new-member <strong>class</strong> on campus (<strong>50</strong>).",
        },
        {
          id: "l1b3",
          text: "Developed and executed social media strategy and promotional content to communicate sorority's values and recruitment events. <strong>Increased</strong> engagement by <strong>50%,</strong> achieving <strong>10</strong> consecutive <strong>days of trending</strong> content and generating <strong>3K+</strong> views per post during the recruitment period.",
        },
      ],
    },
    {
      id: "l2",
      title: "Vice President of Operations",
      org: "American Marketing Association",
      dateRange: "05/2025 – Present",
      badge: "Operations",
      bullets: [
        {
          id: "l2b1",
          text: "Spearheaded operational <strong>planning and execution</strong> for <strong>15</strong> AMA events, overseeing venue bookings, speaker coordination, catering, and funding approvals; maintained cross-functional alignment through structured communication with executive leadership.",
        },
        {
          id: "l2b2",
          text: "Owned and enhanced <strong>digital infrastructure and workflows</strong>, streamlining onboarding, event planning, and member engagement, while supporting executive board oversight and strategic initiatives.",
        },
        {
          id: "l2b3",
          text: "<strong>Automated</strong> the AMA calendar and planning processes, improving visibility and coordination across teams and generating approximately <strong>5 hours of administrative time savings per month</strong>, enhancing organizational efficiency and member experience.",
        },
      ],
    },
    {
      id: "l3",
      title: "Alcala Club Associate",
      org: "USD Alcala Club",
      dateRange: "04/2023 – Present",
      badge: "Representation",
      bullets: [
        {
          id: "l3b1",
          text: "Acted as a liaison between the president's office and campus visitors, representing USD at <strong>4 events</strong> per semester and providing exceptional guest experiences to VIPs, alumni, and community members.",
        },
        {
          id: "l3b2",
          text: "Supported key events, including fundraising, graduation, and alumni gatherings, ensuring a professional and positive representation of the university.",
        },
      ],
    },
  ],
  educationSchool: "University of San Diego, Knauss School of Business",
  educationDegree:
    "Bachelor of Business Administration, Marketing and Psychology",
  educationMeta:
    "GPA 3.6, Dean's List, USD Alcala Scholarship for excellence in academics and extracurricular activities",
  honorsProgram: [
    "Competitively selected to join program for high-achieving and academically motivated students.",
    "Program requires completion of 24 units of Honors coursework, focused on approaching complex issues from interdisciplinary prospectives and the completion of an original independent scholarship project.",
  ],
  cambridgeDate: "08/2021",
  cambridgeDescription:
    "Completed a selective summer program in Business Management and Economics at Reach Cambridge. Engaged in an intensive curriculum covering core business disciplines (strategy, marketing, finance) and foundational economic concepts (market structures, supply and demand, globalization), with a focus on applying theory to real-world scenarios.",
  certifications:
    "Intermediate Microsoft Excel | Generative AI for Marketing Professionals (AMA)",
  courses: [
    { id: "c1", name: "Marketing Strategy" },
    { id: "c2", name: "Advertising Campaigns" },
    { id: "c3", name: "Public Relations" },
    { id: "c4", name: "Consumer Behavior" },
    { id: "c5", name: "Marketing Research" },
    { id: "c6", name: "Fashion Marketing" },
  ],
};
