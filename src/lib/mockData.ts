// Mock data for the BPA redesign demo. Frontend-only; not wired to any backend.
// Today's reference date for the demo: spring 2026. Student is a CS junior at CU Boulder.

export type AppointmentType = "in-person" | "virtual";

export type Advisor = {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  officeLocation: string;
  specialties: string[];
  bio: string;
  officeHoursText: string;
  accent: "gold" | "blue" | "green" | "purple";
};

export type AvailabilitySlot = {
  id: string;
  advisorId: string;
  day: number; // 0 = Sun ... 6 = Sat (weekly recurring)
  startHour: number;
  endHour: number;
  type: AppointmentType;
};

export type AppointmentStatus = "upcoming" | "past" | "cancelled";

export type Appointment = {
  id: string;
  advisorId: string;
  date: string; // ISO yyyy-mm-dd
  startHour: number;
  endHour: number;
  type: AppointmentType;
  topic?: string;
  notes?: string;
  status: AppointmentStatus;
};

export type CourseStatus = "completed" | "in-progress" | "planned";
export type CourseCategory = "core" | "major" | "gened" | "elective";

export type Course = {
  code: string;
  title: string;
  credits: number;
  term: string;
  grade?: string;
  status: CourseStatus;
  category: CourseCategory;
};

export type DegreeRequirement = {
  id: string;
  category: CourseCategory;
  label: string;
  description: string;
  creditsRequired: number;
  creditsCompleted: number;
  creditsInProgress: number;
  courses: Course[];
};

export type Recommendation = {
  id: string;
  course: Course;
  reasonTags: string[];
  reasonText: string;
  fit: "strong" | "good" | "exploratory";
};

export type NotificationKind =
  | "reminder"
  | "alert"
  | "message"
  | "tip"
  | "deadline";

export type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  date: string; // ISO
  actionHref?: string;
  actionLabel?: string;
  read: boolean;
};

export type ThreadMessage = {
  id: string;
  from: "student" | "advisor";
  body: string;
  timestamp: string; // ISO
};

export type Thread = {
  id: string;
  advisorId: string;
  subject: string;
  messages: ThreadMessage[];
  unreadCount: number;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: "academic" | "wellness" | "career" | "financial" | "tutoring";
  href: string;
  icon:
    | "book"
    | "wrench"
    | "target"
    | "globe"
    | "heart"
    | "money"
    | "pencil"
    | "graduation";
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: "advising" | "registration" | "degree" | "general";
};

export type Student = {
  name: string;
  email: string;
  major: string;
  year: "Freshman" | "Sophomore" | "Junior" | "Senior";
  startTerm: string;
  expectedGradTerm: string;
  gpa: number;
  totalCreditsRequired: number;
  totalCreditsCompleted: number;
  totalCreditsInProgress: number;
  advisorId: string;
};

// ---------- Seed data ----------

export const STUDENT: Student = {
  name: "Alex Johnson",
  email: "alex.johnson@colorado.edu",
  major: "Computer Science, BS",
  year: "Junior",
  startTerm: "Fall 2023",
  expectedGradTerm: "Spring 2027",
  gpa: 3.45,
  totalCreditsRequired: 120,
  totalCreditsCompleted: 77,
  totalCreditsInProgress: 15,
  advisorId: "adv-martinez",
};

