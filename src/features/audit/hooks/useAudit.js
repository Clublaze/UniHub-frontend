import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAuditFeedApi,
  getAdminUsersApi,
  blockUserApi,
  unblockUserApi,
  getLoginHistoryApi,
  createAdminApi,
  getAuditExportApi,
} from '../audit.api'

export function useAuditFeed(filters = {}) {
  return useQuery({
    queryKey: ['audit', 'feed', filters],
    queryFn:  () => getAuditFeedApi({ limit: 50, ...filters }),
    select:   (res) => {
      const d = res.data.data
      return {
        logs:       d?.logs  ?? [],
        total:      d?.total ?? 0,
        page:       d?.page  ?? 1,
        totalPages: d?.totalPages ?? 1,
      }
    },
    staleTime: 1000 * 30, // 30 seconds — audit feed refreshes often
  })
}

export function useAdminUsers(filters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn:  () => getAdminUsersApi({ limit: 20, ...filters }),
    select:   (res) => {
      const d = res.data.data
      const users = (d?.users ?? []).map((user) => ({
        ...user,
        id: user.id ?? user._id,
      }))
      return { users, total: d?.total ?? 0, totalPages: d?.totalPages ?? 1 }
    },
  })
}

export function useBlockUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, reason }) => blockUserApi(userId, reason),
    onSuccess: () => {
      toast.success('User blocked.')
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to block user.'),
  })
}

export function useUnblockUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId) => unblockUserApi(userId),
    onSuccess: () => {
      toast.success('User unblocked.')
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to unblock user.'),
  })
}

export function useLoginHistory(userId) {
  return useQuery({
    queryKey: ['admin', 'login-history', userId],
    queryFn:  () => getLoginHistoryApi(userId),
    select:   (res) =>
      (res.data.data?.logs ?? []).map((log) => ({
        ...log,
        id: log.id ?? log._id,
        timestamp: log.timestamp ?? log.loginAt,
      })),
    enabled:  !!userId,
    retry:    false,
  })
}

export function useCreateAdmin() {
  return useMutation({
    mutationFn: (data) => createAdminApi(data),
    onSuccess: () => toast.success('Admin account created!'),
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to create admin.'),
  })
}

// Download audit CSV — triggers browser file download
export async function downloadAuditCsv(from, to) {
  const res = await getAuditExportApi({ from, to })
  const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
  const a   = document.createElement('a')
  a.href = url
  a.download = `audit-${from}-to-${to}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
