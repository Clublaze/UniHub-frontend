import clubClient from '../../services/clubClient'
import env from '../../config/env'

// Club listing — uses discover endpoint (same data across authenticated + public)
export const getClubsListApi = (params = {}) =>
  clubClient.get('/api/v1/discover/clubs', {
    params: { universityId: env.universityId, ...params },
  })

// Club detail — org endpoint gives full org unit data
export const getOrgUnitApi = (id) =>
  clubClient.get(`/api/v1/organizations/${id}`)

// Public club detail (includes memberCount, leadership, recentEvents)
export const getPublicClubApi = (id) =>
  clubClient.get(`/api/v1/discover/clubs/${id}`, {
    params: { universityId: env.universityId },
  })

// Roles for a scope (club or society)
export const getScopeRolesApi = (scopeId) =>
  clubClient.get(`/api/v1/roles/${scopeId}`)

// Assign role
export const assignRoleApi = (data) =>
  clubClient.post('/api/v1/roles/assign', data)

// Remove role assignment
export const removeRoleApi = (roleId) =>
  clubClient.post('/api/v1/roles/remove', { roleId })

// Society listing
export const getSocietiesListApi = (params = {}) =>
  clubClient.get('/api/v1/discover/societies', {
    params: { universityId: env.universityId, ...params },
  })

// Society detail
export const getPublicSocietyApi = (id) =>
  clubClient.get(`/api/v1/discover/societies/${id}`, {
    params: { universityId: env.universityId },
  })