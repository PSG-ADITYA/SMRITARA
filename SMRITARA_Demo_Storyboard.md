# SMRITARA 3.1 — Video Demonstration Storyboard
**Format:** Screen Recording + Voiceover  
**Target Resolution:** 1920 × 1080 (1080p, 60fps)  
**Total Running Time:** 3 minutes 45 seconds – 4 minutes 30 seconds  

---

## Storyboard Overview Table

| Scene # | Scene Title | Approximate Timestamp | Key Visual Framing | Primary Interactive Action | Sound / Audio Track |
|---|---|---|---|---|---|
| **01** | **Landing & Brand Mark** | 0:00 – 0:30 (30s) | Full widescreen Welcome View, geometric SVG mark, 4 pillars grid | Smooth scroll down to pillars and privacy notice | Clean narration, subtle studio silence |
| **02** | **Cloud Authentication** | 0:30 – 0:55 (25s) | Centered Auth Modal with tabs for Sign In, Sign Up, and Demo Sandbox | Input test credentials or click "Explore Demo Sandbox" | Mouse click click sound, narration |
| **03** | **Adaptive Dashboard** | 0:55 – 1:25 (30s) | Dashboard view: Chronotype badge, Daily Wisdom Card, Pacing toggles | Switch pacing 5m -> 7m -> 10m; bookmark daily tip | Narration, subtle UI feedback |
| **04** | **Cognitive Memory Drill** | 1:25 – 1:55 (30s) | Memory Gym grid, animated tile flips, timer indicator | Play sequence recall drill (3 levels), view score modal | Success bell chime upon drill completion |
| **05** | **Cultural Audible Library** | 1:55 – 2:30 (35s) | Passages grid, language pills (EN, SA, HI, TE), playback banner | Click Play on Sanskrit Shloka; toggle 1.0x to 1.2x pace | Audible speech synthesis recitation |
| **06** | **Synchronized Breathwork** | 2:30 – 3:00 (30s) | Expanding/contracting visual breathing circle, phase cues | Start Box Breathing; toggle Mute button | Resonant synthesized singing bowl chimes |
| **07** | **Live AI Life Coach** | 3:00 – 3:45 (45s) | Clean chat timeline, mic button, language selector, grounded pills | Ask question via voice/text; live Gemini answer; click "Apply Action" | Live text-to-speech reading on response |
| **08** | **Session Audit & Persistence**| 3:45 – 4:15 (30s) | Progress audit log, factual comparison card, reload page | Scroll to verified log; hard refresh page to prove cloud persistence | Narration |
| **09** | **Architecture & Outro** | 4:15 – 4:35 (20s) | System architecture diagram / summary card | Return to dashboard, show cloud status pill | Closing narration |

---

## Detailed Scene Layouts & Transitions

```
+-----------------------------------------------------------------------------+
| SCENE 01: WELCOME & FOUNDATIONAL PILLARS (0:00 - 0:30)                      |
+-----------------------------------------------------------------------------+
|  [ SMRITARA Brand Logo ]              [ Sign In ]  [ Get Started (Primary)] |
|                                                                             |
|      "Intentional Practice for Memory, Mindful Routine, and Clarity"        |
|                                                                             |
|  +--------------------+ +--------------------+ +--------------------+       |
|  | 1. Body Clock      | | 2. Smriti Veda     | | 3. Mindfulness     |       |
|  | Circadian rhythm   | | Cognitive memory   | | Synchronized breath|       |
|  +--------------------+ +--------------------+ +--------------------+       |
|                                                                             |
|  [ Disclaimer: Personal self-cultivation with zero medical diagnosis ]      |
+-----------------------------------------------------------------------------+
TRANSITION: Cursor moves to header, clicks "Sign In" / "Get Started" (Modal fades in).
```

```
+-----------------------------------------------------------------------------+
| SCENE 02: AUTH MODAL & DEMO SANDBOX (0:30 - 0:55)                           |
+-----------------------------------------------------------------------------+
|                     +-----------------------------------+                   |
|                     | [ SMRITARA Emblem ]               |                   |
|                     | Welcome Back / Create Account     |                   |
|                     | [ Cloud: Supabase Connected ]     |                   |
|                     | [ Sign In ]  [ Sign Up ]          |                   |
|                     | Email: demo.evaluator@smritara... |                   |
|                     | Password: ••••••••••••            |                   |
|                     | [ Sign In Button ]                |                   |
|                     | --------------------------------- |                   |
|                     | [ Explore Demo Sandbox (Instant) ]|                   |
|                     +-----------------------------------+                   |
+-----------------------------------------------------------------------------+
TRANSITION: Successful authentication triggers smooth dashboard transition.
```

