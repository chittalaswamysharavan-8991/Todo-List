const STORAGE_KEY = 'donetoday-state-v1'

export const defaultState = {
  task: '',
  taskDate: '',
  completedDates: [],
  focusMinutes: 25,
  focusSessions: 0,
  lastCompletedTask: '',
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY)
}
