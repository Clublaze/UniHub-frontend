import profileClient from '../../services/profileClient'

// GET /api/v1/profiles/me
// Returns full aggregated profile: local data + currentRoles + memberships
// + recentEvents + activityFeed + badges + stats + completionScore
export const getMyProfileApi = () =>
  profileClient.get('/api/v1/profiles/me')

// PATCH /api/v1/profiles/me
// Only editable fields: name, department, graduationYear, bio,
// linkedinUrl, githubUrl, portfolioUrl
export const updateProfileApi = (data) =>
  profileClient.patch('/api/v1/profiles/me', data)

// GET /api/v1/profiles/:userId — view another user's profile (respects privacy)
export const getProfileByIdApi = (userId) =>
  profileClient.get(`/api/v1/profiles/${userId}`)

// POST /api/v1/profiles/me/photo — multipart/form-data, field name: "photo"
export const uploadPhotoApi = (formData) =>
  profileClient.post('/api/v1/profiles/me/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// DELETE /api/v1/profiles/me/photo
export const deletePhotoApi = () =>
  profileClient.delete('/api/v1/profiles/me/photo')

// POST /api/v1/profiles/me/cover — multipart/form-data, field name: "cover"
export const uploadCoverApi = (formData) =>
  profileClient.post('/api/v1/profiles/me/cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// DELETE /api/v1/profiles/me/cover
export const deleteCoverApi = () =>
  profileClient.delete('/api/v1/profiles/me/cover')

// PUT /api/v1/profiles/me/highlight
// Body: { type: 'EVENT'|'ROLE'|'ACHIEVEMENT', entityId, title, description? }
export const setPinnedHighlightApi = (data) =>
  profileClient.put('/api/v1/profiles/me/highlight', data)

// DELETE /api/v1/profiles/me/highlight
export const removePinnedHighlightApi = () =>
  profileClient.delete('/api/v1/profiles/me/highlight')