export const ADVISORS: Advisor[] = [
  {
    id: "adv-martinez",
    name: "Dr. Elena Martinez",
    title: "CS Academic Advisor",
    email: "emartinez@colorado.edu",
    phone: "(303) 492-7514",
    officeLocation: "Engineering Center ECCR 1B70",
    specialties: ["AI / ML track", "Graduate school prep", "Undergrad research"],
    bio:
      "Elena has advised CS undergrads at CU Boulder for nine years. She focuses on helping students build a clear trajectory toward research or industry — and will tell you plainly when a class is a better fit next semester.",
    officeHoursText: "Mon & Wed 10 AM – 12 PM · Tue 2 – 4 PM",
    accent: "gold",
  },
  {
    id: "adv-kim",
    name: "Sarah Kim",
    title: "CS Academic Advisor",
    email: "skim@colorado.edu",
    phone: "(303) 492-7401",
    officeLocation: "Engineering Center ECCR 1B72",
    specialties: ["Transfer credit", "International students", "Systems track"],
    bio:
      "Sarah specializes in untangling transfer credit questions and helping students who arrived at CU mid-way through their degree stay on track to graduate on time.",
    officeHoursText: "Tue & Thu 10 AM – 12 PM",
    accent: "blue",
  },
  {
    id: "adv-johnson",
    name: "Dr. Marcus Johnson",
    title: "CS Academic Advisor",
    email: "mjohnson@colorado.edu",
    phone: "(303) 492-7322",
    officeLocation: "Engineering Center ECCR 1B74",
    specialties: ["Industry prep", "Internships", "Career planning"],
    bio:
      "Marcus spent twelve years at industry labs before joining CU advising. He's the advisor to talk to about internships, resumes, and making the first-job decision.",
    officeHoursText: "Wed & Fri 1 – 4 PM",
    accent: "green",
  },
  {
    id: "adv-general",
    name: "General Advising",
    title: "CU Engineering — drop-in advising",
    email: "advising@colorado.edu",
    officeLocation: "Virtual only",
    specialties: ["Quick questions", "Weekend availability"],
    bio:
      "Virtual drop-in slots on weekends for short questions that don't need your primary advisor. No appointment required within the open window.",
    officeHoursText: "Sat & Sun 12 PM – 5 PM (virtual)",
    accent: "purple",
  },
];

export const AVAILABILITY: AvailabilitySlot[] = [
  // Dr. Martinez
  { id: "slot-1", advisorId: "adv-martinez", day: 1, startHour: 9, endHour: 10, type: "in-person" },
  { id: "slot-2", advisorId: "adv-martinez", day: 1, startHour: 13, endHour: 15, type: "virtual" },
  { id: "slot-3", advisorId: "adv-martinez", day: 3, startHour: 8, endHour: 10, type: "in-person" },
  { id: "slot-4", advisorId: "adv-martinez", day: 4, startHour: 13, endHour: 14, type: "in-person" },
  { id: "slot-5", advisorId: "adv-martinez", day: 5, startHour: 14, endHour: 16, type: "virtual" },
  // Sarah Kim
  { id: "slot-6", advisorId: "adv-kim", day: 2, startHour: 10, endHour: 12, type: "virtual" },
  { id: "slot-7", advisorId: "adv-kim", day: 3, startHour: 11, endHour: 12, type: "virtual" },
  { id: "slot-8", advisorId: "adv-kim", day: 4, startHour: 9, endHour: 11, type: "virtual" },
  // Dr. Johnson
  { id: "slot-9", advisorId: "adv-johnson", day: 2, startHour: 14, endHour: 15, type: "in-person" },
  { id: "slot-10", advisorId: "adv-johnson", day: 3, startHour: 15, endHour: 17, type: "in-person" },
  { id: "slot-11", advisorId: "adv-johnson", day: 5, startHour: 10, endHour: 11, type: "in-person" },
  // General Advising (weekends)
  { id: "slot-12", advisorId: "adv-general", day: 6, startHour: 12, endHour: 17, type: "virtual" },
  { id: "slot-13", advisorId: "adv-general", day: 0, startHour: 12, endHour: 17, type: "virtual" },
];

// One pre-existing appointment so the dashboard has something to show on first load.
// Dates are written relative to Spring 2026 to stay in-range for the demo.
export const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: "appt-seed-1",
    advisorId: "adv-martinez",
    date: "2026-04-22",
    startHour: 13,
    endHour: 14,
    type: "virtual",
    topic: "Fall 2026 registration check-in",
    notes: "Review ML track prerequisites and senior project options.",
    status: "upcoming",
  },
  {
    id: "appt-seed-2",
    advisorId: "adv-kim",
    date: "2026-02-12",
    startHour: 10,
    endHour: 11,
    type: "virtual",
    topic: "Transfer credit from MATH 2400",
    status: "past",
  },
];

// ---------- Courses ----------

