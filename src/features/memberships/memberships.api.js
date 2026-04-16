import clubClient from '../../services/clubClient'

export const getMyMembershipsApi = () =>
  clubClient.get('/api/v1/memberships/my')

export const applyToClubApi = (data) =>
  clubClient.post('/api/v1/memberships/apply', data)

export const leaveClubApi = (clubId) =>
  clubClient.delete(`/api/v1/memberships/${clubId}/leave`)

export const getClubMembersApi = (clubId, params = {}) =>
  clubClient.get(`/api/v1/memberships/club/${clubId}`, { params })

export const getPendingMembershipsApi = (clubId) =>
  clubClient.get(`/api/v1/memberships/club/${clubId}/pending`)

export const approveMembershipApi = (id) =>
  clubClient.post(`/api/v1/memberships/${id}/approve`)

export const rejectMembershipApi = (id, reason) =>
  clubClient.post(`/api/v1/memberships/${id}/reject`, { reason })