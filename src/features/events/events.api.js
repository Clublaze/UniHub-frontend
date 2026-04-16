import clubClient from '../../services/clubClient'

export const getClubEventsApi = (clubId, params = {}) =>
  clubClient.get('/api/v1/events', { params: { clubId, ...params } })

export const getAllEventsApi = (params = {}) =>
  clubClient.get('/api/v1/events', { params })

export const getEventByIdApi = (id) =>
  clubClient.get(`/api/v1/events/${id}`)

export const createEventApi = (data) =>
  clubClient.post('/api/v1/events', data)

export const updateEventApi = (id, data) =>
  clubClient.patch(`/api/v1/events/${id}`, data)

export const submitEventApi = (id) =>
  clubClient.post(`/api/v1/events/${id}/submit`)

export const resubmitEventApi = (id) =>
  clubClient.post(`/api/v1/events/${id}/resubmit`)

export const completeEventApi = (id) =>
  clubClient.post(`/api/v1/events/${id}/complete`)