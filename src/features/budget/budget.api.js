import clubClient from '../../services/clubClient'

export const getBudgetApi        = (eventId)         => clubClient.get(`/api/v1/budgets/${eventId}`)
export const submitBudgetApi     = (eventId, data)   => clubClient.post(`/api/v1/budgets/${eventId}`, data)
export const approveBudgetApi    = (eventId)         => clubClient.post(`/api/v1/budgets/${eventId}/approve`)
export const rejectBudgetApi     = (eventId, reason) => clubClient.post(`/api/v1/budgets/${eventId}/reject`, { reason })