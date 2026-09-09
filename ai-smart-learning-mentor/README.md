# 🎓 AI Smart Learning Mentor

A personalized, AI-powered learning platform built for a college hackathon/project review.
**100% frontend** — React + Vite + Material UI + Recharts + Browser LocalStorage.
No backend, no database server, no Flask/FastAPI/Firebase/MongoDB — everything runs in the browser.

---

## 1. Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Framework      | React 18 + Vite                     |
| UI Library     | Material UI (MUI) v6                |
| Routing        | React Router v6                     |
| Charts         | Recharts                            |
| Data storage   | Browser LocalStorage (no backend)   |
| AI (optional)  | Gemini API, with a built-in offline mock AI fallback |

---

## 2. Folder Structure

```
ai-smart-learning-mentor/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── ProgressCard.jsx
│   │   └── EmptyState.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AIMentor.jsx
│   │   ├── AdaptiveQuiz.jsx
│   │   ├── WeakTopics.jsx
│   │   ├── Recommendations.jsx
│   │   ├── StudyPlan.jsx
│   │   ├── Progress.jsx
│   │   └── Profile.jsx
│   ├── services/
│   │   └── aiService.js        (Gemini API + offline mock AI, all in one place)
│   ├── utils/
│   │   ├── storage.js          (LocalStorage helper functions)
│   │   └── analytics.js        (all dashboard statistics, calculated live)
│   ├── data/
│   │   └── quizData.js         (6 topics × 6 questions each, 3 difficulty levels)
│   ├── App.jsx
│   ├── main.jsx
│   ├── theme.js
│   └── index.css
├── package.json
├── vite.config.js
├── index.html
└── .env.example
```

---

## 3. Installation & Run Instructions

**Requirements:** Node.js 18+ and npm.

```bash
# 1. Move into the project folder
cd ai-smart-learning-mentor

# 2. Install dependencies
npm install

# 3. (Optional) Add a Gemini API key for live AI answers
cp .env.example .env
# then edit .env and set: VITE_GEMINI_API_KEY=your_key_here
# If you skip this step, the app automatically uses its built-in
# offline AI response system — nothing breaks.

# 4. Run the app
npm run dev
```

Then open the printed local URL (usually **http://localhost:5173**) in your browser.

To build a production bundle:
```bash
npm run build
npm run preview
```

No backend server, database, or extra service needs to be started. Everything — the "database" included — runs entirely inside the browser via LocalStorage.

---

## 4. How Data Persistence Works

All app data is stored under these LocalStorage keys (see `src/utils/storage.js`):

- `studentProfile` — name & learning level
- `quizResults` — every quiz attempt (score, topic, difficulty breakdown, date)
- `topicPerformance` — derived on the fly from quizResults (not stored redundantly)
- `completedTopics` — derived on the fly
- `studyPlan` — the current generated day-by-day plan and its task statuses
- `recentDoubts` — AI Mentor Q&A history
- `recommendations` — the last generated personalized recommendations
- `learningProgress` — reserved for future extension

Refreshing the browser does **not** erase any data — LocalStorage persists until the user clears their browser storage.

To reset the whole demo (e.g., before presenting), open the browser console and run:
```js
localStorage.clear()
```
then refresh the page — you'll be taken back to the Login screen.

---

## 5. Feature-by-Feature Testing Guide

### ✅ Login / Profile creation
1. Open the app — you should land on the Login screen.
2. Enter a name, pick a learning level, click **Start Learning**.
3. You should land on the Dashboard, and the sidebar/navbar should appear.
4. Refresh the browser — you should stay logged in (data persisted).

### ✅ Dashboard
- Initially (no quizzes yet) it shows 0% progress, 0 avg score, and an empty-state chart with a "Take a Quiz" button.
- After completing quizzes, all 4 stat cards and the line chart update automatically — nothing is hardcoded.

### ✅ AI Mentor
1. Go to **AI Mentor**.
2. Without a Gemini key configured, you'll see a blue info banner confirming offline mode.
3. Type: `Explain normalization in DBMS`, pick a level, click **Ask AI Mentor**.
4. You'll get a structured response: Simple Explanation → Example → Key Points → Quick Check.
5. Scroll down — your question appears under "Recent Doubts" and persists after refresh.
6. Try other keywords: React, JavaScript, Python, Computer Networks, Data Structures — each has a tailored built-in response per level.

### ✅ Adaptive Quiz
1. Go to **Adaptive Quiz**, pick a topic (e.g., DBMS).
2. Answer all 5 questions (Next / Finish Quiz).
3. See your results: score %, adaptive feedback message (based on the score-band logic), and a full question review with explanations.
4. Retake the same topic — notice the "Next: … difficulty" chip on the topic card updates based on your last score (below 50% → easy, 50–79% → medium, 80–100% → hard).

### ✅ Weak Topics
- After a few quiz attempts across topics, this page auto-classifies each topic as **Weak / Needs Practice / Strong**, with progress bars and a horizontal bar chart.
- With zero attempts, a friendly empty state is shown instead of blank charts.

### ✅ Recommendations
- Auto-generates a card per weak topic with a reason, difficulty badge, and 4 concrete next actions, pulled dynamically from quiz performance.

### ✅ Study Plan
1. Pick a goal (e.g., "Improve DBMS"), duration (7 Days), daily time (1 hour).
2. Click **Generate Study Plan** — a day-by-day plan appears as cards.
3. Click any day card to cycle its status: Not Started → In Progress → Completed.
4. The completion % bar at the top updates live and persists after refresh.

### ✅ Progress
- Shows Overall Learning Completion, Study Plan Completion, and Learning Activity stat cards, plus a score-over-time line chart and a topic bar chart — all computed from LocalStorage.

### ✅ Profile
- Shows name, level, topics attempted, average score, completed topics.
- Change the learning level and click **Save Changes** — it updates instantly and persists.

### ✅ Resilience checks (should never crash)
- Fresh browser / empty LocalStorage → every page shows a friendly empty state, not an error.
- No Gemini API key → AI Mentor still fully works via the offline mock system.
- Rapidly clicking through pages / refreshing mid-quiz → app recovers gracefully (state simply resets to selection screen).

---


1. **Login** → enter your name, select "Beginner".
2. **Dashboard** → point out it's empty right now (0% everywhere) — nothing is faked.
3. **AI Mentor** → ask *"Explain normalization in DBMS"* → walk through the 4-part structured response.
4. **Adaptive Quiz** → take the **DBMS** quiz, deliberately get a few wrong → show the low score and the "fundamentals need improvement" feedback.
5. **Weak Topics** → show DBMS now flagged as Weak/Needs Practice with a red/orange bar.
6. **Recommendations** → show the auto-generated DBMS recommendation card ("Revise Normalization and SQL...").
7. **Study Plan** → generate a 7-Day "Improve DBMS" plan, mark Day 1 as Completed.
8. **Progress** → show the dashboard/progress numbers have all updated live.
9. **Refresh the browser** → prove everything persisted with zero backend.

---