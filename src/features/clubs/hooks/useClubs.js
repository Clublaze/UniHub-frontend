import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getClubsListApi, getPublicClubApi,
  getScopeRolesApi, assignRoleApi, removeRoleApi,
  getSocietiesListApi, getPublicSocietyApi,
} from '../clubs.api'
import {
  getClubMembersApi,
  getPendingMembershipsApi,
  approveMembershipApi,
  rejectMembershipApi,
} from '../../memberships/memberships.api'

// ─── Clubs ───────────────────────────────────────────────────────────────────

export function useClubsList(params = {}) {
  return useQuery({
    queryKey: ['clubs', 'list', params],
    queryFn:  () => getClubsListApi(params),
    select:   (res) => {
      const d = res.data.data
      return Array.isArray(d) ? { data: d, total: d.length } : d
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useClubDetail(id) {
  return useQuery({
    queryKey: ['club', 'detail', id],
    queryFn:  () => getPublicClubApi(id),
    select:   (res) => res.data.data,
    enabled:  !!id,
  })
}

// ─── Societies ───────────────────────────────────────────────────────────────

export function useSocietiesList(params = {}) {
  return useQuery({
    queryKey: ['societies', 'list', params],
    queryFn:  () => getSocietiesListApi(params),
    select:   (res) => {
      const d = res.data.data
      return Array.isArray(d) ? d : (d?.data ?? [])
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useSocietyDetail(id) {
  return useQuery({
    queryKey: ['society', 'detail', id],
    queryFn:  () => getPublicSocietyApi(id),
    select:   (res) => res.data.data,
    enabled:  !!id,
  })
}

// ─── Roles for a scope ────────────────────────────────────────────────────────

export function useScopeRoles(scopeId) {
  return useQuery({
    queryKey: ['roles', 'scope', scopeId],
    queryFn:  () => getScopeRolesApi(scopeId),
    select:   (res) => res.data.data ?? [],
    enabled:  !!scopeId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useAssignRole(scopeId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => assignRoleApi(data),
    onSuccess: () => {
      toast.success('Role assigned successfully!')
      qc.invalidateQueries({ queryKey: ['roles', 'scope', scopeId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to assign role.'),
  })
}

export function useRemoveRole(scopeId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (roleId) => removeRoleApi(roleId),
    onSuccess: () => {
      toast.success('Role removed.')
      qc.invalidateQueries({ queryKey: ['roles', 'scope', scopeId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to remove role.'),
  })
}

// ─── Members for a club ───────────────────────────────────────────────────────

export function useClubMembers(clubId) {
  return useQuery({
    queryKey: ['memberships', 'club', clubId, 'active'],
    queryFn:  () => getClubMembersApi(clubId).then(r => {
      const d = r.data.data
      return Array.isArray(d) ? d : (d?.data ?? [])
    }),
    enabled:  !!clubId,
  })
}

export function usePendingMembers(clubId) {
  return useQuery({
    queryKey: ['memberships', 'club', clubId, 'pending'],
    queryFn:  () => getPendingMembershipsApi(clubId).then(r => {
      const d = r.data.data
      return Array.isArray(d) ? d : (d?.data ?? [])
    }),
    enabled:  !!clubId,
  })
}

export function useApproveMember(clubId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => approveMembershipApi(id),
    onSuccess: () => {
      toast.success('Membership approved.')
      qc.invalidateQueries({ queryKey: ['memberships', 'club', clubId] })
    },
    onError: () => toast.error('Failed to approve.'),
  })
}

export function useRejectMember(clubId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }) => rejectMembershipApi(id, reason),
    onSuccess: () => {
      toast.success('Membership rejected.')
      qc.invalidateQueries({ queryKey: ['memberships', 'club', clubId] })
    },
    onError: () => toast.error('Failed to reject.'),
  })
}