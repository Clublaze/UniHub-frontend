import clubClient from '../../services/clubClient'
import authClient from '../../services/authClient'

export const getAuditFeedApi    = (params = {}) =>
  clubClient.get('/api/v1/audit/feed', { params })

export const getAuditExportApi  = (params = {}) =>
  clubClient.get('/api/v1/audit/export', {
    params,
    responseType: 'blob', // CSV file download
  })

export const getOrgTreeApi      = () =>
  clubClient.get('/api/v1/organizations/tree')

// Admin user endpoints
export const getAdminUsersApi   = (params = {}) =>
  authClient.get('/api/auth/admin/users', { params })

export const blockUserApi       = (userId, reason) =>
  authClient.post('/api/auth/admin/block-user', { userId, reason })

export const unblockUserApi     = (userId) =>
  authClient.post('/api/auth/admin/unblock-user', { userId })

export const getLoginHistoryApi = (userId) =>
  authClient.get(`/api/auth/admin/users/${userId}/login-history`)

export const createAdminApi     = (data) =>
  authClient.post('/api/auth/admin/create-admin', data)