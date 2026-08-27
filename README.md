# 一日 (Ichinichi) — Japanese N5 Study App

A structured **20-minute Japanese study planner** for JLPT N5. Open the app, see today’s lesson, tap Start, and learn — no decision fatigue.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Core loop

1. Home recommends today’s lesson from the curriculum engine  
2. Start a ~20-minute multi-phase lesson (Review → Learn → Practice → Recall → Quiz)  
3. Exercises update mastery + spaced-repetition schedules  
4. Completion screen → continue curriculum, review, or practice weak areas  

Progress: guests use `localStorage`. Logged-in users sync the same `UserState` to InsForge (`user_progress` table). Optional account via `/auth`.

Copy `.env.example` to `.env.local` and fill InsForge URL + anon key.

## Architecture

| Layer | Role | Location |
|-------|------|----------|
| **Curriculum** | What should eventually be learned | `src/curriculum/` |
| **Learning engine** | What this user should do next | `src/engine/` |
| **Lesson generator** | How to teach it in 20 minutes | `src/lessons/` |
| **AI seam** | Optional enrichments (Phase 3) | `src/ai/lessonService.ts` |

AI must not invent the curriculum — only explanations/variations inside fixed concepts.

## Screens

- `/` — Today’s lesson + progress snapshot  
- `/lesson` — Distraction-free lesson player + completion  
- `/curriculum` — N5 roadmap with prerequisites  
- `/progress` — Mastery metrics, weak/strong areas, daily goal  

## Seed content

Hiragana & katakana, core N5 vocabulary, grammar points (です → past tense → adjectives), beginner kanji, and a full prerequisite-linked concept path from foundations through integration.
