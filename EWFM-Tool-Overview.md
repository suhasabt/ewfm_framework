# EWFM Maturity Intelligence Tool — Product Overview

## Live Links

**Production (Vercel):**

- Admin: https://ewfm-framework.vercel.app/
- CFO: https://ewfm-framework.vercel.app/assess/cfo
- CHRO: https://ewfm-framework.vercel.app/assess/chro
- CDO: https://ewfm-framework.vercel.app/assess/cdo
- HR Digital: https://ewfm-framework.vercel.app/assess/hr-digital

---

## Introduction

The **EWFM Maturity Intelligence Tool** is a consulting-led sales enablement platform built for BeeForce. It turns a free, 10-minute External Workforce Management (EWFM) maturity assessment into a structured sales pipeline — from first outreach, to a personalized diagnostic report, to a sales-ready deck and demo.

Instead of generic cold outreach, prospects (CFOs, CHROs, CDOs, HR Digital leads) receive a tokenized link to a short assessment tailored to their role. Their answers generate an instant maturity score and report, which the BeeForce sales team uses to drive a consultative, data-backed conversation — replacing guesswork with a quantified diagnosis of the prospect's workforce management gaps.

This is currently a **working interactive prototype**, live at:
**https://ewfm-framework.vercel.app/**

---

## Feature List

### 1. Campaign Creation (Bulk Dispatch)
- Upload a prospect list (Excel/CSV) with company, contact, persona, and industry details.
- AI-style validation flags valid rows, duplicates, and rows needing fixes before sending.
- Configure delivery channel (Email / WhatsApp / Both) and schedule (now, scheduled, or custom).
- Live personalization preview before launch.
- Generates tokenized, persona-specific assessment links per contact.

### 2. Persona-Tailored Assessments
- Four built-in personas — **CFO, CHRO, CDO, HR Digital** — each see a different prioritized set of questions drawn from the EWFM maturity framework, relevant to their role's concerns (cost/compliance for CFO, workforce experience for CHRO, digital/AI readiness for CDO, automation for HR Digital).
- Clean, guided question flow with a progress tracker and partial-submission threshold (70%).
- No login required — recipients land directly on their assessment via a unique link.

### 3. Instant Maturity Report
- On submission, generates an overall maturity score (0–100%) and a 5-level maturity rating (Manual & Reactive → Best-in-Class).
- Module-by-module breakdown across all 10 EWFM modules (Vendor Management, Payroll, Compliance, Attendance, Predictive Analytics, etc.).
- Highlights top 3 risk areas with business-impact narrative, tailored to the persona.
- Dual view: written report **and** a visual "maturity constellation" radar chart with risk distribution and strongest/weakest modules.
- Recipient can download/print the report and request a consulting call directly from the report screen.

### 4. Campaign & Funnel Tracking (Admin)
- Funnel view across all six stages: Sent → Opened → In Progress → Completed → Report Viewed → Outreach Sent.
- Global Assessment Tracker with filters by campaign, persona, industry, status, and BDR owner — plus bulk reminder dispatch.
- Per-contact **Account 360** drawer: full module breakdown, engagement timeline, and AI-suggested talking points and next-best-action.

### 5. Sales Enablement Tools
- **Outreach Builder** — generates a multi-step, multi-channel (email/LinkedIn/WhatsApp) outreach sequence per contact, with editable drafts and approval workflow.
- **PPT Deck Builder** — auto-builds a sales deck from the contact's report data with selectable templates.
- One click from a completed report into outreach or deck creation — no manual data re-entry.

### 6. Sales Pipeline View
- Kanban-style pipeline: Needs Nudge → Assessed → Outreach Ready → Sales Follow-up.
- Inline actions per stage (resend, mark opened, mark started, mark viewed, mark sent) so BDRs can manage the full lifecycle without leaving the board.

### 7. Reports Queue
- Dedicated view of all completed assessments, searchable, with one-click access to the report and outreach tools.

### 8. Multi-BDR Support
- Switchable BDR owner in the admin sidebar, so the tool reflects whichever rep is working a given account.

