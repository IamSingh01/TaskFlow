# TaskFlow

TaskFlow is a modern React task app with a colorful dashboard, quick task creation, priority tracking, and a clean responsive board layout.

## What It Includes

- A branded TaskFlow header with a modern dashboard-style interface
- Two demo tasks on first load for a better initial state
- Task creation with title, notes, and priority selection
- Filters for `All`, `Open`, and `Done`
- Task completion toggle
- Per-task remove action
- `Clear done` action for completed tasks
- Browser `localStorage` persistence
- Responsive layout for desktop and mobile

## Built With

- React 19
- Vite 8
- Plain CSS

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will usually serve the app at `http://localhost:5173`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Data Behavior

- Demo tasks appear only when there is no saved data in `localStorage`
- Once tasks are saved in the browser, TaskFlow restores that state on reload
- Clearing browser storage resets the app back to the default demo state
