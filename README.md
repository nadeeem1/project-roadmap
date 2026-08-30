# Taskify — Project & Task Management Dashboard

A full-featured project and task management dashboard for managing freelance work,
built as a portfolio piece. Light and dark themes, persistent data, and rich
filtering — all client-side.

> **Repository:** https://github.com/nadeeem1/project-roadmap
>
> **Live demo:** https://nadeeem1.github.io/project-roadmap

---

## Tech stack

| Layer     | Choice                                         |
| --------- | ---------------------------------------------- |
| Framework | React 19 + TypeScript + Vite                   |
| Styling   | Tailwind CSS v4                                |
| State     | Zustand with `persist` (localStorage)          |
| Routing   | React Router v7                                |
| Icons     | Lucide React                                   |

## Features

- **Dashboard** — overview metrics and quick stats
- **Projects** — manage projects with colors, tags, status (`active`,
  `on_hold`, `completed`, `archived`) and due dates
- **Tasks** — full CRUD with priorities (`low → critical`), statuses
  (`todo → done`), due dates, tags, and inline subtasks
- **Filtering & sorting** — search, status, priority, project, sort field and
  direction
- **Analytics** — progress breakdown of your work
- **Local persistence** — every change survives a refresh via Zustand `persist`
- **Dark / light theme** toggle
- **Toast notifications** for every action
- **Responsive** layout with collapsible sidebar

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## License

MIT — free to use as a starter for real client work.