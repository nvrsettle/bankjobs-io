# BankJobs.io — Data Schemas

Complete reference for all data structures used in the project.

---

## 1. Client State (`STATE`)

Persisted to `localStorage`. Three keys: `bj_user`, `bj_apps`, `bj_saved`.

```js
STATE = {
  user:         User | null,        // null = logged out
  applications: Application[],      // submitted job applications
  saved:        string[],           // array of job IDs (e.g. ["j1","b3"])
}
```

---

## 2. User

Stored at `localStorage.bj_user`.

```ts
User = {
  name:            string,   // e.g. "Ankit"
  contact:         string,   // mobile "+91 9876543210" or email "ankit@gmail.com"
  profileComplete: number,   // 0–100, percentage
}
```

---

## 3. Application

One entry per job application. Stored in `localStorage.bj_apps` as an array.

```ts
Application = {
  jobId:  string,            // references Job.id
  when:   string,            // ISO 8601 date string
  data:   ApplicationData,
}

ApplicationData = {
  // Step 1 — Personal
  name:   string,
  email:  string,
  phone:  string,
  city:   string,

  // Step 2 — Education
  qual:   string,            // highest qualification
  univ:   string,
  yop:    string,            // year of passing
  agg:    string,            // aggregate %

  // Step 3 — Experience
  texp:   string,            // total experience
  ccomp:  string,            // current company
  fit:    string,            // why are you a fit (free text)
}
```

---

## 4. Job

The main content unit. All jobs live in the `JOBS` constant array.

```ts
Job = {
  // — Identity —
  id:              string,           // e.g. "j1", "b4"
  title:           string,           // e.g. "Relationship Manager"
  company:         string,           // e.g. "ICICI Bank"
  location:        string,           // e.g. "Mumbai, Maharashtra"
  category:        "bank" | "bfsi",

  // — Display —
  exp:             string,           // e.g. "0-2 Yrs"
  salary:          string,           // e.g. "₹4.5 - 6.5 LPA"
  type:            "Full Time" | "Part Time" | "Contract",
  posted:          string,           // e.g. "1d ago", "1w ago"
  tag?:            "New" | "Hot",    // optional badge

  // — Detail page —
  skills:          string[],         // e.g. ["Sales","Communication"]
  description:     string,
  eligibility:     string[],         // human-readable eligibility bullets
  responsibilities: string[],

  // — Eligibility engine —
  criteria:        JobCriteria,

  // — Apply —
  applyUrl?:       string,           // official bank careers URL (falls back to APPLY_URL_MAP)
}

JobCriteria = {
  minAge:      number,
  maxAge:      number,
  degree:      string[],   // e.g. ["Bachelor's Degree","Master's Degree","Diploma"]
  minPct:      number,     // minimum aggregate % (e.g. 50, 55, 60)
  minExpYrs:   number,     // minimum years of experience
  needsExam?:  string,     // e.g. "IBPS PO", "SBI PO", "IBPS Clerk"
}
```

### Category values
| `category` | Description |
|---|---|
| `bank` | Scheduled commercial banks (SBI, HDFC, ICICI, etc.) |
| `bfsi` | NBFCs, insurance companies, fintech, MFIs |

---

## 5. Bank

Used for the "Hiring Now" logos carousel on the homepage and login page.

```ts
Bank = {
  name: string,   // e.g. "HDFC Bank"
  logo: string,   // absolute URL to logo image
}
```

---

## 6. Category

Used for the "Browse by role" section on the homepage.

```ts
Category = {
  icon: string,   // emoji e.g. "👔"
  name: string,   // e.g. "Relationship Manager"
}
```

---

## 7. Interview Question

Four banks of questions: `HR_QUESTIONS`, `TECH_QUESTIONS`, `BEHAVIORAL_QUESTIONS`, `SITUATION_QUESTIONS`.

```ts
InterviewQuestion = {
  q:   string,   // the question text
  en:  string,   // English answer guidance
  hi:  string,   // Hinglish (Hindi + English) answer guidance
}
```

### Question banks
| Constant | Count | Topics |
|---|---|---|
| `HR_QUESTIONS` | 8 | Self-intro, motivation, strengths/weaknesses |
| `TECH_QUESTIONS` | 8 | CASA, NEFT/RTGS/IMPS, NPA, Repo Rate, CRR/SLR, Basel III |
| `BEHAVIORAL_QUESTIONS` | 4 | Conflict, missed targets, convincing customers, leadership |
| `SITUATION_QUESTIONS` | 4 | Failed transaction, fraud, VIP exception, account error |