```
+-----------------------------------------------------------------------------+
| SCENE 03 & 04: DASHBOARD & COGNITIVE MEMORY DRILLS (0:55 - 1:55)             |
+-----------------------------------------------------------------------------+
| Sidebar:          Main Content:                                             |
| [ Dashboard ]   | Header: Good Morning | Bear Chronotype | English          |
| [ Practice ]    | Pacing: [ 5 Mins ]  [ 7 Mins ]  [ 10 Mins (Active) ]      |
| [ Memory Gym ]  | Daily Tip: "Wisdom of Equanimity" [ Save Tip ]            |
| [ Library ]     |                                                           |
| [ Meditation ]  | Memory Gym Drill Screen:                                  |
| [ AI Coach ]    | [ # ] [ # ] [ # ] -> Pattern Recall -> [ 100% Accuracy ]  |
| [ Progress ]    | "Verified Session Saved to Persistent Cloud Log"          |
+-----------------------------------------------------------------------------+
TRANSITION: Sidebar navigation to Cultural Library (`CulturalLibraryView`).
```

```
+-----------------------------------------------------------------------------+
| SCENE 05 & 06: AUDIBLE LIBRARY & SYNCHRONIZED MEDITATION (1:55 - 3:00)       |
+-----------------------------------------------------------------------------+
| CULTURAL LIBRARY:                                                           |
| Filter: [ English ] [ Sanskrit ] [ Telugu ]                                 |
| Card: Gayatri Mantra (Sanskrit) [ Badge: Speech Recitation ]                |
| Controls: [ Play / Pause ] [ Stop ] [ Replay ] Pace: [0.85x] [1.0x] [1.2x]  |
|                                                                             |
| MINDFULNESS STUDIO:                                                         |
| Procedure: Box Breathing (4-4-4-4) | Audio Cues: [ Active / Mute ]          |
| Animation: (( Expanding Circle )) -> "Inhale 4s" [ Chime ] -> "Hold 4s"    |
+-----------------------------------------------------------------------------+
TRANSITION: Sidebar navigation to AI Life Coach (`AICoachView`).
```

```
+-----------------------------------------------------------------------------+
| SCENE 07: LIVE GROUNDED AI LIFE COACH (3:00 - 3:45)                         |
+-----------------------------------------------------------------------------+
| Timeline:                                                                   |
| User: "What habits should I prioritize this week?"                          |
| Coach: "Based on your Bear chronotype and recent 8.0h sleep logs..."       |
| Action Card:                                                                |
| +-------------------------------------------------------------------------+ |
| | [Sparkles] 25-Min Focused Deep Work Block                               | |
| | Schedule daily during your 10:00 AM peak alertness window.             | |
| | [ Apply to Routine (Click) ]   [ Dismiss ]                              | |
| +-------------------------------------------------------------------------+ |
| Input: [ Mic Button ] [ Language: English / हिन्दी / తెలుగు ] [ Text Input ] |
+-----------------------------------------------------------------------------+
TRANSITION: Sidebar navigation to Progress & Insights (`ProgressView`).
```

```
+-----------------------------------------------------------------------------+
| SCENE 08: PROGRESS AUDIT & PERSISTENCE VERIFICATION (3:45 - 4:15)           |
+-----------------------------------------------------------------------------+
| Header: Progress & Reflective Insights                                      |
| Cards: [ Practice Points: 145 ] [ Verified Sessions: 8 ] [ Streak: 7 Days ]  |
| Factual Comparison:                                                         |
| "You completed 8 items today, compared with 6 on Oct 24 (+2)."              |
| Verified Session Audit History Log:                                         |
| • 11:42 AM | Sequence Drill | Duration: 2m 15s | Score: 92% (Cloud Synced)  |
| • 11:38 AM | Box Breathing  | Duration: 4m 00s | Completed (Cloud Synced)   |
| [ ACTION: Page Reload (F5) -> Shows instant state restoration ]             |
+-----------------------------------------------------------------------------+
TRANSITION: Camera zooms softly to footer or architecture slide.
```

---

## Screen Recording Order & Technical Instructions
1. **Window Setup:** Open Chrome in an incognito window or clean profile at `http://localhost:5173/`.
2. **Resolution:** 1080p (1920 × 1080) at 100% zoom.
3. **Cursor:** Smooth mouse movements; do not jitter or circle items frantically.
4. **Cues & Timings:** Allow each audio recitation and breathing phase chime to sound clearly for 2–3 seconds before speaking over it.
5. **Demonstration Integrity:** Show real interactive clicks (e.g. clicking "Save Tip", clicking "Play Recitation", submitting real Gemini question).
