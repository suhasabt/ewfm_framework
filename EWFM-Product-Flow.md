# EWFM Maturity Intelligence Tool — Full Product Flow

> **Product:** BeeForce External Workforce Management (EWFM) Maturity Intelligence Tool
> **Purpose:** Consulting-led sales enablement — turn a free maturity assessment into a full sales cycle (outreach, report, deck, demo)
> **Last updated:** 2026-06-26 (v2 — navigation UX fix, persona flow simplified, thank you note added)

---

## Table of Contents

1. [User Personas](#1-user-personas)
2. [High-Level Product Architecture](#2-high-level-product-architecture)
3. [Master Flow Diagram](#3-master-flow-diagram)
4. [Admin Flow — Step by Step](#4-admin-flow--step-by-step)
   - 4A. Create Campaign (Bulk Upload)
   - 4B. Campaign Detail & Monitoring
   - 4C. Assessment Tracker
   - 4D. Account 360
   - 4E. Report Detail
   - 4F. Create Outreach (Email / LinkedIn / WhatsApp)
   - 4G. Build PPT Deck
   - 4H. Sales Pipeline
   - 4I. Settings
5. [Persona User Flow — Step by Step](#5-persona-user-flow--step-by-step)
   - 5A. Receiving & Opening the Link
   - 5B. Assessment Screen
   - 5C. My Report
6. [AI Question Generation Logic](#6-ai-question-generation-logic)
7. [Report Content Spec](#7-report-content-spec)
   - 7A. What the End User (Persona) Sees
   - 7B. What Bluetree/Admin Sees (Extended View)
8. [Content Generation Integrations](#8-content-generation-integrations)
   - 8A. LinkedIn Script
   - 8B. Email Sequence
   - 8C. WhatsApp Messages
   - 8D. Deck (PPT)
   - 8E. Demo Script
   - 8F. Objection Handling
   - 8G. Guided Conversation Questions
9. [Sent List & Metrics Dashboard](#9-sent-list--metrics-dashboard)
10. [Edge Cases & Error States](#10-edge-cases--error-states)

---

## 1. User Personas

### 1.1 Admin — BeeForce BDR / Sales Ops (Bluetree)

The internal user. Logged in, full access to the admin shell.

| Attribute | Detail |
|---|---|
| Who | BDR, Sales Ops, Consulting team at BeeForce |
| Goal | Launch campaigns, monitor engagement, convert assessed prospects into deals |
| Pain | Manual outreach is generic; no visibility on where prospects stand in their maturity journey |
| What they need | Bulk campaign dispatch, live funnel tracking, one-click report-to-outreach conversion, AI-curated sales assets |
| Access | Full admin app — all screens |

---

### 1.2 Prospect / Customer Personas (Assessment Recipients)

These users **never log in**. They receive a tokenized link and land directly on the assessment.

#### CFO (Chief Financial Officer)

| Attribute | Detail |
|---|---|
| Who | Senior finance leader, P&L owner |
| Primary concern | ROI of workforce ops, cost of compliance failures, payroll leakage |
| Assessment lens | "What is this costing me? Where are the financial risks?" |
| Pain points | Manual payroll errors, compliance fines, no visibility on contractor spend vs. outcome |
| Key modules they care about | Payroll & Payout, Compliance Management, Predictive Analytics |
| Trigger for action | Quantified cost exposure + peer benchmark |

#### CHRO (Chief Human Resources Officer)

| Attribute | Detail |
|---|---|
| Who | HR leadership, workforce transformation owner |
| Primary concern | Workforce compliance, transformation journey, employee/contractor experience |
| Assessment lens | "Are my workforce ops compliant and modern?" |
| Pain points | Onboarding delays, attendance fraud, grievance backlogs, exit leakage |
| Key modules they care about | Vendor Mgmt, Workforce Onboarding, Grievance, Exit & Offboarding |
| Trigger for action | Compliance risk score + modernization roadmap |

#### HR Digital Officer

| Attribute | Detail |
|---|---|
| Who | HR technology lead, system owner |
| Primary concern | Automation coverage, module integration, digital process maturity |
| Assessment lens | "How automated and integrated is our HR stack?" |
| Pain points | Manual processes, siloed systems, lack of workflow automation |
| Key modules they care about | All modules — integration depth, automation %, self-service capability |
| Trigger for action | Automation gap score + integration readiness |

#### CDO (Chief Digital Officer)

| Attribute | Detail |
|---|---|
| Who | Digital transformation leader, AI/data strategy owner |
| Primary concern | System visibility, single pane of glass, AI readiness, digital maturity score |
| Assessment lens | "Does this give me a unified digital view of workforce operations?" |
| Pain points | No real-time data, no predictive capability, fragmented workforce data |
| Key modules they care about | Predictive Workforce Analytics, Workforce Communication, Core Management |
| Trigger for action | Digital maturity level + AI readiness gap |

---

---

## DEMO ISSUES LOG & UX CORRECTIONS (v2)

> This section documents what was wrong in the previous demo and what the correct behaviour is. Use this as a QA checklist before any demo.

### ❌ Issue 1: Row click navigates to a new sidebar/nav page (breaks context)

**What was happening:** Clicking a contact row in Campaign Detail or Assessment Tracker was navigating the user to a new top-level page, making the admin feel like they'd left the campaign view entirely. Losing context created confusion — "where am I?" and "how do I get back?".

**Correct behaviour:** Clicking any row in a table should open a **right-side slide-over drawer** (not a new page). Account 360 lives inside this drawer. The background table stays visible and dimmed. The "Back" or ✕ button closes the drawer and returns focus to the exact same row.

> Rule: **Drill-downs are drawers. New screens are only for primary nav (sidebar clicks).**

| Trigger | Old (Wrong) | Correct |
|---|---|---|
| Click contact row in Campaign Detail | Navigates away to Account 360 page | Opens Account 360 as right drawer |
| Click contact row in Assessment Tracker | Navigates away | Opens Account 360 as right drawer |
| Click contact row in Sales Pipeline | Navigates away | Opens Account 360 as right drawer |
| Click "Open Report" in Account 360 | Could navigate away | Opens Report as full-screen modal overlay (not a nav page) |
| Click "Create Outreach" | Navigates away | Opens Outreach as full-screen modal/overlay |
| Click "Build PPT" | Navigates away | Opens Deck Builder as full-screen modal/overlay |

**Back navigation:** Every drawer/modal has a clear ✕ or "Back" — closes and returns to origin. No browser back button dependency.

---

### ❌ Issue 2: Persona switcher tabs on the assessment (CFO / CHRO / CDO / HR Digital)

**What was happening:** The demo showed a tab switcher letting the viewer click between personas. End users found this confusing — "which one am I?" — and it made the assessment look like a generic form rather than something built for them.

**Correct behaviour:** The persona is encoded in the token **before the link is sent**. When a CFO opens their link, they land on a CFO-framed assessment with no switcher, no tabs, no awareness of other personas. It just *is* their assessment.

> The tab switcher stays only as an **internal demo tool for BeeForce team presentations** — it must never be visible to actual prospect users.

---

### ❌ Issue 3: Too many clicks in the assessment for the end user

**What was happening:** Each question required clicking to a new page / route. For 82 questions this is exhausting and was causing drop-off.

**Correct behaviour:** The assessment is a **single scrolling page** with:
- All questions on one continuous page (grouped by module with a sticky section header)
- Answer selection inline (tap 0 / 1 / 2 buttons next to each question)
- A sticky progress bar at the top showing % complete
- One final "Submit Assessment" button at the bottom
- No page loads mid-assessment. No routing. No navigation.

For mobile: questions stack vertically, answer buttons are large tap targets.

---

## 2. High-Level Product Architecture

```
┌──────────────────────────────────────────────────┐
│                  ADMIN APP                        │
│  (BDR / Sales Ops — logged in)                   │
│                                                   │
│  Bulk Dispatch → Campaign Detail                  │
│  Assessment Tracker → Account 360                 │
│  Completed Reports → Report Detail                │
│  Sales Pipeline → Account 360                     │
│  Account 360 → Outreach / PPT Builder             │
│  Settings                                         │
└──────────────────────────────────────────────────┘
         │ sends tokenized link
         ▼
┌──────────────────────────────────────────────────┐
│            PERSONA USER EXPERIENCE                │
│  (No login — isolated tokenized URL)              │
│                                                   │
│  /assess/{token}                                  │
│  → Assessment Screen (guided, persona-framed)     │
│  → My Report (their own maturity report)          │
└──────────────────────────────────────────────────┘
```

**Key principle:** The two worlds never overlap. The admin toggle in the current demo build is dev-only — it must not exist in production.

---

## 3. Master Flow Diagram

```
[Admin] Upload prospect sheet (Excel)
        │
        ▼
[Bulk Dispatch] AI validates rows → configure channel & schedule
        │
        ▼
[Campaign Created] Tokenized links generated per contact
        │
        ▼ (Email / WhatsApp delivered)
        │
[Persona User] Receives link → clicks → lands on /assess/{token}
        │
        ├── Not opened (3 days) ──────────────────────► Follow-up nudge (Admin action)
        │
        ├── Opened, not started (2 days) ────────────► Reminder message
        │
        ├── Started, not completed (5 days) ─────────► "Pick up where you left off" link
        │
        └── Completed ──────────────────────────────► Assessment locked, report generated
                │
                ▼
        [My Report] — Persona user sees their personalised report
                │
                ▼ (Admin notified)
        [Completed Reports] in Admin — row appears
                │
                ▼
        [Report Detail] — Admin reads full report
                │
                ├──► [Create Outreach] — AI generates email/LinkedIn/WhatsApp sequence
                │
                └──► [Build PPT] — AI generates persona-specific deck
```

---

## 4. Admin Flow — Step by Step

---

### 4A. Create Campaign (Bulk Dispatch)

**Entry point:** Sidebar → Bulk Dispatch

#### Step 1 — Upload Prospect Sheet

- Admin uploads an Excel/CSV file with columns:
  - Company Name
  - Contact Name
  - Designation (maps to persona: CFO / CHRO / CDO / HR Digital)
  - Email
  - Mobile Number
  - Industry (Manufacturing / IT / Retail / BFSI / etc.)
  - BDR Owner (optional — defaults to logged-in user)

- **AI validation runs on upload (row by row):**

  | Validation | What AI checks | Result tag |
  |---|---|---|
  | Duplicate detection | Same email already in system | `⚠ Duplicate` |
  | Persona mapping | Designation → known persona | `✓ Valid` or `? Needs fixing` |
  | Missing fields | Required fields empty | `✗ Incomplete` |
  | Industry match | Industry in supported list | `✓ Valid` or `? Unknown industry` |

- Admin sees a preview table with row-level status. They can:
  - Skip flagged rows
  - Fix inline (edit cell)
  - Download error report
  - Proceed with valid rows only

#### Step 2 — Configure Campaign

- **Campaign Name** (auto-suggested: `{Company} EWFM Assessment — {Month Year}`)
- **Channel:** Email / WhatsApp / Both
- **Schedule:** Send now / Send on Monday 9am / Custom date-time
- **Personalization preview:** Admin clicks any row to preview the exact message that contact will receive (persona + industry context already applied)

#### Step 3 — Generate Campaign

- Click **"Generate Campaign"**
- System creates:
  - Unique tokenized URL per contact (`/assess/{uuid}`)
  - Personalized outreach message per contact (email subject + body / WhatsApp copy)
  - Campaign record in database
- Admin is redirected to **Campaign Detail** screen

---

### 4B. Campaign Detail

**Entry point:** After campaign creation, or click any campaign in Assessment Tracker

#### Funnel View (top of screen)

```
Sent → Opened → Started → Completed → Report Viewed → Outreach Sent
  47      31        24         18            12               7
 100%    66%       51%        38%           26%             15%
```

- Each stage is clickable → filters the contact table below to show only contacts at that stage

#### Campaign Config Panel

- Campaign name, channel, send date, BDR owner
- Edit button to resend / add more contacts / change channel

#### Per-Contact Table

| Column | Description |
|---|---|
| Contact Name | Linked to Account 360 |
| Company | |
| Persona | CFO / CHRO / CDO / HR Digital |
| Status | Sent / Opened / Started / Completed |
| Last Activity | Timestamp of last event |
| Time Since Sent | E.g. "3 days ago" |
| Suggested Action | AI-generated nudge (e.g. "Send reminder — opened but not started") |
| Actions | View 360 / Resend Link / Send Reminder |

---

### 4C. Assessment Tracker

**Entry point:** Sidebar → Assessment Tracker

Global view across ALL campaigns and contacts.

- Filter by: Campaign / Persona / Industry / Status / BDR Owner / Date range
- Same per-contact table as Campaign Detail
- Bulk actions: Select contacts → Bulk resend / Bulk reminder

---

### 4D. Account 360

**Entry point:** Click any contact row in Campaign Detail / Assessment Tracker / Sales Pipeline

This is the single most important screen in the admin app. Everything converges here.

#### Header

- Company name, contact name, persona badge
- Overall EWFM score (e.g. `72%`)
- Maturity level badge (e.g. `Level 4 — Integrated Workforce Management`)
- Assessment status badge: `Not Sent / Sent / Opened / In Progress / Completed`

#### Module Breakdown (10 modules)

For each of the 10 EWFM modules:

| Column | Detail |
|---|---|
| Module name | Vendor Mgmt, Onboarding, Core Mgmt, Exit, Attendance, Analytics, Payroll, Compliance, Grievance, Communication |
| Score % | e.g. 65% |
| Maturity Level | Level 1–5 |
| Risk Badge | 🔴 High / 🟡 Medium / 🟢 Low |
| Progress bar | Visual fill |
| Missing best practices | Count of 0-scored practices |

#### Engagement Timeline

```
🔵 Link Sent — Jun 10, 9:02am
🟡 Link Opened — Jun 11, 2:14pm
🟡 Assessment Started — Jun 11, 2:16pm
🟢 Assessment Completed — Jun 12, 10:45am
🟢 Report Viewed — Jun 12, 10:52am
```

#### AI Sales Intelligence Panel

- **Top 3 Talking Points** — generated from the 3 weakest modules, framed for their persona
  - e.g. CFO: "Your Compliance score of 34% means you're likely spending 3–5x more on audit prep than best-in-class peers."
- **Next Best Action card** (highlighted) — one specific, time-bound recommendation
  - e.g. "Book a Compliance + Payroll focused demo this week — they scored 0 on Real-Time PF Validation."

#### Actions (disabled until assessment completed)

- **Open Report** → Report Detail
- **Create Outreach** → Outreach screen
- **Build PPT** → Deck Builder

---

### 4E. Report Detail

**Entry point:** "Open Report" from Account 360, or click row in Completed Reports

This is a single-screen, printable/PDF-exportable report.

*(Full report content spec in Section 7 below.)*

Actions available on this screen:
- **Create Outreach** → Outreach screen
- **Build PPT** → Deck Builder
- **Download PDF** → browser print dialog → save as PDF
- **Back to Account 360** / **Back to Completed Reports** (whichever launched it)

---

### 4F. Create Outreach

**Entry point:** "Create Outreach" from Account 360 or Report Detail

AI generates a complete outreach sequence anchored to the specific assessment findings.

#### Left Panel — 6-Step Sequence

| Day | Channel | Purpose |
|---|---|---|
| Day 0 | Email | Initial outreach — reference assessment + headline finding |
| Day 2 | LinkedIn | Connection request with personalized note |
| Day 4 | Email | Deep dive on top risk module |
| Day 7 | WhatsApp | Short nudge — link to report finding |
| Day 9 | LinkedIn | Follow-up message — reference peer benchmark |
| Day 14 | Email | Final follow-up — CTA for demo/discovery call |

For each step, admin sees:
- Full drafted copy (editable inline)
- Subject line (for email)
- Persona-framed language (CFO gets ROI framing, CHRO gets compliance framing, etc.)
- Copy / Approve / Edit buttons

#### Right Panel — Asset Library

| Asset | What it contains |
|---|---|
| Demo Script | Module-by-module pain-based talk track, tied to this account's gaps |
| Objection Handling | "We already have a system" / "Budget freeze" / "Not the right time" — rebuttals anchored to their score |
| Competitor Angle | Where BeeForce outperforms what they likely use, based on their industry |
| 90-Day No-Response Script | Reactivation sequence if they go dark |
| Next Best Action | The single highest-ROI action for this account right now |
| Guided Conversation Questions | Questions to ask in the first call, designed to surface the pain their score reveals |

#### Auto-approve toggle

If enabled in Settings, outreach is automatically approved and queued. Otherwise admin reviews each step before sending.

---

### 4G. Build PPT Deck

**Entry point:** "Build PPT" from Account 360 or Report Detail

#### Step 1 — Choose Template

| Template | Audience | Slide count | Focus |
|---|---|---|---|
| Compliance-Only | Legal / CHRO | 10–12 slides | Compliance gaps, legal risk, remediation |
| Executive Brief | C-Suite (CFO/CDO) | 8–10 slides | Score summary, business impact, ROI |
| Digital Maturity | CDO / HR Digital | 12–15 slides | Module coverage, automation %, AI readiness |

#### Step 2 — Configure

- White-label toggle (remove BeeForce branding / add client logo)
- Optional add-ons:
  - Risk Register slide
  - Custom CTA slide ("Your 90-Day Roadmap")
  - Competitor comparison slide
- Presenter notes toggle (include/exclude)

#### Step 3 — Generate

- AI assembles slides using the account's specific scores, module gaps, and persona context
- Preview renders in app
- Download as `.pptx`

---

### 4H. Sales Pipeline

**Entry point:** Sidebar → Sales Pipeline

Full account list with sales intelligence overlaid.

| Column | Detail |
|---|---|
| Company | Link → Account 360 |
| Persona | Primary contact's role |
| Industry | |
| Score | EWFM % score (colour-coded) |
| Maturity Level | Level 1–5 |
| Status | Assessment stage |
| BDR Owner | |
| AI Priority | 🔴 Hot / 🟡 Warm / 🟢 Nurture |
| Last Activity | |
| Next Action | AI-suggested follow-up |

Panels on this screen:
- **AI Lead Priority** — ranked list of who to call today
- **Suggested Follow-Up** — per account, one-line recommended action
- **Sales Narrative** — module-based story for each account

---

### 4I. Settings

- Compliance Management scoring weight slider (15–30% — highest weight module)
- Question source reference (which EWFM module each question maps to)
- Scoring scale reference (0 / 1 / 2 model)
- Maturity level band definitions (Level 1–5)
- AI personalization inputs: persona, industry, company size
- Auto-approve toggle for AI-generated outreach
- Default delivery channel (Email / WhatsApp / Both)
- Default report template

---

## 5. Persona User Flow — Step by Step

> **Design principle:** The persona user has zero time and zero patience. Every extra click is a drop-off risk. The entire experience is: **Open link → Scroll & Answer → See Report → Download → Done.** Nothing else.

---

### 5A. Receiving & Opening the Link

- Persona user receives a message (email or WhatsApp) — personalized to their name, company, and title
- Subject/hook references a **"Free Workforce Transformation Assessment"** — no product pitch
- They click the link → land on `/assess/{token}` — **no login, no registration, no app shell, no loading interstitial**
- The page renders immediately with their name and company pre-filled in the header

**What the token encodes (server-side only — invisible to user):**
- Company name
- Persona type (CFO / CHRO / CDO / HR Digital) — determines how every question is phrased
- Industry — adds industry-specific context
- Campaign ID + Contact ID
- Expiry (valid 30 days from send)

---

### 5B. Assessment Screen — Simplified Single-Page Flow

**No tabs. No sidebar. No persona switching. No routing between questions.**

The entire assessment is **one continuous scrolling page.**

#### Page structure (top to bottom):

```
┌────────────────────────────────────────────────────┐
│  ████████░░░░░░░░░ 42% complete  (sticky top bar)  │
│  "Hi Rajesh — your assessment for Tata Steel       │
│   takes about 10 minutes"                          │
├────────────────────────────────────────────────────┤
│  ── MODULE 1: Vendor Management ──                 │
│                                                    │
│  Q1. [Question phrased for their persona]          │
│  [ 0 Not Available ] [ 1 Partial ] [ 2 Full ]      │
│                                                    │
│  Q2. [Question text]                               │
│  [ 0 ] [ 1 ] [ 2 ]                                │
│                                                    │
│  ... (all questions for this module)               │
├────────────────────────────────────────────────────┤
│  ── MODULE 2: Workforce Onboarding ──              │
│  ...                                               │
├────────────────────────────────────────────────────┤
│  (continues through all 10 modules, ~82 questions) │
├────────────────────────────────────────────────────┤
│  [ Submit & View My Report ]                       │
└────────────────────────────────────────────────────┘
```

#### Key UX rules:

- **No page loads.** All questions on one page. Tap 0 / 1 / 2 — answer saves instantly, page auto-scrolls to next question
- **Module headers are sticky** as the user scrolls (so they always know which section they're in)
- **Progress bar** fills in real time as answers are tapped (immediate positive feedback)
- **No mandatory free-text.** Optional "Add note" link hidden per question — only shows if tapped
- **Auto-save on every answer** — closing the tab resumes from the last answered question on next open
- **Submit button** is grey/inactive until ≥ 70% answered; turns active at 70% threshold
- **Mobile-first:** answer buttons are large tap targets, no tiny radio buttons

#### Persona question framing (automatic — no user action):

| Persona (from token) | Example: "Real-Time PF Validation" |
|---|---|
| CFO | "Does your system automatically flag PF compliance violations before they result in financial penalties?" |
| CHRO | "Can your HR team detect and act on PF non-compliance in real time?" |
| CDO | "Does your workforce platform surface statutory compliance alerts in a unified dashboard?" |
| HR Digital | "Is PF validation automated and integrated end-to-end with your payroll workflow?" |

---

### 5C. My Report

**Loads immediately after submission — no wait screen, no "check your email".**

The assessment content fades out and the report slides in on the same URL. No redirect, no new tab.

- Persona-specific language throughout — every sentence speaks to their role
- No admin panels, no pipeline data, no BeeForce sales copy in the body
- Clean, professional, printable layout

**Report sections (persona user view — 6 sections only):**

1. **Score + Maturity Level** — visual gauge, e.g. "72% — Level 4: Integrated Workforce Management"
2. **What This Means For You** — 2–3 sentences in their persona's language
3. **Your Top 3 Risk Areas** — weakest modules + specifically what's missing
4. **Your Quick Wins** — 2–3 improvements that move the needle fast
5. **Potential Business Impact** — quantified (₹ saved / % efficiency gain)
6. **Recommended Next Step** — one CTA: "Book a 30-min review with BeeForce"

#### Downloads available:

| Button | Contents |
|---|---|
| **Download My Report (PDF)** | Full maturity report in their persona framing |
| **Download Thank You Note (PDF)** | AI-generated personalised note (see 5D) |

---

### 5D. AI-Generated Thank You Note

After completing the assessment the user can download a short, personalised **Thank You Note** — an AI-generated PDF they can save or share internally.

**Structure:**

```
Subject: Your External Workforce Management Assessment — [Company Name]

Dear [Name],

Thank you for completing the BeeForce External Workforce Management
Maturity Assessment for [Company Name].

Your organisation scored [X]% overall, placing you at [Level Y —
Description]. Based on your responses, your strongest area is
[Top Module] and your key growth opportunity lies in [Weakest Module].

Your personalised Workforce Transformation Report is attached. It
outlines your current maturity baseline, the 3 highest-priority
improvement areas, and the estimated business impact of addressing them.

We'd love to walk you through the findings in a short call — at your
convenience, no pressure.

Warm regards,
[BDR Name]
BeeForce | External Workforce Management
[BDR Phone] | [BDR Email]
```

- Generated instantly, downloadable as PDF
- Every line references their actual score, top module, and weakest module — no generic copy
- BDR name + contact auto-populated from campaign config
- Can also be emailed automatically to the user after completion (configurable in Settings)

---

## 6. AI Question Generation Logic

This is how the AI personalises the 82 best practice questions per persona:

### Input variables fed to AI:

1. **Persona type** — CFO / CHRO / CDO / HR Digital
2. **Industry** — Manufacturing / IT / Retail / BFSI / etc.
3. **Module** — which of the 10 EWFM modules this question belongs to
4. **Base best practice text** — the raw best practice from the EWFM framework
5. **Company name** (optional — used in phrasing if provided)

### Output per question:

- **Question text** — persona-framed version of the best practice
- **Why it matters** — one sentence in the persona's language (e.g., "As a CFO, this directly impacts your compliance liability exposure")
- **Context tooltip** — industry-specific example (e.g., "In manufacturing, PF violations average ₹2–5L per incident")

### AI rules:

- CFO questions use **financial / cost / risk** framing
- CHRO questions use **workforce / compliance / experience** framing
- CDO questions use **digital / data / visibility** framing
- HR Digital questions use **automation / integration / process** framing
- Never use technical jargon without a plain-language qualifier
- All questions must be answerable as 0 / 1 / 2

---

## 7. Report Content Spec

---

### 7A. What the End User (Persona) Sees

This is the **My Report** screen (and the downloadable PDF they receive).

Designed for: a single busy executive who wants the key story in under 5 minutes.

#### Section 1 — Header

```
[Company Name]
External Workforce Management Maturity Assessment

Overall Score: 72%
Maturity Level: Level 4 — Integrated Workforce Management
Assessment Date: June 2026
Persona: CFO
Industry: Manufacturing
```

#### Section 2 — Business Outcome

*What closing the gaps actually unlocks for this person.*

One paragraph, persona-framed. Example:

> "Based on your score, BeeForce estimates your organisation is incurring approximately ₹40–80L annually in preventable compliance costs. Achieving Level 5 maturity would reduce audit preparation effort by 60–80% and eliminate most contractor compliance penalties."

#### Section 3 — Maturity Scoring Summary

- Score: **72%**
- Level: **Level 4 — Integrated Workforce Management**
- Visual score bar (Level 1–5 scale)
- Short description of what Level 4 means vs. Level 5

Maturity levels for reference:

| Level | Score | Description |
|---|---|---|
| Level 1 | 0–20% | Manual & Reactive |
| Level 2 | 21–40% | Basic Digitalization |
| Level 3 | 41–60% | Process Driven |
| Level 4 | 61–80% | Integrated Workforce Management |
| Level 5 | 81–100% | Best-in-Class External Workforce Excellence |

#### Section 4 — Key Risks (Top 3 Weak Modules)

For each of the 3 lowest-scoring modules:

```
🔴 Compliance Management — Score: 34%

Missing best practices driving this risk:
• Real-Time PF Validation — Not Available
• Vendor Compliance Scoring — Not Available
• Compliance Notice Tracking — Partially Available

Risk: Without real-time PF validation, your organisation is exposed to
undetected statutory violations that typically result in ₹2–10L penalties per
incident.
```

Persona-specific risk language: CFO sees financial impact, CHRO sees workforce/legal risk, CDO sees data gap, HR Digital sees process gap.

#### Section 5 — Improvement Opportunity

For each of the 3 Key Risk modules, one specific next step:

```
Module: Compliance Management
Next best practice to implement:
→ Real-Time PF Validation
Why: Immediate detection of violations before they escalate. This single
improvement reduces compliance audit time by 40–60%.
```

#### Section 6 — Potential Business Impact

Quantified upside, tied to their specific score gaps:

| Improvement Area | Estimated Impact |
|---|---|
| Compliance Management | 30–50% reduction in compliance effort |
| Payroll & Payout | 20–30% reduction in payroll processing time |
| Predictive Analytics | 15–25% improvement in workforce availability |
| (varies by their weakest modules) | |

#### Section 7 — Recommended Next Step (CTA)

One clear action. Example:

> "Book a 30-minute compliance deep-dive with the BeeForce team to walk through your top 3 risk areas and see exactly how they can be resolved."

[Book a Demo] button (links to BDR's calendar or a Calendly)

---

### 7B. What Bluetree / Admin Sees (Extended View in Report Detail)

Admin sees everything the persona user sees, PLUS:

#### Extended Section — Module-by-Module Breakdown (All 10 Modules)

Full table: every module, score, level, specific practices scored 0/1/2.

| Module | Score | Level | 0s | 1s | 2s | Risk |
|---|---|---|---|---|---|---|
| Vendor Management | 75% | L4 | 1 | 2 | 5 | 🟢 Low |
| Workforce Onboarding | 60% | L3 | 2 | 3 | 5 | 🟡 Medium |
| Core Management | 88% | L5 | 0 | 1 | 7 | 🟢 Low |
| Exit & Offboarding | 50% | L3 | 2 | 2 | 2 | 🟡 Medium |
| Attendance | 80% | L4 | 1 | 1 | 10 | 🟢 Low |
| Predictive Analytics | 40% | L2 | 3 | 0 | 2 | 🔴 High |
| Payroll & Payout | 55% | L3 | 3 | 2 | 7 | 🟡 Medium |
| Compliance Management | 34% | L2 | 6 | 2 | 3 | 🔴 High |
| Grievance Management | 60% | L3 | 1 | 2 | 2 | 🟡 Medium |
| Workforce Communication | 70% | L4 | 1 | 1 | 3 | 🟢 Low |

#### Extended Section — AI Sales Intelligence

- **3 AI-generated talking points** (not visible to persona user)
- **Next best action** for BDR
- **Competitor intelligence**: what system this company likely uses (based on industry) and where BeeForce outperforms it

#### Extended Section — Raw Response Data

Full table of every best practice with the contact's exact answer (0/1/2) and any free-text comments they left.

#### Extended Section — Engagement Metadata

- Time to complete assessment (total)
- Time spent per module (which modules they paused on — signals interest)
- Number of times they returned to the link
- Device used (mobile / desktop)

---

## 8. Content Generation Integrations

All generated from the same source: **the completed assessment data + persona + industry + report findings.**

---

### 8A. LinkedIn Script

Generated from: weakest module, persona pain, company context.

#### Structure (generated per account):

**Connection Request Note (300 chars max):**
```
Hi [Name], I saw [Company] is scaling its contractor workforce.
We've helped similar [Industry] firms cut compliance risk by 40%+.
Would love to share a quick insight — worth a 5-min look?
```

**Follow-Up Message 1 (Day 3 after connection):**
```
[Name], thanks for connecting. Based on what I know about [Industry]
external workforce ops, compliance and payroll integration tend to be
the biggest pain points. We recently completed a maturity assessment
for a company like yours — the findings were eye-opening. Would you
be open to seeing your own benchmark? Takes 10 minutes.
```

**Follow-Up Message 2 (Day 7):**
```
Quick follow-up — I didn't want to lose track of this. Our assessment
showed [Company-specific finding, e.g., "companies in your sector average
Level 3 on Compliance"]. Happy to share the full framework if useful.
```

**Follow-Up Message 3 (Day 14):**
Reference their specific report finding if available. If not yet assessed:
```
One last nudge — if external workforce compliance or payroll accuracy
is on your radar for this half, this is worth 10 minutes. Here's the
assessment link: [link]. Happy to walk you through the results personally.
```

---

### 8B. Email Sequence (5 Emails)

Generated anchored to their assessment findings. Each email references a specific module gap.

| Email | Day | Subject | Focus |
|---|---|---|---|
| Email 1 | Day 0 | "Your [Company] Workforce Maturity Score is Ready" | Headline score + top risk module |
| Email 2 | Day 4 | "The hidden cost of [weakest module] gaps at [Company]" | Deep dive on top risk, quantified impact |
| Email 3 | Day 7 | "How [Peer Company in same industry] solved this" | Social proof / case study angle |
| Email 4 | Day 10 | "3 quick wins from your assessment" | Practical improvement actions — low-hanging fruit |
| Email 5 | Day 14 | "Last note — ready when you are" | Soft CTA, no pressure, leaves door open |

**Each email includes:**
- Persona-specific subject line
- Opening line that references their specific score or finding
- One-click CTA (Book Demo / View Report / Reply to this email)
- Plain text variant (for deliverability)

---

### 8C. WhatsApp Messages

Short, conversational. Three messages in the sequence.

**Message 1 (Day 0 — with assessment):**
```
Hi [Name], this is [BDR Name] from BeeForce. I've shared a quick
workforce maturity assessment with you — takes ~10 mins. The report
is instant and personalised to [Company]. Here's the link: [link]
```

**Message 2 (Day 3 — if not opened):**
```
Hi [Name], just checking if you got the assessment link I shared.
It benchmarks your external workforce ops against industry best
practices. Happy to walk you through it if that's easier — just reply here.
```

**Message 3 (Day 7 — post completion, if completed):**
```
Hi [Name], your assessment report is ready! Your overall score is
[X%] — you're at Level [Y]. I've flagged 3 key risk areas that might
be worth a quick call. Can I share more? Completely no-pressure.
```

---

### 8D. Deck (PPT)

Three templates — details in Section 4G above.

**Slide structure (Executive Brief as example):**

1. Cover — "[Company] EWFM Maturity Assessment — [Date]"
2. About This Assessment — framework overview, 10 modules, 82 best practices
3. Your Score at a Glance — overall %, maturity level, visual gauge
4. Where You Stand vs. Industry — peer benchmark (anonymised)
5. Your Top 3 Risk Areas — one slide per risk module
6. The Business Impact — quantified ROI opportunity
7. Improvement Roadmap — 3 recommended next steps (30 / 60 / 90 day)
8. How BeeForce Solves This — module-specific capability callouts
9. Suggested Next Step — CTA slide
10. Appendix — Full module breakdown table

---

### 8E. Demo Script

Module-by-module, tied to the account's specific gaps.

**Structure:**
```
Opening (2 min):
"[Name], thanks for the assessment. Your score came in at 72% — Level 4.
That's solid, but there are 2 areas where I'd love to show you something
specific: Compliance at 34% and Predictive Analytics at 40%. Can I start there?"

Compliance Module Demo (8 min):
[Script tied to their specific missing best practices]
Key questions to ask:
- "When was the last time you had a PF discrepancy surface late?"
- "How long does it currently take your team to prepare for a compliance audit?"

Predictive Analytics Demo (8 min):
[Script tied to their specific missing best practices]

Closing (5 min):
"Based on what we just walked through, here are the 3 things that would
move you from Level 4 to Level 5 in under 6 months..."
```

---

### 8F. Objection Handling

Generated per account, with answers that reference their specific score.

| Objection | Response (account-specific) |
|---|---|
| "We already have a system" | "That's great — your assessment actually shows Level 4 overall, which means your core is working. The gaps are specific: [Module X] is at Level 2. This isn't about replacing your system — it's about filling those 2–3 gaps." |
| "Budget is frozen" | "Understood. The interesting part is that your Compliance score of 34% is likely costing you more than the fix — the average compliance penalty in [Industry] is [₹X]. This is a cost-avoidance conversation, not a spend conversation." |
| "Not the right time" | "Fair. When does this come back on the radar? Your report is saved — happy to pick this up in Q[X]. Should I flag your calendar?" |
| "We're evaluating other options" | "Perfect — use this assessment as your evaluation framework. The 82 best practices are vendor-neutral. See how your current shortlisted vendors score against each one." |

---

### 8G. Guided Conversation Questions

Questions for the first discovery call, engineered to surface the pain their score already reveals.

Generated per persona:

**For CFO (if Compliance score < 50%):**
- "What's your current process when a PF discrepancy is flagged by a statutory authority?"
- "How much time does your compliance team spend preparing for an annual audit?"
- "Have you had any contractor-related statutory notices in the last 12 months?"

**For CHRO (if Onboarding score < 50%):**
- "Walk me through how a new contractor gets onboarded today — from vendor to day one."
- "What's your current average time to deploy a new hire after offer?"
- "How do you currently handle duplicate worker detection across your contractor vendors?"

**For CDO (if Predictive Analytics score < 50%):**
- "Do you have a single dashboard that shows you real-time contractor headcount across all sites?"
- "How do you currently forecast contractor demand for the next quarter?"
- "What's your current data source for workforce productivity metrics?"

---

## 9. Sent List & Metrics Dashboard

### Campaign List View (top level)

| Column | Detail |
|---|---|
| Campaign Name | Click → Campaign Detail |
| Created Date | |
| BDR Owner | |
| Total Contacts | |
| Sent | # |
| Opened | # (% of Sent) |
| Started | # (% of Opened) |
| Completed | # (% of Started) |
| Report Viewed | # (% of Completed) |
| Outreach Sent | # (% of Report Viewed) |
| Status | Active / Paused / Archived |

### Per-Contact Status (inside Campaign Detail)

| Status | Meaning |
|---|---|
| `Sent` | Link delivered, no open event |
| `Opened` | Link clicked, assessment not started |
| `In Progress` | At least 1 answer submitted |
| `Completed` | All 82 best practices answered, report generated |
| `Report Viewed` | Persona user opened My Report |
| `Bounced` | Email delivery failed |
| `Unsubscribed` | Contact opted out |

### Metrics Definitions

- **Open rate** = Opened / Sent
- **Start rate** = Started / Opened
- **Completion rate** = Completed / Started
- **Report view rate** = Report Viewed / Completed
- **Outreach conversion** = Outreach Sent / Report Viewed

### Filters & Exports

- Filter by: Date range / Persona / Industry / Status / BDR
- Export: Full contact list as CSV with all status columns

---

## 10. Edge Cases & Error States

---

### Campaign Creation

| Edge Case | Handling |
|---|---|
| Duplicate email in upload | Flag row as `⚠ Duplicate`, skip on campaign creation unless admin overrides |
| Unknown designation / persona | Flag as `? Needs fixing` — drop-down to manually assign persona |
| Missing email + mobile | Row blocked — must have at least one delivery channel |
| Industry not in list | Flag as `? Unknown` — allow free text fallback, AI uses best-match industry |
| Zero valid rows after validation | Block campaign creation — show error: "No valid contacts to campaign" |
| Same contact in 2 campaigns simultaneously | Warn admin: "This contact already has an active assessment link. Send anyway?" |

---

### Assessment Link

| Edge Case | Handling |
|---|---|
| Link expired (>30 days) | Show: "This link has expired. Contact [BDR name] for a new link." |
| Link already completed | Redirect directly to My Report — no re-assessment allowed |
| Link opened on mobile | Full mobile-responsive layout, single-column, touch-friendly answer buttons |
| User closes tab mid-assessment | Auto-save means they resume exactly where they left off on next open |
| User tries to navigate back in browser | Warn: "Your progress is saved. Click Resume to continue or Close to exit." |
| Token tampered / invalid | Show: "This link is invalid." No other information exposed |
| Same link opened in 2 tabs | Second tab shows: "You have this assessment open in another tab." |

---

### Assessment Completion

| Edge Case | Handling |
|---|---|
| User skips questions | Allow partial submission only if ≥ 70% answered. Below that: "Please answer at least X more questions to generate your report." |
| User answers all 0s | Valid — generates a Level 1 report. No intervention. |
| Report generation fails | Show: "Your responses are saved. Your report is being prepared — you'll receive it by email within a few minutes." |
| User submits and immediately closes | Report generation runs server-side. Link remains valid to view report. |

---

### Report & Content Generation

| Edge Case | Handling |
|---|---|
| Outreach generated before assessment completed | Buttons disabled on Account 360 / Report Detail until status = `Completed` |
| AI content generation fails | Show retry option. Fall back to template-based (non-AI) draft with manual edit prompt. |
| PPT generation fails | Show: "Deck generation failed. Try again or download the report PDF as a fallback." |
| White-label toggle + no client logo uploaded | Prompt: "Upload a logo for white-label output, or generate without logo." |
| Multiple contacts at same company, different personas | Each gets their own token, their own report. Admin sees all under one company in Account 360 — can toggle between contacts. |

---

### Delivery

| Edge Case | Handling |
|---|---|
| Email bounces | Status → `Bounced`. Suggested action: "Try WhatsApp instead." |
| WhatsApp delivery fails | Status → `Delivery Failed`. Suggested action: "Send via email." |
| Contact unsubscribes | Status → `Unsubscribed`. Remove from future campaigns. Flag in pipeline. |
| BDR leaves company | Reassign contacts to new BDR. Campaigns remain active. |
| Campaign scheduled but channel down | Queue and retry. Admin notified after 3 failed retries. |

---

### No-Response Handling

| Scenario | Suggested Admin Action |
|---|---|
| Sent, not opened in 3 days | Send reminder via alternate channel |
| Opened, not started in 2 days | WhatsApp: "Need help getting started?" |
| Started, not completed in 5 days | Email: "Pick up where you left off" with resume link |
| Completed, no outreach sent in 7 days | Alert BDR: "Report ready — follow up now while engagement is hot" |
| All outreach sent, no reply in 30 days | Queue 90-day reactivation script |
| Replied "not interested" | Log response. AI updates account notes. Suggested: "Dig into pain — don't drop." |

---

*End of document*

---

> **Related files:**
> - `FEATURES.md` — Admin and persona feature set
> - `EWFM-requirement-content-searchable.txt` — 10 modules, 82 best practices, scoring model
> - `meeting-notes-summary.md` — GTM strategy and outreach sequence
> - `External Workforce Management Maturity Framework.xlsx` — Source framework
