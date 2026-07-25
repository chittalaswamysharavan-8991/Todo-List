import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateStreak, shiftDateKey } from '../src/lib/date.js'

test('shiftDateKey crosses month boundaries', () => {
  assert.equal(shiftDateKey('2026-03-01', -1), '2026-02-28')
})

test('calculateStreak counts through today', () => {
  assert.equal(calculateStreak(['2026-07-23', '2026-07-24', '2026-07-25'], '2026-07-25'), 3)
})

test('calculateStreak uses yesterday when today is unfinished', () => {
  assert.equal(calculateStreak(['2026-07-23', '2026-07-24'], '2026-07-25'), 2)
})

test('calculateStreak stops at a gap', () => {
  assert.equal(calculateStreak(['2026-07-21', '2026-07-23', '2026-07-24'], '2026-07-25'), 2)
})