### 9. Settings & Configuration
- Assessment link expiry, auto-email delivery toggle, and white-label branding controls.

---

## Flows & Features

### Flow A — Admin / BDR Journey (Campaign to Deal)

1. **Create Campaign** (`Bulk Dispatch`) — Upload prospect sheet → AI validates rows → fix or use valid rows → configure channel/schedule → **Generate Campaign**.
2. **Campaign Detail** — Land on the new campaign's funnel; see counts at each stage (Sent → Opened → In Progress → Completed → Report Viewed → Outreach Sent); search/filter the contact table.
3. **Monitor & Nudge** — From the **Assessment Tracker** (global, cross-campaign view) or **Sales Pipeline** (kanban view), resend links, mark stages manually for activity that happened outside the tool, and bulk-remind a filtered list.
4. **Account 360** — Click into any contact for the full picture: module scores, engagement timeline, and AI-suggested talking point + next-best-action.
5. **Convert a Completed Assessment** — Once a contact's status is `Completed`/`Report Viewed`:
   - **Open Report** → review the same report the persona sees, plus an admin-only extended module view.
   - **Create Outreach** → generate a multi-channel (email/LinkedIn/WhatsApp) sequence, approve or edit each step, copy the draft.
   - **Build PPT** → pick a deck template, preview slides, export.
6. **Completed Reports queue** — A standing list of every finished assessment for quick re-entry into report/outreach without hunting through campaigns.
7. **Settings** — Adjust link expiry, auto-email delivery, and white-label branding for outputs.

### Flow B — Persona / Prospect Journey (Link to Report)

1. **Receive Link** — Persona gets a tokenized URL (e.g. `/assess/cfo`) via email/WhatsApp/LinkedIn — no login, no account creation.
2. **Take Assessment** — Sees a question set curated for their role (e.g. a CFO sees compliance/payroll-weighted questions first), answers via a 3-option scale (Not Available / Partially Available / Fully Available), tracked with a live progress bar. Can submit once ≥70% answered.
3. **Instant Report** — Immediately redirected to their personalized report:
   - Overall maturity score and level.
   - Top 3 risk modules with plain-language business impact.
   - Toggle to a visual "maturity constellation" radar view.
4. **Convert to Pipeline** — From the report, the persona can **Book a Demo** / **Book a consulting call** (shows a confirmation) or **Download report** — these actions are exactly what flips their status to `Outreach Sent`/`Report Viewed` on the admin side, closing the loop back into Flow A.

### Feature-to-Screen Map

| Feature | Where it lives |
|---|---|
| Bulk upload + AI row validation | Bulk Dispatch |
| Tokenized link generation | Bulk Dispatch → Generate Campaign |
| Funnel stage tracking | Campaign Detail, Assessment Tracker |
| Cross-campaign filtering | Assessment Tracker |
| Kanban deal-stage view | Sales Pipeline |
| Full contact diagnostic | Account 360 (drawer, any screen) |
| Persona-curated questions | Assessment Experience (`/assess/:persona`) |
| Scoring + maturity level | Report Detail (admin + persona view) |
| Visual radar/risk chart | Report Detail → Visualization toggle |
| Multi-channel outreach drafting | Outreach Builder |
| Auto-generated sales deck | PPT Deck Builder |
| Completed-assessment shortcut list | Completed Reports |
| BDR ownership switching | Admin sidebar |
| Link expiry / branding controls | Settings |

---

## Current Status

| Layer | Status |
|---|---|
| UI / UX (admin + persona-facing) | ✅ Built and demoable |
| Assessment logic & scoring | ✅ Built (rule-based) |
| Campaign/funnel tracking | ✅ Built (in-memory demo data) |
| Real AI scoring/content generation | ⏳ Not yet — currently simulated |
| Email / LinkedIn / WhatsApp sending | ⏳ Not yet — currently simulated |
| Persistent database | ⏳ Not yet — data resets on refresh |
| Notifications | ⏳ Not yet — UI shell only |

The prototype demonstrates the full intended user experience end-to-end. The next phase is wiring up real AI, messaging integrations, and a database so it operates as a live product rather than a demo.

