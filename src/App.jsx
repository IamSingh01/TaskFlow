import { useEffect, useState } from 'react'
import './App.css'

const filters = ['All', 'Open', 'Done']
const priorityOrder = ['High', 'Medium', 'Low']
const storageKey = 'sleek-task-flow.tasks'
const themeKey = 'sleek-task-flow.theme'
const demoTasks = [
  {
    id: 1,
    title: 'Review homepage spacing',
    detail: 'Tighten the hero section and align the CTA with the content grid.',
    priority: 'High',
    completed: false,
  },
  {
    id: 2,
    title: 'Reply to client feedback',
    detail: 'Send the updated status note and confirm the next delivery date.',
    priority: 'Medium',
    completed: false,
  },
]

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(storageKey)

    if (!savedTasks) {
      return demoTasks
    }

    try {
      return JSON.parse(savedTasks)
    } catch {
      return demoTasks
    }
  })
  const [filter, setFilter] = useState('All')
  const [draftTitle, setDraftTitle] = useState('')
  const [draftDetail, setDraftDetail] = useState('')
  const [draftPriority, setDraftPriority] = useState('Medium')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(themeKey)
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    localStorage.setItem(themeKey, darkMode ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks))
  }, [tasks])

  const visibleTasks = (() => {
    if (filter === 'Open') {
      return tasks.filter((task) => !task.completed)
    }

    if (filter === 'Done') {
      return tasks.filter((task) => task.completed)
    }

    return tasks
  })()

  const stats = (() => {
    const completed = tasks.filter((task) => task.completed).length
    const open = tasks.length - completed
    const highPriority = tasks.filter(
      (task) => task.priority === 'High' && !task.completed,
    ).length

    return {
      total: tasks.length,
      open,
      completed,
      highPriority,
    }
  })()

  function handleAddTask(event) {
    event.preventDefault()

    const title = draftTitle.trim()
    const detail = draftDetail.trim()

    if (!title) {
      return
    }

    setTasks((currentTasks) => [
      {
        id: Date.now(),
        title,
        detail,
        priority: draftPriority,
        completed: false,
      },
      ...currentTasks,
    ])

    setDraftTitle('')
    setDraftDetail('')
    setDraftPriority('Medium')
    setFilter('All')
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }

  function clearCompleted() {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed))
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="logo">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="url(#logo-gradient)"/>
              <path d="M10 18L16 24L26 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="36" y2="36">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text">
            <p className="brand-mark">Workspace for focused execution</p>
            <h1>TaskFlow</h1>
            <p className="brand-subtitle">Stay on top of what needs to get done.</p>
          </div>
        </div>
        <div className="topbar-right">
          <p className="topbar-copy">
            A clean task board for capturing work, setting priority, and moving fast.
          </p>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      <section className="overview-grid">
        <article className="overview-card overview-accent">
          <span>Open</span>
          <strong>{stats.open}</strong>
          <p>Tasks ready for action.</p>
        </article>
        <article className="overview-card">
          <span>Done</span>
          <strong>{stats.completed}</strong>
          <p>Completed and ready to clear.</p>
        </article>
        <article className="overview-card">
          <span>High Priority</span>
          <strong>{stats.highPriority}</strong>
          <p>Items that should be handled first.</p>
        </article>
      </section>

      <section className="workspace">
        <aside className="composer">
          <div className="section-heading">
            <p className="section-kicker">Create</p>
            <h2>New task</h2>
          </div>

          <form className="task-form" onSubmit={handleAddTask}>
            <label>
              Title
              <input
                type="text"
                placeholder="Draft landing page updates"
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
              />
            </label>

            <label>
              Notes
              <textarea
                rows="5"
                placeholder="Anything useful to make this task clearer."
                value={draftDetail}
                onChange={(event) => setDraftDetail(event.target.value)}
              />
            </label>

            <label>
              Priority
              <select
                value={draftPriority}
                onChange={(event) => setDraftPriority(event.target.value)}
              >
                {priorityOrder.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" className="primary-button">
              Add task
            </button>
          </form>
        </aside>

        <section className="board">
          <div className="board-header">
            <div className="section-heading">
              <p className="section-kicker">Board</p>
              <h2>Your list</h2>
            </div>

            <div className="board-actions">
              <div className="filter-row" role="tablist" aria-label="Task filters">
                {filters.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={option === filter ? 'filter-pill active' : 'filter-pill'}
                    onClick={() => setFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={clearCompleted}
                disabled={!stats.completed}
              >
                Clear done
              </button>
            </div>
          </div>

          {visibleTasks.length ? (
            <div className="task-list">
              {visibleTasks.map((task) => (
                <article
                  key={task.id}
                  className={task.completed ? 'task-card is-complete' : 'task-card'}
                >
                  <button
                    type="button"
                    className={task.completed ? 'toggle checked' : 'toggle'}
                    onClick={() => toggleTask(task.id)}
                    aria-label={`Mark ${task.title} as ${
                      task.completed ? 'open' : 'done'
                    }`}
                  />

                  <div className="task-main">
                    <div className="task-head">
                      <div className="task-row">
                        <h3>{task.title}</h3>
                      </div>

                      <p className="task-state">
                        {task.completed ? 'Completed' : 'In progress'}
                      </p>
                    </div>

                    {task.detail ? <p>{task.detail}</p> : null}

                    <div className="task-meta">
                      <span
                        className={`priority-badge priority-${task.priority.toLowerCase()}`}
                      >
                        {task.priority} priority
                      </span>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Delete ${task.title}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-kicker">Empty board</p>
              <h3>No tasks yet.</h3>
              <p>
                Add a task on the left to start building your list.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
