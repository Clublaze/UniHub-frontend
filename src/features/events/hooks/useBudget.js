import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getBudgetApi, submitBudgetApi, approveBudgetApi, rejectBudgetApi,
} from '../../budget/budget.api'

// retry: false is CRITICAL — 404 means "no budget yet", not a real error
// Without this, TanStack Query retries 3 times for every event that has no budget

export function useBudget(eventId) {
  return useQuery({
    queryKey: ['budget', eventId],
    queryFn:  () => getBudgetApi(eventId),
    select:   (res) => res.data.data,
    enabled:  !!eventId,
    retry:    false,
  })
}

export function useSubmitBudget(eventId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => submitBudgetApi(eventId, data),
    onSuccess: () => {
      toast.success('Budget submitted!')
      qc.invalidateQueries({ queryKey: ['budget', eventId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to submit budget.'),
  })
}

export function useApproveBudget(eventId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => approveBudgetApi(eventId),
    onSuccess: () => {
      toast.success('Budget approved!')
      qc.invalidateQueries({ queryKey: ['budget', eventId] })
      qc.invalidateQueries({ queryKey: ['event', eventId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to approve budget.'),
  })
}

export function useRejectBudget(eventId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (reason) => rejectBudgetApi(eventId, reason),
    onSuccess: () => {
      toast.success('Budget rejected.')
      qc.invalidateQueries({ queryKey: ['budget', eventId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to reject budget.'),
  })
}