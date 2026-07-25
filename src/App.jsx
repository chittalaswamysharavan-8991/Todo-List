import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronRight, Flame, Play, RotateCcw, Settings2, Square, Target } from 'lucide-react'
import BottomSheet from './components/BottomSheet'
import ProgressRing from './components/ProgressRing'
import { calculateStreak, formatFriendlyDate, getRecentDays, toDateKey } from './lib/date'
import { clearState, loadState, saveState } from './lib/storage'

const durations = [10, 25, 50]

function formatTimer(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function App() {
  const todayKey = toDateKey()
  const [state, setState] = useState(loadState)
  const [draft, setDraft] = useState(state.taskDate === todayKey ? state.task : '')
  const [sheet, setSheet] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(state.focusMinutes * 60)
  const [running, setRunning] = useState(false)
  const [justFinished, setJustFinished] = useState(false)
  const timerRef = useRef(null)

  const task = state.taskDate === todayKey ? state.task : ''
  const doneToday = state.completedDates.includes(todayKey)
  const streak = calculateStreak(state.completedDates, todayKey)
  const recentDays = getRecentDays(7)
  const progress = 1 - secondsLeft / (state.focusMinutes * 60)

  useEffect(() => saveState(state), [state])

  useEffect(() => {
    if (!running) return undefined

    timerRef.current = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timerRef.current)
          setRunning(false)
          setJustFinished(true)
          setState((previous) => ({ ...previous, focusSessions: previous.focusSessions + 1 }))
          if ('vibrate' in navigator) navigator.vibrate([120, 80, 120])
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timerRef.current)
  }, [running])

  useEffect(() => {
    if (!running) setSecondsLeft(state.focusMinutes * 60)
  }, [state.focusMinutes])

  const headline = useMemo(() => {
    if (doneToday) return 'Day won.'
    if (task) return 'Make it inevitable.'
    return 'One task. That is enough.'
  }, [doneToday, task])

  function saveTask(event) {
    event.preventDefault()
    const cleaned = draft.trim()
    if (!cleaned) return

    setState((previous) => ({ ...previous, task: cleaned, taskDate: todayKey }))
    setSheet(null)
  }

  function completeTask() {
    if (!task || doneToday) return
    setState((previous) => ({
      ...previous,
      completedDates: [...new Set([...previous.completedDates, todayKey])],
      lastCompletedTask: task,
    }))
    setRunning(false)
    setJustFinished(false)
  }

  function resetTimer() {
    setRunning(false)
    setJustFinished(false)
    setSecondsLeft(state.focusMinutes * 60)
  }

  function chooseDuration(minutes) {
    setRunning(false)
    setJustFinished(false)
    setState((previous) => ({ ...previous, focusMinutes: minutes }))
    setSecondsLeft(minutes * 60)
  }

  function resetAll() {
    clearState()
    setState({
      task: '',
      taskDate: '',
      completedDates: [],
      focusMinutes: 25,
      focusSessions: 0,
      lastCompletedTask: '',
    })
    setDraft('')
    setRunning(false)
    setSecondsLeft(25 * 60)
    setSheet(null)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="date-label">{formatFriendlyDate()}</p>
          <h1>DoneToday</h1>
        </div>
        <button className="icon-button glass" onClick={() => setSheet('settings')} aria-label="Open settings">
          <Settings2 size={21} />
        </button>
      </header>

      <section className="hero">
        <p className="hero-kicker">TODAY'S COMMITMENT</p>
        <h2>{headline}</h2>

        {!task ? (
          <button className="task-empty" onClick={() => setSheet('task')}>
            <span className="task-empty-icon"><Target size={24} /></span>
            <span>
              <strong>Choose today’s one task</strong>
              <small>Keep it specific and finishable</small>
            </span>
            <ChevronRight size={20} />
          </button>
        ) : (
          <button className={`task-card ${doneToday ? 'completed' : ''}`} onClick={() => !doneToday && setSheet('task')}>
            <span className="task-status">{doneToday ? <Check size={22} /> : <Target size={22} />}</span>
            <span className="task-copy">
              <small>{doneToday ? 'COMPLETED' : 'TODAY'}</small>
              <strong>{task}</strong>
            </span>
            {!doneToday && <ChevronRight size={20} />}
          </button>
        )}
      </section>

      <section className="focus-panel">
        <div className="panel-heading">
          <div>
            <p>FOCUS SESSION</p>
            <h3>{running ? 'Stay with it.' : justFinished ? 'Session complete.' : 'Start clean.'}</h3>
          </div>
          <span>{state.focusSessions} total</span>
        </div>

        <ProgressRing
          progress={progress}
          label={formatTimer(secondsLeft)}
          sublabel={running ? 'FOCUSING' : justFinished ? 'DONE' : `${state.focusMinutes} MIN`}
        />

        <div className="timer-actions">
          <button className="secondary-control" onClick={resetTimer} aria-label="Reset timer">
            <RotateCcw size={20} />
          </button>
          <button
            className="primary-control"
            onClick={() => {
              if (secondsLeft === 0) resetTimer()
              else setRunning((value) => !value)
            }}
          >
            {running ? <Square size={20} fill="currentColor" /> : <Play size={21} fill="currentColor" />}
            {running ? 'Pause' : secondsLeft === 0 ? 'Again' : 'Focus'}
          </button>
          <button className="secondary-control" onClick={() => setSheet('settings')} aria-label="Change timer duration">
            <Settings2 size={20} />
          </button>
        </div>
      </section>

      <section className="streak-panel">
        <div className="streak-title">
          <div className="streak-icon"><Flame size={22} fill="currentColor" /></div>
          <div>
            <strong>{streak} day{streak === 1 ? '' : 's'}</strong>
            <span>Current streak</span>
          </div>
        </div>

        <div className="week-strip" aria-label="Recent completion history">
          {recentDays.map((day) => {
            const complete = state.completedDates.includes(day.key)
            const today = day.key === todayKey
            return (
              <div className="day" key={day.key}>
                <span>{day.day}</span>
                <div className={`${complete ? 'filled' : ''} ${today ? 'today' : ''}`}>
                  {complete ? <Check size={15} /> : day.date}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <button className={`finish-button ${doneToday ? 'done' : ''}`} disabled={!task || doneToday} onClick={completeTask}>
        {doneToday ? <Check size={22} /> : <Target size={22} />}
        {doneToday ? 'Completed today' : 'Mark today complete'}
      </button>

      <p className="privacy-note">Private by default. Everything stays on this device.</p>

      <BottomSheet open={sheet === 'task'} title="Today’s one task" onClose={() => setSheet(null)}>
        <form onSubmit={saveTask} className="task-form">
          <label htmlFor="task">What must be finished today?</label>
          <textarea
            id="task"
            autoFocus
            maxLength={100}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Example: Send the proposal to Ravi"
          />
          <div className="form-meta">
            <span>One clear outcome</span>
            <span>{draft.length}/100</span>
          </div>
          <button className="sheet-primary" type="submit" disabled={!draft.trim()}>Set commitment</button>
        </form>
      </BottomSheet>

      <BottomSheet open={sheet === 'settings'} title="Focus settings" onClose={() => setSheet(null)}>
        <div className="settings-block">
          <p>Session length</p>
          <div className="duration-grid">
            {durations.map((minutes) => (
              <button
                key={minutes}
                className={state.focusMinutes === minutes ? 'selected' : ''}
                onClick={() => chooseDuration(minutes)}
              >
                <strong>{minutes}</strong>
                <span>minutes</span>
              </button>
            ))}
          </div>
        </div>
        <button className="danger-button" onClick={resetAll}>Reset all app data</button>
      </BottomSheet>
    </main>
  )
}