const completedCourses: Course[] = [
  // Fall 2023
  { code: "CSCI 1300", title: "Intro to Computer Science 1", credits: 4, term: "Fall 2023", grade: "A", status: "completed", category: "core" },
  { code: "MATH 1300", title: "Calculus 1", credits: 4, term: "Fall 2023", grade: "A-", status: "completed", category: "core" },
  { code: "WRTG 1150", title: "First-Year Writing", credits: 3, term: "Fall 2023", grade: "A", status: "completed", category: "gened" },
  { code: "COEN 1201", title: "Engineering Cornerstone", credits: 1, term: "Fall 2023", grade: "A", status: "completed", category: "elective" },
  { code: "ECON 1000", title: "Intro to Economics", credits: 3, term: "Fall 2023", grade: "B+", status: "completed", category: "gened" },
  // Spring 2024
  { code: "CSCI 2270", title: "Data Structures", credits: 4, term: "Spring 2024", grade: "A", status: "completed", category: "core" },
  { code: "MATH 2300", title: "Calculus 2", credits: 4, term: "Spring 2024", grade: "B", status: "completed", category: "core" },
  { code: "PHYS 1110", title: "General Physics 1", credits: 4, term: "Spring 2024", grade: "A-", status: "completed", category: "core" },
  { code: "HUMN 1022", title: "Literature & Film of Modernism", credits: 3, term: "Spring 2024", grade: "A", status: "completed", category: "gened" },
  // Fall 2024
  { code: "CSCI 2400", title: "Computer Systems", credits: 4, term: "Fall 2024", grade: "A-", status: "completed", category: "core" },
  { code: "CSCI 2824", title: "Discrete Structures", credits: 3, term: "Fall 2024", grade: "A", status: "completed", category: "core" },
  { code: "MATH 2400", title: "Calculus 3", credits: 4, term: "Fall 2024", grade: "B+", status: "completed", category: "core" },
  { code: "CHEM 1113", title: "General Chemistry 1", credits: 5, term: "Fall 2024", grade: "B", status: "completed", category: "gened" },
  // Spring 2025
  { code: "CSCI 3104", title: "Algorithms", credits: 4, term: "Spring 2025", grade: "A", status: "completed", category: "core" },
  { code: "CSCI 3308", title: "Software Development Methods", credits: 3, term: "Spring 2025", grade: "A-", status: "completed", category: "core" },
  { code: "APPM 3310", title: "Matrix Methods", credits: 3, term: "Spring 2025", grade: "A", status: "completed", category: "core" },
  { code: "SOCY 1001", title: "Intro to Sociology", credits: 3, term: "Spring 2025", grade: "A", status: "completed", category: "gened" },
  { code: "PHIL 1000", title: "Intro to Philosophy", credits: 3, term: "Spring 2025", grade: "B+", status: "completed", category: "gened" },
  // Fall 2025
  { code: "CSCI 3656", title: "Numerical Computation", credits: 3, term: "Fall 2025", grade: "A-", status: "completed", category: "core" },
  { code: "CSCI 3753", title: "Operating Systems", credits: 4, term: "Fall 2025", grade: "B+", status: "completed", category: "core" },
  { code: "HIST 1011", title: "World History to 1500", credits: 4, term: "Fall 2025", grade: "A", status: "completed", category: "gened" },
  { code: "ATLS 3000", title: "Technology & Society", credits: 3, term: "Fall 2025", grade: "A", status: "completed", category: "elective" },
  { code: "EBIO 1030", title: "Biology: Environment", credits: 1, term: "Fall 2025", grade: "A", status: "completed", category: "gened" },
];

const inProgressCourses: Course[] = [
  { code: "CSCI 4448", title: "OO Analysis & Design", credits: 3, term: "Spring 2026", status: "in-progress", category: "major" },
  { code: "CSCI 4229", title: "Computer Graphics", credits: 3, term: "Spring 2026", status: "in-progress", category: "major" },
  { code: "CSCI 4830", title: "Special Topics: Applied ML", credits: 3, term: "Spring 2026", status: "in-progress", category: "major" },
  { code: "WRTG 3020", title: "Topics in Writing", credits: 3, term: "Spring 2026", status: "in-progress", category: "gened" },
  { code: "ETHN 2001", title: "Intro to Ethnic Studies", credits: 3, term: "Spring 2026", status: "in-progress", category: "gened" },
];

const plannedCourses: Course[] = [
  { code: "CSCI 4622", title: "Machine Learning", credits: 3, term: "Fall 2026", status: "planned", category: "major" },
  { code: "CSCI 4239", title: "Advanced Computer Graphics", credits: 3, term: "Fall 2026", status: "planned", category: "major" },
];

export const ALL_COURSES: Course[] = [
  ...completedCourses,
  ...inProgressCourses,
  ...plannedCourses,
];

