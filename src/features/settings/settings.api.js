import profileClient from '../../services/profileClient'
import authClient    from '../../services/authClient'

// GET /api/v1/settings — returns { notifications: {...}, privacy: {...} }
export const getSettingsApi = () =>
  profileClient.get('/api/v1/settings')

// PATCH /api/v1/settings/notifications
// Body: any subset of {
//   emailOnRoleAssigned, emailOnEventApproved, emailOnEventRejected,
//   emailOnMembership, emailOnEcrReminder, emailOnStepAssigned
// }
export const updateNotificationsApi = (data) =>
  profileClient.patch('/api/v1/settings/notifications', data)

// PATCH /api/v1/settings/privacy
// Body: any subset of { showProfile, showEmail, showActivityFeed }
export const updatePrivacyApi = (data) =>
  profileClient.patch('/api/v1/settings/privacy', data)

// POST /api/v1/settings/change-password
// Note: backend currently returns 503 — this is handled gracefully
export const changePasswordApi = (data) =>
  profileClient.post('/api/v1/settings/change-password', data)