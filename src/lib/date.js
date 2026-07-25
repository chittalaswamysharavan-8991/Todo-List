export function toDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function shiftDateKey(dateKey, amount) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + amount)
  return toDateKey(date)
}

export function calculateStreak(completions, todayKey = toDateKey()) {
  const completed = new Set(completions)
  let cursor = completed.has(todayKey) ? todayKey : shiftDateKey(todayKey, -1)
  let streak = 0

  while (completed.has(cursor)) {
    streak += 1
    cursor = shiftDateKey(cursor, -1)
  }

  return streak
}

export function formatFriendlyDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function getRecentDays(count = 7) {
  const today = new Date()
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (count - 1 - index))
    return {
      key: toDateKey(date),
      day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date).slice(0, 1),
      date: date.getDate(),
    }
  })
}