export const REQUIREMENTS: DegreeRequirement[] = [
  {
    id: "req-core",
    category: "core",
    label: "Core CS & Math",
    description: "Foundation courses required of every CS major.",
    creditsRequired: 48,
    creditsCompleted: 48,
    creditsInProgress: 0,
    courses: completedCourses.filter((c) => c.category === "core"),
  },
  {
    id: "req-major",
    category: "major",
    label: "Upper-Division CS Electives",
    description: "3000+ level CS courses that specialize your degree.",
    creditsRequired: 24,
    creditsCompleted: 0,
    creditsInProgress: 9,
    courses: [
      ...inProgressCourses.filter((c) => c.category === "major"),
      ...plannedCourses.filter((c) => c.category === "major"),
    ],
  },
  {
    id: "req-gened",
    category: "gened",
    label: "General Education",
    description: "Writing, humanities, and distribution requirements across Arts & Sciences.",
    creditsRequired: 31,
    creditsCompleted: 25,
    creditsInProgress: 6,
    courses: [
      ...completedCourses.filter((c) => c.category === "gened"),
      ...inProgressCourses.filter((c) => c.category === "gened"),
    ],
  },
  {
    id: "req-elective",
    category: "elective",
    label: "Free Electives",
    description: "Any courses that count toward the 120-credit graduation requirement.",
    creditsRequired: 17,
    creditsCompleted: 4,
    creditsInProgress: 0,
    courses: completedCourses.filter((c) => c.category === "elective"),
  },
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-1",
    course: {
      code: "CSCI 4622",
      title: "Machine Learning",
      credits: 3,
      term: "Fall 2026",
      status: "planned",
      category: "major",
    },
    reasonTags: ["AI / ML track", "Major elective"],
    reasonText:
      "You finished CSCI 3104 (Algorithms) and APPM 3310 with an A — you have every prereq and it fills a major elective.",
    fit: "strong",
  },
  {
    id: "rec-2",
    course: {
      code: "CSCI 4239",
      title: "Advanced Computer Graphics",
      credits: 3,
      term: "Fall 2026",
      status: "planned",
      category: "major",
    },
    reasonTags: ["Continues track", "Major elective"],
    reasonText:
      "Follow-on to CSCI 4229 (Computer Graphics), which you're taking now. Most students pair these two if they want the track.",
    fit: "strong",
  },
  {
    id: "rec-3",
    course: {
      code: "CSCI 4253",
      title: "Data Center Scale Computing",
      credits: 3,
      term: "Fall 2026",
      status: "planned",
      category: "major",
    },
    reasonTags: ["Systems depth", "Industry prep"],
    reasonText:
      "Builds on CSCI 3753 (Operating Systems). Recruiters for SRE / infra roles specifically look for this on transcripts.",
    fit: "good",
  },
  {
    id: "rec-4",
    course: {
      code: "LING 2000",
      title: "Introduction to Linguistics",
      credits: 3,
      term: "Fall 2026",
      status: "planned",
      category: "gened",
    },
    reasonTags: ["Fills Gen-Ed diversity", "Complements NLP interest"],
    reasonText:
      "You still need one more diversity-focused Gen-Ed. Linguistics is a natural bridge if you're curious about NLP later.",
    fit: "good",
  },
  {
    id: "rec-5",
    course: {
      code: "ECON 3080",
      title: "Intermediate Microeconomics",
      credits: 3,
      term: "Fall 2026",
      status: "planned",
      category: "gened",
    },
    reasonTags: ["Fills social science", "Signals breadth"],
    reasonText:
      "Exploratory pick — stretches your social-science breadth without a heavy problem-set load.",
    fit: "exploratory",
  },
];

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    kind: "deadline",
    title: "Fall 2026 registration opens April 30",
    body: "Register early so you don't get shut out of CSCI 4622 — it filled in 3 days last year.",
    date: "2026-04-30",
    actionHref: "/schedule",
    actionLabel: "Meet with advisor first",
    read: false,
  },
  {
    id: "notif-2",
    kind: "tip",
    title: "Meet with your advisor before you register",
    body: "You haven't met with Dr. Martinez this semester. A 30-minute check-in now saves re-registration later.",
    date: "2026-04-19",
    actionHref: "/schedule",
    actionLabel: "Find a time",
    read: false,
  },
  {
    id: "notif-3",
    kind: "message",
    title: "Dr. Martinez replied to your message",
    body: "“Happy to talk through ML electives — let's pin this down before registration opens.”",
    date: "2026-04-18",
    actionHref: "/messages",
    actionLabel: "Open thread",
    read: false,
  },
  {
    id: "notif-4",
    kind: "reminder",
    title: "Your appointment is Wednesday at 1 PM",
    body: "Virtual meeting with Dr. Martinez. The link will appear here 10 minutes before.",
    date: "2026-04-22",
    actionHref: "/schedule",
    actionLabel: "View",
    read: true,
  },
  {
    id: "notif-5",
    kind: "alert",
    title: "Complete your degree audit",
    body: "Last run 4 months ago. Run it again before your registration meeting.",
    date: "2026-04-15",
    actionHref: "/degree",
    actionLabel: "Open degree tracker",
    read: true,
  },
  {
    id: "notif-6",
    kind: "reminder",
    title: "Final exam schedule is posted",
    body: "Your earliest exam is CSCI 4448 on May 4 at 7:30 AM.",
    date: "2026-04-12",
    read: true,
  },
];

