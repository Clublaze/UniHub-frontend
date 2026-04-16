import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getApprovalHistoryApi, approveStepApi, rejectStepApi,
} from '../../approvals/approvals.api'

export function useApprovalHistory(eventId) {
  return useQuery({
    queryKey: ['approvals', 'history', eventId],
    queryFn:  () => getApprovalHistoryApi(eventId),
    select:   (res) => res.data.data ?? [],
    enabled:  !!eventId,
  })
}

export function useApproveStep(eventId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ stepId, comments }) => approveStepApi(stepId, comments),
    onSuccess: () => {
      toast.success('Step approved!')
      // Invalidate all three — the stepper, the event status badge, and the sidebar badge
      qc.invalidateQueries({ queryKey: ['approvals', 'history', eventId] })
      qc.invalidateQueries({ queryKey: ['event', eventId] })
      qc.invalidateQueries({ queryKey: ['approvals', 'dashboard'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to approve step.'),
  })
}

export function useRejectStep(eventId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ stepId, reason }) => rejectStepApi(stepId, reason),
    onSuccess: () => {
      toast.success('Step rejected.')
      qc.invalidateQueries({ queryKey: ['approvals', 'history', eventId] })
      qc.invalidateQueries({ queryKey: ['event', eventId] })
      qc.invalidateQueries({ queryKey: ['approvals', 'dashboard'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to reject step.'),
  })
}