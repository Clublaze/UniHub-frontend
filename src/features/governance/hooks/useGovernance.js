import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getGovernanceTemplatesApi,
  getGovernanceConfigApi,
  getGovernanceHistoryApi,
  createGovernanceConfigApi,
  updateGovernanceConfigApi,
  getOrgTreeApi,
  createOrgUnitApi,
  updateOrgUnitApi,
} from '../governance.api'

export function useGovernanceTemplates() {
  return useQuery({
    queryKey: ['governance', 'templates'],
    queryFn:  () => getGovernanceTemplatesApi(),
    select:   (res) => res.data.data ?? [],
    staleTime: 1000 * 60 * 10,
  })
}

export function useGovernanceConfig(scopeId) {
  return useQuery({
    queryKey: ['governance', 'config', scopeId],
    queryFn:  () => getGovernanceConfigApi(scopeId),
    select:   (res) => res.data.data,
    enabled:  !!scopeId,
    retry:    false,
  })
}

export function useGovernanceHistory(scopeId) {
  return useQuery({
    queryKey: ['governance', 'history', scopeId],
    queryFn:  () => getGovernanceHistoryApi(scopeId),
    select:   (res) => res.data.data ?? [],
    enabled:  !!scopeId,
    retry:    false,
  })
}

export function useSaveGovernanceConfig(scopeId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) =>
      scopeId
        ? updateGovernanceConfigApi(scopeId, data)
        : createGovernanceConfigApi(data),
    onSuccess: () => {
      toast.success('Governance config saved!')
      qc.invalidateQueries({ queryKey: ['governance', 'config', scopeId] })
      qc.invalidateQueries({ queryKey: ['governance', 'history', scopeId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to save config.'),
  })
}

export function useOrgTree() {
  return useQuery({
    queryKey: ['org', 'tree'],
    queryFn:  () => getOrgTreeApi(),
    select:   (res) => res.data.data ?? [],
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateOrgUnit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => createOrgUnitApi(data),
    onSuccess: () => {
      toast.success('Organisation unit created!')
      qc.invalidateQueries({ queryKey: ['org', 'tree'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to create org unit.'),
  })
}

export function useUpdateOrgUnit(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => updateOrgUnitApi(id, data),
    onSuccess: () => {
      toast.success('Updated!')
      qc.invalidateQueries({ queryKey: ['org', 'tree'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to update.'),
  })
}