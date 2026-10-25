import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette matching SMRITARA Warm Ivory Contemporary Theme
    BG_COLOR = RGBColor(250, 249, 246)       # #FAF9F6
    CARD_BG = RGBColor(255, 255, 255)        # #FFFFFF
    CARD_BORDER = RGBColor(230, 227, 218)    # #E6E3DA
    PRIMARY = RGBColor(40, 84, 67)           # #285443 (Forest Pine)
    PRIMARY_LIGHT = RGBColor(65, 117, 97)    # #417561
    SUBTLE_BG = RGBColor(237, 243, 240)      # #EDF3F0
    TEXT_MAIN = RGBColor(28, 34, 30)         # #1C221E
    TEXT_MUTED = RGBColor(114, 127, 119)     # #727F77
    ACCENT_TERRACOTTA = RGBColor(192, 92, 60)# #C05C3C
    ACCENT_TEAL = RGBColor(30, 112, 101)     # #1E7065
    ACCENT_AMBER = RGBColor(198, 128, 25)    # #C68019

    blank_layout = prs.slide_layouts[6]

    def add_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()

    def add_header(slide, title_text, category_text="SMRITARA 3.1"):
        # Header Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(2.2), Inches(0.35))
        badge.fill.solid()
        badge.fill.fore_color.rgb = SUBTLE_BG
        badge.line.color.rgb = PRIMARY_LIGHT
        badge.line.width = Pt(1)
        tf = badge.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = category_text.upper()
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = PRIMARY
        p.alignment = PP_ALIGN.CENTER

        # Slide Title
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.95), Inches(11.5), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN

    def add_card(slide, left, top, width, height, title, items, badge_text=None, accent_color=PRIMARY):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1.2)

        tb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.2), Inches(width - 0.5), Inches(height - 0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = title
        p0.font.size = Pt(16)
        p0.font.bold = True
        p0.font.color.rgb = accent_color
        p0.space_after = Pt(10)

        for item in items:
            p = tf.add_paragraph()
            p.text = "• " + item
            p.font.size = Pt(12)
            p.font.color.rgb = TEXT_MAIN
            p.space_after = Pt(6)

    # =========================================================================
    # SLIDE 1: Title Slide
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_background(s1)

    # Hero Card Container
    hero = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.2), Inches(10.933), Inches(5.1))
    hero.fill.solid()
    hero.fill.fore_color.rgb = CARD_BG
    hero.line.color.rgb = CARD_BORDER
    hero.line.width = Pt(1.5)

    tb1 = s1.shapes.add_textbox(Inches(1.8), Inches(1.8), Inches(9.7), Inches(3.8))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "SMRITARA"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = PRIMARY
    p.space_after = Pt(4)

    p2 = tf1.add_paragraph()
    p2.text = "Personal Growth and Cognitive Wellness Platform"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_MAIN
    p2.space_after = Pt(14)

    p3 = tf1.add_paragraph()
    p3.text = "Integrating Circadian Alertness, Mnemonic Memory Gym, Cultural Literature Recitation, Synchronized Breathwork, and Grounded AI Coaching."
    p3.font.size = Pt(14)
    p3.font.color.rgb = TEXT_MUTED
    p3.space_after = Pt(28)

    p4 = tf1.add_paragraph()
    p4.text = "Architecture & Production Release 3.1  |  Supabase Cloud + Google Gemini  |  Pair-Programming Demonstration"
    p4.font.size = Pt(11)
    p4.font.bold = True
    p4.font.color.rgb = ACCENT_TEAL

    # =========================================================================
    # SLIDE 2: Problem Statement
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_background(s2)
    add_header(s2, "Problem Statement: Digital Fragmentation & Shallow Attention")

    add_card(s2, 0.8, 1.8, 3.6, 5.0, "Attention & Memory Decay", [
        "Continuous digital context-switching impairs working-memory retention and cognitive stamina.",
        "Mnemonic recall techniques (associative chunking, visual loci) are rarely practiced in daily life.",
        "Superficial screen consumption replaces deep reflective contemplation."
    ], accent_color=ACCENT_TERRACOTTA)

    add_card(s2, 4.8, 1.8, 3.6, 5.0, "Tool Fragmentation", [
        "Users juggle isolated apps: one for habits, one for meditation, another for games, none integrated.",
        "No unified feedback loop connecting sleep habits to next-day focus or recall efficiency.",
        "Cultural literature & linguistic heritage are disconnected from modern wellness software."
    ], accent_color=PRIMARY)

    add_card(s2, 8.8, 1.8, 3.6, 5.0, "Superficial Metrics & AI", [
        "Punitive streaks and aggressive gamification induce guilt rather than sustainable self-discipline.",
        "Generic chatbot apps hallucinate facts or make unwarranted clinical diagnostic claims.",
        "Aggressive cloud telemetry compromises personal reflection and sleep logs."
    ], accent_color=ACCENT_AMBER)

    # =========================================================================
    # SLIDE 3: Why It Matters
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_background(s3)
    add_header(s3, "Why It Matters: Bridging Timeless Practice & Modern Life")

    add_card(s3, 0.8, 1.8, 5.6, 5.0, "The Value of Ancient Cognitive Culture", [
        "Classical Sanskrit shlokas and Telugu metered verses (Vemana, Sumati) were designed as mnemonic cognitive anchors.",
        "Auditory cadence, rhythmic recitation, and passage recall exercise executive function naturally.",
        "Restoring these traditions into contemporary software makes cultural heritage vibrant and accessible.",
        "Promotes cross-generational mindfulness and linguistic appreciation."
    ], accent_color=ACCENT_TEAL)

    add_card(s3, 6.8, 1.8, 5.6, 5.0, "The Need for Ethical Personal Growth", [
        "Students and knowledge workers need holistic self-cultivation without invasive surveillance.",
        "Factual, evidence-grounded reflection: Separating observed habits from hypotheses.",
        "Honest wellness pacing: Flexible 5-, 7-, or 10-minute micro-sessions tailored to busy schedules.",
        "Zero medical overreach: Clear distinction between self-regulation and clinical medical advice."
    ], accent_color=PRIMARY)

    # =========================================================================
    # SLIDE 4: Proposed Solution
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_background(s4)
    add_header(s4, "The Proposed Solution: SMRITARA Ecosystem")

    add_card(s4, 0.8, 1.8, 2.7, 5.0, "1. Body Clock", [
        "Circadian chronotypes (Bear, Lion, Wolf, Dolphin).",
        "Adaptive peak focus and alertness scheduling.",
        "Harmonized wind-down and sleep hygiene advice."
    ], accent_color=PRIMARY)

    add_card(s4, 3.8, 1.8, 2.7, 5.0, "2. Smriti Veda", [
        "Cognitive Memory Gym (Matrix, Sequence, Pairs).",
        "Classical literature with audible recitations.",
        "Passage recall and missing-word mastery drills."
    ], accent_color=ACCENT_TEAL)

    add_card(s4, 6.8, 1.8, 2.7, 5.0, "3. Mind Studio", [
        "8 guided breathing & meditation procedures.",
        "Synchronized visual & resonant audio cues.",
        "Gentle safety disclosures and silent modes."
    ], accent_color=ACCENT_AMBER)

    add_card(s4, 9.8, 1.8, 2.7, 5.0, "4. Grounded AI", [
        "AI Life Coach powered by Google Gemini.",
        "Grounded strictly in stored user sessions.",
        "Interactive 1-click routine proposal cards."
    ], accent_color=ACCENT_TERRACOTTA)

    # =========================================================================
    # SLIDE 5: Core Features
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_background(s5)
    add_header(s5, "Core Features: Complete Feature Walkthrough")

    add_card(s5, 0.8, 1.8, 5.6, 2.4, "Cognitive Memory Gym", [
        "Interactive drills: Sequence recall, 2D matrix memory, card pairs.",
        "Real-time accuracy scoring, attempt auditing, and difficulty scaling."
    ], accent_color=PRIMARY)

    add_card(s5, 6.8, 1.8, 5.6, 2.4, "Audible Cultural Library", [
        "Classical Sanskrit shlokas, Telugu poetry, and English Stoic passages.",
        "Audible speech recitations with speed controls (0.85x, 1.0x, 1.2x)."
    ], accent_color=ACCENT_TEAL)

    add_card(s5, 0.8, 4.4, 5.6, 2.4, "Mindfulness & Breathwork", [
        "8 procedures: Box, Slow Balanced, Metta, Body Scan, Grounding, Silent.",
        "Synchronized phase chime cues with on-screen mute control."
    ], accent_color=ACCENT_AMBER)

    add_card(s5, 6.8, 4.4, 5.6, 2.4, "1,020+ Daily Wisdom Tips", [
        "Massive curated dataset across 10 ethical philosophy categories.",
        "Rotating wisdom of the day with bookmarking and cloud persistence."
    ], accent_color=ACCENT_TERRACOTTA)

    # =========================================================================
    # SLIDE 6: System Architecture
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_background(s6)
    add_header(s6, "System Architecture: Secure Full-Stack Prototype")

    add_card(s6, 0.8, 1.8, 3.6, 5.0, "Frontend Layer", [
        "React 19 + TypeScript + Vite 8.",
        "Vanilla CSS Design System with warm ivory aesthetic (#FAF9F6).",
        "Responsive sidebar & view routing across 8 modules.",
        "Web Speech API for multilingual voice input (EN, HI, TE).",
        "Web Audio API for resonant synthesized frequency cues."
    ], accent_color=PRIMARY)

    add_card(s6, 4.8, 1.8, 3.6, 5.0, "Serverless API & AI", [
        "Vercel Edge Serverless Function (/api/coach).",
        "Vite development proxy middleware for local execution.",
        "Server-side GEMINI_API_KEY protection (zero client exposure).",
        "Fast model routing: gemini-3.5-flash-lite (<1.0s latency).",
        "Resilient model fallback array and schema parsing."
    ], accent_color=ACCENT_TEAL)

    add_card(s6, 8.8, 1.8, 3.6, 5.0, "Cloud Auth & Database", [
        "Supabase Auth: Email/password registration, login, password reset.",
        "PostgreSQL schema with 5 relational core tables.",
        "Row Level Security (RLS) enforcing strict user-data isolation.",
        "Cross-device sync and automatic offline/demo fallback.",
        "1-click guest to authenticated data migration."
    ], accent_color=ACCENT_TERRACOTTA)

    # =========================================================================
    # SLIDE 7: AI and Personalization
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_background(s7)
    add_header(s7, "AI Life Coach: Grounded Synthesis & Safety")

    add_card(s7, 0.8, 1.8, 5.6, 5.0, "Grounded Data Ingestion", [
        "User Context Injection: Incorporates chronotype, sleep targets, logged habits, and drill performance.",
        "Multi-Turn Context: Remembers user constraints (e.g. 'I only have 10 minutes today') across conversations.",
        "No Hallucinations: Prompt explicitly instructs the model to state facts only from stored records.",
        "Practical Guidance: Suggests micro-routines, breathing pauses, and memory recall techniques."
    ], accent_color=PRIMARY)

    add_card(s7, 6.8, 1.8, 5.6, 5.0, "Safety Guardrails & Usability", [
        "Medical Disclaimer: Clear notice that suggestions are for self-cultivation, not clinical diagnosis.",
        "Interactive Actions: Generates structured [ACTION] JSON blocks for 1-click routine approvals.",
        "Audio Read-Aloud: Text-to-speech option on every coach message.",
        "Copy & Retry Actions: 1-click response copying and graceful retry handling on error states."
    ], accent_color=ACCENT_TERRACOTTA)

    # =========================================================================
    # SLIDE 8: Progress and Privacy
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_background(s8)
    add_header(s8, "Progress & Privacy: Ethical Measurement")

    add_card(s8, 0.8, 1.8, 5.6, 5.0, "Factual Progress Comparisons", [
        "Transparent comparative logic: 'Recalled 8 items today, compared with 6 on Oct 24 (+2)'.",
        "Duration benchmarking: 'Completed 5 minutes of box breathing, matching your previous session'.",
        "Baseline establishment notice on first recorded attempt.",
        "Zero misleading health claims or medical cognitive improvements."
    ], accent_color=PRIMARY)

    add_card(s8, 6.8, 1.8, 5.6, 5.0, "Account Isolation & Data Portability", [
        "Supabase Row Level Security (RLS) ensures zero data leakage between distinct accounts.",
        "Demo Sandbox separation: Guest and demo sessions stay strictly isolated from registered accounts.",
        "Complete JSON Backup: Export and import complete personal logs, habits, and schedules at any time.",
        "Confidentiality: Practice records stored with strict authorization policies."
    ], accent_color=ACCENT_TEAL)

    # =========================================================================
    # SLIDE 9: Live Demo Walkthrough
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_background(s9)
    add_header(s9, "Live Demo Walkthrough: 8-Step Verification")

    add_card(s9, 0.8, 1.8, 5.6, 5.0, "Demonstration Sequence (Part 1)", [
        "1. Welcome View: Brand identity, warm ivory light theme, and 4 pillars overview.",
        "2. Auth Modal: Real registration, login, password recovery, or 1-click Demo Sandbox.",
        "3. Personalized Dashboard: Practice pacing (5/7/10 mins), daily wisdom tip, and suggested routines.",
        "4. Cognitive Memory Gym: Complete interactive sequence/matrix drill and generate verified score."
    ], accent_color=PRIMARY)

    add_card(s9, 6.8, 1.8, 5.6, 5.0, "Demonstration Sequence (Part 2)", [
        "5. Cultural Library: Audible recitation of Sanskrit shlokas and Telugu verses with speed controls.",
        "6. Mindfulness Studio: Box breathing with synchronized audio chimes and mute toggle.",
        "7. AI Life Coach: Ask real questions via keyboard or voice microphone, receive grounded Gemini answers.",
        "8. Progress Audit: View verified session log, factual comparison against baseline, and milestones."
    ], accent_color=ACCENT_AMBER)

    # =========================================================================
    # SLIDE 10: Testing and Results
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_background(s10)
    add_header(s10, "Testing & Acceptance Results: 100% Pass Rate")

    add_card(s10, 0.8, 1.8, 3.6, 5.0, "E2E Automated Suite", [
        "21 comprehensive Puppeteer browser tests executed.",
        "100% pass rate (21/21 passed, 0 failed).",
        "Verified light theme, buttons, SVG brand mark, audio transitions, and voice input states."
    ], accent_color=PRIMARY)

    add_card(s10, 4.8, 1.8, 3.6, 5.0, "Live AI Coach Verification", [
        "3/3 live questions verified via server proxy (/api/coach).",
        "Sub-second response time with gemini-3.5-flash-lite.",
        "Dual payload parsing: handles both raw candidates and formatted reply.",
        "Graceful retry and error handling."
    ], accent_color=ACCENT_TEAL)

    add_card(s10, 8.8, 1.8, 3.6, 5.0, "Security & Build Audit", [
        "TypeScript compilation: tsc -b passed with zero errors.",
        "Vite production build: dist assets bundled in 1.88s.",
        "Bundle audit: 0 leaked secrets or VITE_ keys in client JS.",
        "PostgreSQL RLS policies enabled on all tables."
    ], accent_color=ACCENT_TERRACOTTA)

    # =========================================================================
    # SLIDE 11: Limitations and Future Improvements
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_background(s11)
    add_header(s11, "Limitations & Future Roadmap")

    add_card(s11, 0.8, 1.8, 5.6, 5.0, "Current Prototype Constraints", [
        "Speech Recognition: Dependent on browser Web Speech API (best in Chrome/Edge).",
        "Network Dependency: AI Life Coach requires active connection to server proxy.",
        "Web Application: Responsive across desktop and tablet; native iOS/Android wrappers not yet packaged.",
        "Audio Recitations: Utilizes browser speech synthesis engine where licensed studio recordings are unavailable."
    ], accent_color=ACCENT_TERRACOTTA)

    add_card(s11, 6.8, 1.8, 5.6, 5.0, "Future Planned Enhancements", [
        "Native Mobile Apps: React Native / Capacitor packaging with offline local audio caching.",
        "Expanded Literary Catalog: Adding Kannada, Tamil, and Bengali philosophical poetry collections.",
        "Local On-Device LLM: Integrating WebLLM for private, offline AI coaching without server requests.",
        "Biometric Sync: Optional opt-in sync with smart wearables (Apple HealthKit, Google Fit)."
    ], accent_color=PRIMARY)

    # =========================================================================
    # SLIDE 12: Conclusion
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_background(s12)
    add_header(s12, "Conclusion: SMRITARA 3.1 Prototype Summary")

    hero12 = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.8), Inches(10.933), Inches(4.8))
    hero12.fill.solid()
    hero12.fill.fore_color.rgb = CARD_BG
    hero12.line.color.rgb = CARD_BORDER
    hero12.line.width = Pt(1.5)

    tb12 = s12.shapes.add_textbox(Inches(1.8), Inches(2.2), Inches(9.7), Inches(3.8))
    tf12 = tb12.text_frame
    tf12.word_wrap = True

    p = tf12.paragraphs[0]
    p.text = "A Working, Secure, Deployable Cognitive Wellness Platform"
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = PRIMARY
    p.space_after = Pt(14)

    p2 = tf12.add_paragraph()
    p2.text = "• AI Life Coach is Fully Repaired: Live, sub-second Gemini responses via secure server-side proxy with zero leaked secrets.\n• Cloud Persistence & Authentication: Supabase Auth + PostgreSQL with Row Level Security for cross-browser, multi-device reliability.\n• Audible Smriti Veda & Mind Studio: Honest audio classifications, speed pacing, synchronized breathwork chimes, and multilingual voice.\n• Ethical Progress Engine: Factual comparative baselines, verified session audit logs, and full JSON data portability."
    p2.font.size = Pt(14)
    p2.font.color.rgb = TEXT_MAIN
    p2.space_after = Pt(20)

    p3 = tf12.add_paragraph()
    p3.text = "Thank you! SMRITARA is ready for live demonstration and evaluator review."
    p3.font.size = Pt(15)
    p3.font.bold = True
    p3.font.color.rgb = ACCENT_TEAL

    output_path = os.path.join(r"D:\SMRITARA", "SMRITARA_Project_Presentation.pptx")
    prs.save(output_path)
    print(f"[SUCCESS] Successfully created presentation: {output_path}")

if __name__ == "__main__":
    create_presentation()
