// Colors from getCalendarPillClass() in theme.js
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import EventPopup from './EventPopup'
import { getCalendarPillClass } from '../../../styles/theme'

const WEEKDAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekStart(date) {
  const d    = new Date(date)
  const day  = d.getDay()
  // Monday-first: if Sunday (0), go back 6 days; otherwise go back (day - 1) days
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

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

function formatWeekRange(start) {
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const opts = { month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString('en-IN', opts)} – ${end.toLocaleDateString('en-IN', opts)}, ${end.getFullYear()}`
}

export default function WeekView({ events, filters }) {
  const today = new Date()
  const [weekStart, setWeekStart] = useState(() => getWeekStart(today))
  const [popup, setPopup] = useState(null)

  const prevWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
  }
  const nextWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const isToday = (date) =>
    date.toDateString() === today.toDateString()

  const filtered = events.filter(e => {
    if (filters.status && filters.status !== 'ALL' && e.status !== filters.status) return false
    return true
  })

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevWeek}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-base font-semibold text-foreground">
          {formatWeekRange(weekStart)}
        </h2>
        <Button variant="ghost" size="icon" onClick={nextWeek}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* 7-column grid */}
      <div className="rounded-lg border overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {weekDays.map((day, i) => (
            <div
              key={i}
              className={`p-2 text-center border-r last:border-r-0 ${
                isToday(day) ? 'bg-primary/10' : ''
              }`}
            >
              <p className="text-xs text-muted-foreground">{WEEKDAYS_SHORT[i]}</p>
              <p className={`text-sm font-semibold mt-0.5 ${
                isToday(day) ? 'text-primary' : 'text-foreground'
              }`}>
                {day.getDate()}
              </p>
            </div>
          ))}
        </div>

        {/* Events per day */}
        <div className="grid grid-cols-7 min-h-[200px]">
          {weekDays.map((day, i) => {
            const dayEvents = getEventsForDay(filtered, day)
            return (
              <div
                key={i}
                className={`p-1.5 border-r last:border-r-0 space-y-0.5 ${
                  isToday(day) ? 'bg-primary/5' : ''
                }`}
              >
                {dayEvents.map(event => (
                  <button
                    key={event._id}
                    onClick={() => setPopup(event)}
                    className={`w-full text-left text-xs px-1.5 py-1 rounded truncate block
                      hover:opacity-80 transition-opacity cursor-pointer
                      ${getCalendarPillClass(event)}`}
                  >
                    {event.isApproverPending && '⚡ '}
                    {event.title}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <EventPopup event={popup} onClose={() => setPopup(null)} />
    </div>
  )
}