export const SEED_THREADS: Thread[] = [
  {
    id: "thread-1",
    advisorId: "adv-martinez",
    subject: "Fall 2026 — ML electives",
    unreadCount: 1,
    messages: [
      {
        id: "msg-1-1",
        from: "student",
        body:
          "Hi Dr. Martinez, I'd like to do both CSCI 4622 and 4239 next semester. Is that reasonable given I'm also taking 4448 right now?",
        timestamp: "2026-04-16T14:22:00",
      },
      {
        id: "msg-1-2",
        from: "advisor",
        body:
          "Short answer: yes, it's doable, but I'd want to make sure you're not also planning a 3000-level math alongside. Want to look at the full plan together?",
        timestamp: "2026-04-17T09:05:00",
      },
      {
        id: "msg-1-3",
        from: "student",
        body: "Yes please. Tuesday afternoon work?",
        timestamp: "2026-04-17T10:11:00",
      },
      {
        id: "msg-1-4",
        from: "advisor",
        body:
          "Happy to talk through ML electives, let's pin this down before registration opens. I have Tuesday 2–4 open.",
        timestamp: "2026-04-18T16:40:00",
      },
    ],
  },
  {
    id: "thread-2",
    advisorId: "adv-kim",
    subject: "Transfer credit question",
    unreadCount: 0,
    messages: [
      {
        id: "msg-2-1",
        from: "student",
        body:
          "Hi Sarah, I took a linear algebra class at a community college last summer. Can it replace APPM 3310?",
        timestamp: "2026-02-10T11:00:00",
      },
      {
        id: "msg-2-2",
        from: "advisor",
        body:
          "Happy to check! Upload the syllabus to the Transfer Credit portal and I'll look at it with the registrar.",
        timestamp: "2026-02-10T15:30:00",
      },
      {
        id: "msg-2-3",
        from: "advisor",
        body:
          "Update: it came back as equivalent. I've marked APPM 3310 satisfied in your audit.",
        timestamp: "2026-02-12T09:10:00",
      },
    ],
  },
  {
    id: "thread-3",
    advisorId: "adv-general",
    subject: "Changing a Gen-Ed",
    unreadCount: 0,
    messages: [
      {
        id: "msg-3-1",
        from: "student",
        body:
          "Quick question, can I swap HIST 1011 for a different history course retroactively?",
        timestamp: "2025-11-02T19:14:00",
      },
      {
        id: "msg-3-2",
        from: "advisor",
        body:
          "Not once it's on your transcript with a letter grade. You can petition, but it's rare for anything to change at this point.",
        timestamp: "2025-11-03T08:22:00",
      },
    ],
  },
];

