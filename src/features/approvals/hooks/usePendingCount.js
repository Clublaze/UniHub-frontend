import { useQuery } from '@tanstack/react-query'
import useAuthStore from '../../../store/authStore'
import { getApprovalsDashboardApi } from '../approvals.api'

// Returns the count of pending approval steps assigned to this user
// Only fetches if the user is an approver — otherwise returns 0
export function usePendingCount() {
  const store = useAuthStore()
  const isApprover = store.isApprover()

  const { data } = useQuery({
    queryKey: ['approvals', 'dashboard'],
    queryFn: getApprovalsDashboardApi,
    enabled: isApprover, // don't run the query at all for non-approvers
    select: (res) => {
      const steps = res.data.data
      return Array.isArray(steps) ? steps.length : 0
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  return data ?? 0
}