import clubClient from '../../services/clubClient'
import env from '../../config/env'

// Discovery routes need universityId as a query param — NOT from JWT
// clubClient still attaches the Bearer token if user is logged in (harmless)
const uid = () => env.universityId

export const getPublicClubsApi = (params = {}) =>
  clubClient.get('/api/v1/discover/clubs', {
    params: { universityId: uid(), ...params },
  })

export const getPublicClubDetailApi = (id) =>
  clubClient.get(`/api/v1/discover/clubs/${id}`, {
    params: { universityId: uid() },
  })

export const getPublicSocietiesApi = (params = {}) =>
  clubClient.get('/api/v1/discover/societies', {
    params: { universityId: uid(), ...params },
  })

export const getPublicSocietyDetailApi = (id) =>
  clubClient.get(`/api/v1/discover/societies/${id}`, {
    params: { universityId: uid() },
  })

export const getPublicEventsApi = (params = {}) =>
  clubClient.get('/api/v1/discover/events', {
    params: { universityId: uid(), ...params },
  })

export const getPublicEventDetailApi = (id) =>
  clubClient.get(`/api/v1/discover/events/${id}`, {
    params: { universityId: uid() },
  })