import { useState } from 'react'
import { useCalendarEvents } from '../hooks/useCalendarEvents'
import MonthView from '../components/MonthView'
import WeekView  from '../components/WeekView'
import ListView  from '../components/ListView'
import Loader    from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '../../../components/ui/select'

const STATUSES = [
  'ALL', 'DRAFT', 'UNDER_REVIEW', 'APPROVED',
  'REJECTED', 'ECR_PENDING', 'CLOSED',
]

// Legend items — pill colors reference CSS strings, not theme.js maps,
// because we just show small colored squares here for the legend
const LEGEND = [
  { label: 'Approved',     cls: 'bg-green-100 border border-green-200' },
  { label: 'Draft',        cls: 'bg-gray-100 border border-gray-200' },
  { label: 'Under Review', cls: 'bg-amber-100 border border-amber-200' },
  { label: 'Rejected',     cls: 'bg-red-100 border border-red-200' },
  { label: 'ECR Pending',  cls: 'bg-orange-100 border border-orange-200' },
  { label: 'Your Step ⚡', cls: 'bg-amber-200 border border-amber-300' },
]

export default function CalendarPage() {
  const [view,   setView]   = useState('month')
  const [status, setStatus] = useState('ALL')

  const { events, isLoading } = useCalendarEvents()

  const filters = { status }

  return (
    <div className="space-y-5">
      {/* Header + controls */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All events across your clubs and university
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex rounded-md border overflow-hidden">
            {['month', 'week', 'list'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-sm capitalize transition-colors ${
                  view === v
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => (
                <SelectItem key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3">
        {LEGEND.map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`h-2.5 w-2.5 rounded-sm ${cls}`} />
            {label}
          </div>
        ))}
      </div>

      {/* Calendar view */}
      {isLoading ? (
        <Loader text="Loading calendar..." />
      ) : view === 'month' ? (
        <MonthView events={events} filters={filters} />
      ) : view === 'week' ? (
        <WeekView events={events} filters={filters} />
      ) : (
        <ListView events={events} filters={filters} />
      )}
    </div>
  )
}