import clubClient from '../../services/clubClient'

export const getEcrApi             = (eventId)       => clubClient.get(`/api/v1/ecr/${eventId}`)
export const submitEcrApi          = (eventId, data) => clubClient.post(`/api/v1/ecr/${eventId}`, data)
export const approveEcrApi         = (eventId)       => clubClient.post(`/api/v1/ecr/${eventId}/approve`)

export const getSettlementApi      = (eventId)       => clubClient.get(`/api/v1/settlements/${eventId}`)
export const submitSettlementApi   = (eventId, data) => clubClient.post(`/api/v1/settlements/${eventId}`, data)
export const approveSettlementApi  = (eventId)       => clubClient.post(`/api/v1/settlements/${eventId}/approve`)