import authClient, { authApiClient } from '../../services/authClient'
import clubClient from '../../services/clubClient'

export const loginApi = (data) =>
  authApiClient.post('/api/auth/login', data)

export const registerStudentApi = (data) =>
  authApiClient.post('/api/auth/register/student', data)

export const registerFacultyApi = (data) =>
  authApiClient.post('/api/auth/register/faculty', data)

export const refreshApi = () =>
  authApiClient.post('/api/auth/refresh')

export const getMeApi = () =>
  authClient.get('/api/auth/me')

export const logoutApi = () =>
  authClient.post('/api/auth/logout', {}, { skipAuthRefresh: true })

export const verifyEmailApi = (token) =>
  authApiClient.post('/api/auth/verify-email', { token })

export const resendVerificationApi = (email) =>
  authApiClient.post('/api/auth/resend-verification', { email })

export const forgotPasswordApi = (email) =>
  authApiClient.post('/api/auth/forgot-password', { email })

export const resetPasswordApi = (token, newPassword) =>
  authApiClient.post('/api/auth/reset-password', { token, newPassword })

export const getRolesApi = (userId) =>
  clubClient.get(`/api/v1/roles/user/${userId}`)
