// Colors come from getCalendarPillClass() in theme.js — not written here
import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import EventPopup from './EventPopup'
import { getCalendarPillClass } from '../../../styles/theme'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const MAX_PILLS = 3

// Build a 42-cell grid for the given month, Monday-first
function buildGrid(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDate = new Date(year, month + 1, 0).getDate()

  // Convert to Monday-first index: Mon=0, Tue=1, ..., Sun=6
  const startDow = (firstDay.getDay() + 6) % 7
  const cells    = []

  // Previous month's trailing days
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month, -i), isCurrentMonth: false })
  }

  // Current month
  for (let d = 1; d <= lastDate; d++) {
    cells.push({ date: new Date(year, month, d), isCurrentMonth: true })
  }

  // Fill to exactly 42 cells (6 complete rows)
  let next = 1
  while (cells.length < 42) {
    cells.push({ date: new Date(year, month + 1, next++), isCurrentMonth: false })
  }

  return cells
}

// Returns events that cover the given date (start ≤ date ≤ end)
function getEventsForDay(events, date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const dateStr = `${y}-${m}-${d}`

  return events.filter(e => {
    if (!e.startDate) return false
    const start = e.startDate.slice(0, 10)
    const end   = (e.endDate || e.startDate).slice(0, 10)
    return dateStr >= start && dateStr <= end
  })
}

export default function MonthView({ events, filters }) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [popup, setPopup] = useState(null)

  const grid = useMemo(() => buildGrid(year, month), [year, month])

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  // Apply filters passed down from CalendarPage
  const filtered = events.filter(e => {
    if (filters.status && filters.status !== 'ALL' && e.status !== filters.status)
      return false
    return true
  })

  const isToday = (date) =>
    date.getDate()     === today.getDate() &&
    date.getMonth()    === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          {MONTHS[month]} {year}
        </h2>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Grid */}
      <div className="rounded-lg border overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {WEEKDAYS.map(d => (
            <div
              key={d}
              className="px-2 py-2 text-xs font-medium text-muted-foreground text-center"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Cells — 6 rows of 7 */}
        <div className="grid grid-cols-7">
          {grid.map(({ date, isCurrentMonth }, i) => {
            const dayEvents = getEventsForDay(filtered, date)
            const visible   = dayEvents.slice(0, MAX_PILLS)
            const overflow  = dayEvents.length - MAX_PILLS
            const isTodayCell = isToday(date)

            return (
              <div
                key={i}
                className={`min-h-[90px] border-b border-r p-1.5 ${
                  !isCurrentMonth ? 'bg-muted/20' : ''
                } ${i % 7 === 6 ? 'border-r-0' : ''}`}
              >
                {/* Day number */}
                <div
                  className={`text-xs font-medium mb-1 h-6 w-6 flex items-center justify-center rounded-full ${
                    isTodayCell
                      ? 'bg-primary text-primary-foreground'
                      : isCurrentMonth
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {date.getDate()}
                </div>

                {/* Event pills */}
                <div className="space-y-0.5">
                  {visible.map(event => (
                    <button
                      key={event._id}
                      onClick={() => setPopup(event)}
                      className={`w-full text-left text-xs px-1.5 py-0.5 rounded truncate block
                        hover:opacity-80 transition-opacity cursor-pointer
                        ${getCalendarPillClass(event)}`}
                    >
                      {event.isApproverPending && '⚡ '}
                      {event.title}
                    </button>
                  ))}
                  {overflow > 0 && (
                    <p className="text-xs text-muted-foreground px-1">
                      +{overflow} more
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <EventPopup event={popup} onClose={() => setPopup(null)} />
    </div>
  )
}