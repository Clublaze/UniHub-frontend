import clubClient from '../../services/clubClient'

// Dashboard — pending steps for logged-in approver (used in sidebar badge too)
export const getApprovalsDashboardApi = ()               => clubClient.get('/api/v1/approvals/dashboard')

export function normalizeApprovalsDashboardData(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  return []
}

export async function getApprovalsDashboardData() {
  const response = await getApprovalsDashboardApi()
  return normalizeApprovalsDashboardData(response)
}

// Full step history for one event — used in the Approvals tab stepper
export const getApprovalHistoryApi    = (eventId)        => clubClient.get(`/api/v1/approvals/${eventId}/history`)

// Step-level actions — called from inside the Approvals tab
export const approveStepApi           = (stepId, comments = '') => clubClient.post(`/api/v1/approvals/${stepId}/approve`, { comments })
export const rejectStepApi            = (stepId, reason)        => clubClient.post(`/api/v1/approvals/${stepId}/reject`, { reason })
