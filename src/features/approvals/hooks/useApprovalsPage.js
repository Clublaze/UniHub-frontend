import { useQuery } from '@tanstack/react-query'
import { getApprovalsDashboardApi } from '../approvals.api'

// Fetches all pending approval steps assigned to the logged-in approver.
// Returns the raw array — ApprovalsPage handles grouping and display.
export function useApprovalsDashboard() {
  return useQuery({
    queryKey: ['approvals', 'dashboard'],
    queryFn:  () => getApprovalsDashboardApi(),
    select:   (res) => {
      const data = res.data.data
      return Array.isArray(data) ? data : []
    },
    staleTime: 1000 * 60 * 2, // 2 minutes — approvals change often
  })
}