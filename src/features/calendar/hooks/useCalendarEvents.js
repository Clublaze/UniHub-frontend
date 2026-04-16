import { useQuery } from '@tanstack/react-query'
import useAuthStore from '../../../store/authStore'
import { getPublicEventsApi } from '../../explore/explore.api'
import { getClubEventsApi }   from '../../events/events.api'
import { getApprovalsDashboardApi } from '../../approvals/approvals.api'

// Merges events from all relevant sources into one deduplicated array.
// Each event gets an `isApproverPending` flag when the logged-in user
// has an active approval step on it — used for the amber⚡ pill in the calendar.
export function useCalendarEvents() {
  const store        = useAuthStore()
  const managedClubs = store.getManagedClubs()
  const isApprover   = store.isApprover()
  const isAdmin      = store.isAdmin()

  // 1. Public approved events — everyone gets these
  const { data: publicEvents = [], isLoading } = useQuery({
    queryKey: ['calendar', 'public'],
    queryFn:  () => getPublicEventsApi({ limit: 100 }),
    select:   (res) => {
      const d = res.data.data
      return Array.isArray(d) ? d : (d?.data ?? [])
    },
    staleTime: 1000 * 60 * 5,
  })

  // 2. All club events (DRAFT, UNDER_REVIEW etc) for club leads / co-leads
  const { data: clubEvents = [] } = useQuery({
    queryKey: ['calendar', 'club-events', managedClubs.map(c => c.scopeId).join(',')],
    queryFn:  () =>
      Promise.all(
        managedClubs.map(c =>
          getClubEventsApi(c.scopeId, { limit: 100 }).then(r => {
            const d = r.data.data
            return Array.isArray(d) ? d : (d?.data ?? [])
          })
        )
      ).then(arrays => arrays.flat()),
    enabled:   managedClubs.length > 0,
    staleTime: 1000 * 60 * 2,
  })

  // 3. Approver's pending steps — to flag events needing action
  const { data: approvalSteps = [] } = useQuery({
    queryKey: ['approvals', 'dashboard'],
    queryFn:  () => getApprovalsDashboardApi().then(r => r.data.data ?? []),
    enabled:   isApprover,
    staleTime: 1000 * 60 * 2,
  })

  // Build set of eventIds where this user has an active pending step
  const approverEventIds = new Set(
    approvalSteps
      .filter(s => s.isActive && s.status === 'PENDING')
      .map(s => s.eventId)
  )

  // Merge + deduplicate by _id
  const allRaw   = [...publicEvents, ...clubEvents]
  const eventMap = new Map()
  allRaw.forEach(e => {
    if (!eventMap.has(e._id)) {
      eventMap.set(e._id, {
        ...e,
        isApproverPending: approverEventIds.has(e._id),
      })
    }
  })

  return {
    events:    Array.from(eventMap.values()),
    isLoading,
  }
}