export const RESOURCES: Resource[] = [
  {
    id: "res-1",
    title: "Degree Audit Tool",
    description: "Official CU audit — check your progress toward the CS BS.",
    category: "academic",
    href: "#",
    icon: "graduation",
  },
  {
    id: "res-2",
    title: "Academic Policies",
    description: "Add/drop deadlines, grade replacement, academic integrity.",
    category: "academic",
    href: "#",
    icon: "book",
  },
  {
    id: "res-3",
    title: "CU Writing Center",
    description: "Free 1-on-1 tutoring on essays, reports, and lab writeups.",
    category: "tutoring",
    href: "#",
    icon: "pencil",
  },
  {
    id: "res-4",
    title: "CLAS Tutoring",
    description: "Drop-in help for calc, physics, chem, and intro CS.",
    category: "tutoring",
    href: "#",
    icon: "wrench",
  },
  {
    id: "res-5",
    title: "CS Peer Advising (CU Cares)",
    description: "Talk through your plan with a senior CS student first.",
    category: "tutoring",
    href: "#",
    icon: "heart",
  },
  {
    id: "res-6",
    title: "Career Services",
    description: "Resume review, mock interviews, and employer events.",
    category: "career",
    href: "#",
    icon: "target",
  },
  {
    id: "res-7",
    title: "Registrar Forms",
    description: "Name change, FERPA, late withdrawal, graduation application.",
    category: "academic",
    href: "#",
    icon: "book",
  },
  {
    id: "res-8",
    title: "Study Abroad",
    description: "CS-friendly programs in Dublin, Singapore, and Copenhagen.",
    category: "academic",
    href: "#",
    icon: "globe",
  },
  {
    id: "res-9",
    title: "Counseling & Psychiatric Services",
    description: "Free short-term counseling. Drop-in hours daily at Wardenburg.",
    category: "wellness",
    href: "#",
    icon: "heart",
  },
  {
    id: "res-10",
    title: "Financial Aid",
    description: "FAFSA, scholarships, emergency grants.",
    category: "financial",
    href: "#",
    icon: "money",
  },
  {
    id: "res-11",
    title: "ScholarshipUniverse",
    description: "CU's scholarship matching portal — 3,400 active awards.",
    category: "financial",
    href: "#",
    icon: "money",
  },
  {
    id: "res-12",
    title: "Transfer Credit Portal",
    description: "Submit syllabi for courses taken outside CU.",
    category: "academic",
    href: "#",
    icon: "wrench",
  },
];

export const FAQS: Faq[] = [
  {
    id: "faq-1",
    question: "How do I change my advisor?",
    answer:
      "Open the Advisors page, pick any advisor, and choose 'Request as my advisor.' The request goes to the College of Engineering advising office and is usually approved within 2 business days.",
    category: "advising",
  },
  {
    id: "faq-2",
    question: "How do I schedule an appointment?",
    answer:
      "Click any available slot on the Schedule page. Confirm the time + appointment type and you're booked. You'll get an email confirmation within a minute.",
    category: "advising",
  },
  {
    id: "faq-3",
    question: "How do I know which classes to take next?",
    answer:
      "Your Degree page shows personalized recommendations based on your major, completed coursework, and stated interests. The Planning Wizard walks you through a semester plan.",
    category: "degree",
  },
  {
    id: "faq-4",
    question: "When does registration open?",
    answer:
      "Fall registration opens in late April (exact date posted on your Dashboard). Spring registration opens in early November.",
    category: "registration",
  },
  {
    id: "faq-5",
    question: "Can I drop a class after the deadline?",
    answer:
      "You can petition for a late drop with documented medical or family reasons. The form is under Resources → Registrar Forms.",
    category: "registration",
  },
  {
    id: "faq-6",
    question: "How do transfer credits work?",
    answer:
      "Upload the course syllabus through the Transfer Credit Portal (Resources). Your advisor reviews it with the registrar; equivalences usually post within 10 business days.",
    category: "degree",
  },
  {
    id: "faq-7",
    question: "Is my advising information private?",
    answer:
      "Yes. Your advisor sees your degree audit and notes from previous meetings. They do not see messages between you and other advisors.",
    category: "general",
  },
  {
    id: "faq-8",
    question: "What if I don't feel supported by my advisor?",
    answer:
      "You can request a different advisor at any time (see FAQ #1). You can also drop in with General Advising on weekends for a second opinion.",
    category: "advising",
  },
];

// ---------- Helpers ----------

export function advisorById(id: string): Advisor | undefined {
  return ADVISORS.find((a) => a.id === id);
}

export function requirementPercent(req: DegreeRequirement): number {
  if (req.creditsRequired === 0) return 0;
  return Math.round(
    ((req.creditsCompleted + req.creditsInProgress) / req.creditsRequired) * 100,
  );
}

export function overallProgress(): number {
  return Math.round(
    ((STUDENT.totalCreditsCompleted + STUDENT.totalCreditsInProgress) /
      STUDENT.totalCreditsRequired) *
      100,
  );
}
