import clubClient from '../../services/clubClient'

// Dashboard — pending steps for logged-in approver (used in sidebar badge too)
export const getApprovalsDashboardApi = ()               => clubClient.get('/api/v1/approvals/dashboard')

// Full step history for one event — used in the Approvals tab stepper
export const getApprovalHistoryApi    = (eventId)        => clubClient.get(`/api/v1/approvals/${eventId}/history`)

// Step-level actions — called from inside the Approvals tab
export const approveStepApi           = (stepId, comments = '') => clubClient.post(`/api/v1/approvals/${stepId}/approve`, { comments })
export const rejectStepApi            = (stepId, reason)        => clubClient.post(`/api/v1/approvals/${stepId}/reject`, { reason })