---

## 8. Aptitude Question

All questions live in `APTITUDE_BANK`.

```ts
AptitudeQuestion = {
  topic:    string,     // see topic list below
  q:        string,     // question text
  options:  string[],   // 4 options (MCQ)
  correct:  number,     // index of correct option (0–3)
  explain:  string,     // explanation shown after answering
}
```

### Topics
| Topic | Description |
|---|---|
| `Quantitative Aptitude` | Percentages, SI/CI, time & work, profit/loss |
| `Reasoning` | Syllogisms, series, directions, blood relations |
| `English` | Reading comprehension, grammar, vocabulary |
| `Banking Awareness` | RBI policy, financial terms, current affairs |
| `Computer Awareness` | Networking, MS Office, internet basics |

---

## 9. Apply Flow State (`applyState`)

Ephemeral (not persisted), reset after each submission.

```ts
applyState = {
  step: 1 | 2 | 3 | 4,   // current step
  data: ApplicationData,  // collected field values (see §3)
}
```

### Steps
| Step | Title | Fields collected |
|---|---|---|
| 1 | Personal | name, email, phone, city |
| 2 | Education | qual, univ, yop, agg |
| 3 | Experience | texp, ccomp, fit, resume (UI only) |
| 4 | Review | confirmation checkbox |

On submit: saves to `STATE.applications` → opens `jobApplyUrl(job)` in new tab → redirects to dashboard.

---

## 10. Aptitude Test State (`aptState`)

Ephemeral, reset when leaving the test.

```ts
aptState = {
  mode:      "home" | "test" | "result",
  topic:     string | null,           // selected topic
  idx:       number,                  // current question index (0-based)
  answers:   { [idx: number]: number, [idx + "_submitted"]: boolean },
  questions: AptitudeQuestion[],      // 20 randomly sampled questions
}
```

---

## 11. Eligibility Check Flow

Multi-step wizard. Steps: `Target Role → Personal → Education → Result`.

```ts
EligibilityInput = {
  // Step 1 — Target Role
  role:   string,          // selected job title

  // Step 2 — Personal
  age:    string,          // numeric age
  exp:    string,          // years of experience

  // Step 3 — Education
  degree: string,          // e.g. "Bachelor's Degree"
  pct:    string,          // aggregate %
}
```

The engine cross-checks `EligibilityInput` against `Job.criteria` for every job and returns matched/failed jobs with a pass/fail reason per criterion.

---

## 12. Lookup Maps

### `LOGO_MAP`
`{ [companyName: string]: string }` — maps company name → logo image URL. Used by `companyAvatar()`.

### `APPLY_URL_MAP`
`{ [companyName: string]: string }` — maps company name → official careers page URL. Used by `jobApplyUrl()`.

---

## 13. Routes

Hash-based SPA routing. All routes are in the `ROUTES` map.

| Hash | View | Auth required |
|---|---|---|
| `#/` | Homepage | No |
| `#/bank-jobs` | Bank jobs listing | No |
| `#/bfsi-jobs` | BFSI jobs listing | No |
| `#/job/:id` | Job detail | No |
| `#/login` | Login / Signup | No |
| `#/dashboard` | Dashboard | **Yes** |
| `#/eligibility` | Eligibility checker | **Yes** |
| `#/aptitude` | Aptitude practice | **Yes** |
| `#/interview` | Interview prep | **Yes** |
| `#/apply/:id` | Job application flow | **Yes** |
| `#/saved` | Saved jobs | **Yes** |
| `#/more-jobs` | All jobs | No |

---

## 14. localStorage Keys

| Key | Type | Description |
|---|---|---|
| `bj_user` | `User \| null` (JSON) | Logged-in user profile |
| `bj_apps` | `Application[]` (JSON) | Submitted applications |
| `bj_saved` | `string[]` (JSON) | Saved job IDs |

---

## 15. SEO / Meta

| Tag | Value |
|---|---|
| Canonical | `https://bankjobs-io.vercel.app/` |
| OG image | `https://bankjobs-io.vercel.app/image2.png` (1200×630) |
| Sitemap | `https://bankjobs-io.vercel.app/sitemap.xml` |
| Robots | `index, follow` |
| Schema types | `WebSite`, `Organization`, `FAQPage` |
