# SMRITARA 3.1 — Video Demonstration Script
**Project:** SMRITARA — Personal Growth and Cognitive Wellness Platform  
**Target Duration:** 3 to 4 Minutes  
**Audience:** Academic & Industry Project Evaluators, Hackathon Judges  
**Tone:** Confident, Clear, Methodical, Authentic  

---

## Pre-Recording Verification Checklist
Before pressing Record, verify:
- [ ] Dev server or production deployment is active (`http://localhost:5173/` or Vercel URL).
- [ ] Chrome browser window is clean (1280×720 or 1920×1080, bookmarks bar hidden, zoom 100%).
- [ ] Microphone is plugged in and tested (clear audio, zero background echo).
- [ ] Test user account credentials prepared: `demo.evaluator@smritara.internal` / `Smritara2026!`.
- [ ] Zero secrets, API keys, terminal `.env` strings, or personal files visible on screen.
- [ ] Browser audio output is routed cleanly for recitation and breathing chimes.

---

## Scene-by-Scene Script & Narration

### Scene 1: Introduction & Problem Context (0:00 – 0:30)
- **Visual:** Browser opens to SMRITARA Welcome Page (`http://localhost:5173/`). Cursor hovers briefly over the brand emblem and the 4 core pillars.
- **On-Screen Action:** Smooth scroll past the core pillars and ethical medical disclaimer.
- **Narration:**
  > "Hello, and welcome to this demonstration of **SMRITARA** — a personal growth and cognitive wellness platform designed to bridge timeless mnemonic traditions with modern cognitive science.
  >
  > Today, our digital lives are fragmented: we use one app for habit tracking, another for meditation, and casual games for pastimes, while our attention spans and working memory decay under constant context-switching. SMRITARA brings these disciplines together into a unified, privacy-first web application grounded in real personal records."

---

### Scene 2: Authentication & Account Isolation (0:30 – 0:55)
- **Visual:** Welcome screen header. Click **"Get Started"** or **"Sign In"**. The Auth modal appears.
- **On-Screen Action:** Fill in email and password or click **"Explore Demo Sandbox"** to show instant sandbox access. Then demonstrate signing into a registered account.
- **Narration:**
  > "To ensure data portability across multiple devices, SMRITARA implements cloud authentication and relational persistence powered by Supabase PostgreSQL with strict Row Level Security.
  >
  > Users can explore immediately in the Demo Sandbox with sample circadian data, or register an authenticated account where their practice records, memory scores, and reflections are strictly isolated to their own user ID."

---

### Scene 3: The Integrated Dashboard & Practice Pacing (0:55 – 1:25)
- **Visual:** Dashboard View (`DashboardView`).
- **On-Screen Action:** Point out user's Chronotype badge, toggle practice duration between 5, 7, and 10 minutes. Click **Save** on the Daily Wisdom Tip.
- **Narration:**
  > "Here on the Dashboard, SMRITARA adapts to the user's circadian rhythm. Notice our flexible practice duration selector: users can toggle between 5-, 7-, or 10-minute micro-sessions depending on their available focus window.
  >
  > Every day, a stable Daily Wisdom tip is curated from our dataset of over 1,000 verified philosophical passages. Users can save tips to their cloud profile with a single click."

---

### Scene 4: Cognitive Memory Gym (1:25 – 1:55)
- **Visual:** Navigate to **Cognitive Games** (`MemoryGymView`). Select Sequence Recall or 2D Matrix Recall.
- **On-Screen Action:** Click **Start Drill**. Memorize highlighted cells or pattern. Successfully recall the items. See results modal with score and accuracy.
- **Narration:**
  > "Next, let's explore the Cognitive Memory Gym. Rather than passive gaming, these drills train working memory, spatial span, and active recall.
  >
  > As the exercise concludes, the Session Progress Engine records the exact duration, items completed, and accuracy percentage. This verified session log is immediately saved to the user's persistent record."

---

### Scene 5: Audible Cultural Library — Smriti Veda (1:55 – 2:30)
- **Visual:** Navigate to **Cultural Library** (`CulturalLibraryView`).
- **On-Screen Action:** Filter by language (English / Sanskrit / Telugu). Click **Play Recitation** on Marcus Aurelius or the Gayatri Mantra. Demonstrate **Pause**, **Resume**, and speed control (0.85x, 1.0x, 1.2x).
- **Narration:**
  > "In the Cultural Library, we bring traditional memory arts to life. Classical Sanskrit shlokas and Telugu metered poetry are featured alongside universal English philosophy.
  >
  > Transparency is central: every item displays an honest audio source badge distinguishing speech recitations from original recordings. Users can listen, pause, adjust the cadence, and master rhythmic repetition for cognitive retention."

---

### Scene 6: Guided Breathwork & Sound Design (2:30 – 3:00)
- **Visual:** Navigate to **Meditation** (`MindfulnessView`). Select **Box Breathing (4-4-4-4)**.
- **On-Screen Action:** Click **Begin Practice**. Show expanding/contracting breathing circle synchronized with audio chimes. Toggle mute button on/off.
- **Narration:**
  > "The Mindfulness Studio offers 8 guided procedures, from Box Breathing to Somatic Body Scans.
  >
  > Notice how the visual breathing indicator synchronizes precisely with synthesized resonant cues for inhale, hold, and exhale phases. An on-screen mute control is always available, and the application respects reduced-motion accessibility settings."

---

### Scene 7: Live Grounded AI Life Coach (3:00 – 3:45)
- **Visual:** Navigate to **AI Life Coach** (`AICoachView`).
- **On-Screen Action:** Press Microphone button or type: *"What habits should I focus on this week based on my peak focus windows?"* Wait ~1.5s for live Gemini answer. Point out the interactive Action Proposal card and click **"Apply to Routine"**.
- **Narration:**
  > "Now, our flagship AI Life Coach. Unlike generic chatbots, SMRITARA's coach is securely proxied through our serverless endpoint using Google's high-speed Gemini 3.5 Flash Lite model. Zero API keys are ever exposed in client code.
  >
  > The coach is strictly grounded in the user's stored records: it synthesizes our chronotype, recent drill scores, and habit logs. It generates actionable proposals that can be added to the user's routine with one click, provides text-to-speech reading, and handles questions in English, Hindi, or Telugu."

---

### Scene 8: Session Progress & Cross-Device Persistence (3:45 – 4:15)
- **Visual:** Navigate to **Progress & Insights** (`ProgressView`).
- **On-Screen Action:** Show the newly saved drill session appearing in the Verified Session History log. Highlight the factual comparison: *"You recalled 8 items today, compared with 6 last time (+2)"*.
- **Demonstration:** Refresh the browser (Ctrl+R / F5). The state, scores, and active account remain completely intact.
- **Narration:**
  > "In the Progress view, SMRITARA avoids punitive streaks. Instead, it provides factual comparisons against the user's previous baseline.
  >
  > And when we refresh the browser or log in from a separate device, our sessions and milestones are instantly restored from Supabase Cloud. Full data portability is supported with 1-click JSON backup export."

---

### Scene 9: Conclusion & Architecture Wrap-Up (4:15 – 4:35)
- **Visual:** Return to Dashboard or presentation title slide.
- **Narration:**
  > "In summary, SMRITARA 3.1 is a complete, secure, deployable prototype featuring a responsive React frontend, server-side Gemini AI proxy, and cloud-isolated database persistence.
  >
  > Thank you for your time and evaluation."
