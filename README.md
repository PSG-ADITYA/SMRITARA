# SMRITARA

> **"Understand yourself. Train your mind. Become who you intend to be."**  
> *Hackathon Theme: Beyond the Screen: Build for a Smarter, More Inclusive Future.*

SMRITARA is a personal growth operating system that synthesizes five key disciplines into an integrated personal development experience:

```
                  ┌───────────────────────────────┐
                  │    1. BODY CLOCK (CIRCADIAN)  │
                  └──────────────┬────────────────┘
                                 │
  ┌──────────────────────────────┼──────────────────────────────┐
  │                              │                              │
┌─▼──────────────────┐  ┌────────▼───────────┐  ┌───────────────▼─┐
│ 2. DISCIPLINE OS   │  │ 3. MEMORY GYM      │  │ 4. MINDFULNESS  │
│ Habits, Focus, Sleep│  │ Spatial & Cognitive│  │ Respiration & Calm│
└─┬──────────────────┘  └────────┬───────────┘  └───────────────┬─┘
  │                              │                              │
  └──────────────────────────────┼──────────────────────────────┘
                                 │
                  ┌──────────────▼────────────────┐
                  │ 5. DATA-GROUNDED AI COACH     │
                  │   + PERSONAL PATTERN ENGINE   │
                  └───────────────────────────────┘
```

The central innovation is the **Personal Growth Feedback Loop**:
$$\text{ASSESS} \longrightarrow \text{PLAN} \longrightarrow \text{ACT} \longrightarrow \text{OBSERVE} \longrightarrow \text{ANALYZE} \longrightarrow \text{ADAPT} \longrightarrow \text{REVIEW}$$

---

## 🌟 The Five Modules

### 1. Body Clock (Circadian Assessment & Schedule Engine)
* **Free Chronotype Questionnaire**: Evaluates subjective morningness-eveningness (Lion, Bear, Wolf, Dolphin) based on natural wake/sleep preferences, social jetlag, alertness peaks, and real-world commitments (e.g., morning college/work).
* **Adaptive Daily Routine**: Generates a synchronized daily schedule with editable blocks, deep-work focus windows, and wind-down rituals.
* **Ethical Transparency**: Clarifies that assessments estimate circadian preferences, not clinical sleep phase diagnoses.

### 2. Discipline OS
* **Habit Portfolio**: Real-time tracking of both positive constructive habits and negative impulse avoidance.
* **Interactive Deep-Work Focus Timer**: Adjustable sprint durations (15m, 25m, 45m, 60m) with task tagging and session history.
* **Transparent Discipline Score (0–100)**: Calculated deterministically from Sleep Alignment (20 pts), Screen Time (20 pts), and Habit Completion (60 pts).
* **Streaks & Activity Logs**: Grace-period consecutive day tracking with comprehensive daily reflection logs.

### 3. Memory Gym (Inspired by Smriti Veda)
* **Spatial Matrix Memory**: Grid recall challenge engaging spatial working memory with 3-second exposure countdowns.
* **Chime Sequence Recall**: Visual-rhythmic sequence memory testing sequential working memory.
* **Cultural Passage Recall**: Verbal comprehension and retention exercises using philosophical proverbs (Thirukkural, Katha Upanishad, Marcus Aurelius) with blank-retrieval challenges.
* **Deterministic Scoring**: Exact accuracy percentages, reaction timing, and session logs without unneeded AI hallucination.

### 4. Mindfulness Studio
* **Responsive Breathing Animations**: Interactive expanding/contracting visual guides for Box Breathing (4-4-4-4), 4-7-8 Relaxing Breath, Heart Coherence (5.5s pace), and Extended Exhale.
* **Stillness Meditation Timer**: Timed silent contemplation sessions.
* **Pre- & Post-Session Mood Check-in**: Quantifies parasympathetic shift with reflection notes.

### 5. AI Life Coach & Personal Pattern Engine
* **Data-Grounded Intelligence**: Analyzes real user records (sleep duration, habit rates, focus time, memory scores) without fabricating history.
* **Action Approval Workflow**: Proposes concrete application adjustments (e.g., adding habits, aligning schedules) that execute only upon explicit user approval.
* **Personal Pattern Engine**: Uncovers statistical relationships across modules (e.g., Sleep Duration vs. Subjective Energy, Habit Adherence vs. Mood, Breathwork vs. Productivity).
* **Offline Fallback Engine**: Fully functional analytical rules even when offline or when no Gemini API key is configured.

---

## 🛠️ Technology Stack

* **Frontend**: React 19 + TypeScript + Vite
* **Styling**: Vanilla CSS design system with custom dark-mode tokens, accessible contrast, and micro-animations
* **Icons & Feedback**: Lucide React + Canvas Confetti
* **AI Model**: Google Gemini 2.5 Flash via REST API (with automatic fallback to Gemini 1.5 Flash and offline rule engine)
* **Local Persistence**: Client-side LocalStorage architecture ensuring complete data privacy and offline readiness

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+ (tested on Node v24)
* npm v9+

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/PSG-ADITYA/SMRITARA.git
cd SMRITARA

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

### Hackathon Demo Quick-Start
Click the **"Demo Data"** button in the sidebar to populate 7 days of realistic sleep, habit, focus, and memory records to immediately demonstrate the Personal Pattern Engine and AI Life Coach.

---

## 🔒 Data Privacy & Integrity
* All personal data is stored locally in your browser.
* No microphone, camera, contacts, or location permissions are requested.
* Gemini API keys are entered locally and never exposed in public repositories.
