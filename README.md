# Study Leveling

A gamified student portal that turns university life into an RPG. Earn XP, level up, climb the leaderboard, and compete with classmates, all while staying on top of your studies.

---

## Features

- **XP & Leveling System** — Complete tasks and Moodle quizzes to earn XP and level up your student profile
- **Live Leaderboard** — Real-time rankings powered by Supabase, with podium animations and trend badges
- **Taskboard** — Manage academic tasks, submit completions, and add custom tasks with configurable XP rewards
- **Moodle Integration Demo** — A simulated Moodle quiz that awards XP directly to your leaderboard profile on submission
- **Social / Group Chat** — Real-time class chat with AI-powered friends (Sarah, Marcus, Priya, Alex) who respond naturally using Claude
- **Character Creator** — Pixel-art avatar builder with outfit customisation and a walk-off animation on completion
- **Student Profile** — Editable degree, field of study, GPA, and unit quick-links (Ed, Moodle, OnTrack)
- **Assessments Calendar** — Upcoming assessment tracker with progress bars and a March 2026 calendar view
- **Notifications** — Activity feed for XP gains, messages, and deadlines
- **Authentication** — Full email/password auth via Supabase with email confirmation flow

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Backend / Auth | Supabase (Postgres + Realtime + Auth) |
| Routing | React Router v7 |
| Animation | Motion (Framer Motion) |
| AI (Chat) | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Charts | Recharts |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- A [Supabase](https://supabase.com) project

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd study-leveling

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## Database Setup

The following tables are required in your Supabase project:

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | References `auth.users` |
| `name` | text | Display name |
| `degree` | text | e.g. Bachelor of Computer Science |
| `field_of_study` | text | e.g. Artificial Intelligence |
| `xp` | integer | Default 0 |
| `level` | integer | Default 1 |
| `tasks_completed` | integer | Default 0 |

### `completed_tasks`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Auto-generated |
| `user_id` | uuid | References `profiles.id` |
| `task_id` | integer | Task identifier |
| `xp_gained` | integer | XP awarded for this completion |

### `messages`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Auto-generated |
| `user_id` | uuid | References `profiles.id` |
| `user_name` | text | Denormalised display name |
| `content` | text | Message body |
| `created_at` | timestamptz | Auto-set |

> **Tip:** Enable Row-Level Security and Realtime on the `profiles` and `messages` tables for full functionality. For local development, you can disable email confirmation under Authentication → Providers → Email in your Supabase dashboard.

---

## Project Structure

```
src/
├── app/
│   ├── components/       # Page and UI components
│   │   ├── ui/           # shadcn/ui base components
│   │   └── ...           # Feature pages (Portal, Taskboard, Leaderboard, etc.)
│   ├── contexts/         # React Context (User, Character)
│   └── routes.tsx        # React Router configuration
├── assets/               # Static assets (character placeholder SVG)
├── styles/               # Global CSS, Tailwind config, theme variables
├── supabaseClient.ts     # Supabase client initialisation
└── main.tsx              # App entry point
```

---

## AI Features

The **Social** page uses the Anthropic Claude API to power four AI student personas (Sarah, Marcus, Priya, Alex). Each persona has a distinct personality and responds to user messages in real time, simulating a university group chat.

The **Moodle Demo** page awards XP to your leaderboard profile when you complete the quiz, demonstrating how a real LMS integration could work.

---

## Attributions

- UI components from [shadcn/ui](https://ui.shadcn.com/) — MIT License
- Photos from [Unsplash](https://unsplash.com) — Unsplash License
