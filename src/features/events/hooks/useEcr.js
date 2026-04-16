import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getEcrApi, submitEcrApi, approveEcrApi,
  getSettlementApi, submitSettlementApi, approveSettlementApi,
} from '../../ecr/ecr.api'

// retry: false for both — 404 = "not submitted yet", treat as empty form

export function useEcr(eventId) {
  return useQuery({
    queryKey: ['ecr', eventId],
    queryFn:  () => getEcrApi(eventId),
    select:   (res) => res.data.data,
    enabled:  !!eventId,
    retry:    false,
  })
}

export function useSubmitEcr(eventId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => submitEcrApi(eventId, data),
    onSuccess: () => {
      toast.success('ECR submitted!')
      qc.invalidateQueries({ queryKey: ['ecr', eventId] })
      qc.invalidateQueries({ queryKey: ['event', eventId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to submit ECR.'),
  })
}

export function useApproveEcr(eventId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => approveEcrApi(eventId),
    onSuccess: () => {
      toast.success('ECR approved!')
      qc.invalidateQueries({ queryKey: ['ecr', eventId] })
      qc.invalidateQueries({ queryKey: ['event', eventId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to approve ECR.'),
  })
}

export function useSettlement(eventId) {
  return useQuery({
    queryKey: ['settlement', eventId],
    queryFn:  () => getSettlementApi(eventId),
    select:   (res) => res.data.data,
    enabled:  !!eventId,
    retry:    false,
  })
}

export function useSubmitSettlement(eventId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => submitSettlementApi(eventId, data),
    onSuccess: () => {
      toast.success('Settlement submitted!')
      qc.invalidateQueries({ queryKey: ['settlement', eventId] })
      qc.invalidateQueries({ queryKey: ['event', eventId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to submit settlement.'),
  })
}

export function useApproveSettlement(eventId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => approveSettlementApi(eventId),
    onSuccess: () => {
      toast.success('Settlement approved!')
      qc.invalidateQueries({ queryKey: ['settlement', eventId] })
      qc.invalidateQueries({ queryKey: ['event', eventId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to approve settlement.'),
  })
}