import authClient from '../../services/authClient'
import clubClient from '../../services/clubClient'

export const loginApi = (data) =>
  authClient.post('/api/auth/login', data)

export const registerStudentApi = (data) =>
  authClient.post('/api/auth/register/student', data)

export const registerFacultyApi = (data) =>
  authClient.post('/api/auth/register/faculty', data)

export const refreshApi = () =>
  authClient.post('/api/auth/refresh')

export const getMeApi = () =>
  authClient.get('/api/auth/me')

export const logoutApi = () =>
  authClient.post('/api/auth/logout')

export const verifyEmailApi = (token) =>
  authClient.post('/api/auth/verify-email', { token })

export const resendVerificationApi = (email) =>
  authClient.post('/api/auth/resend-verification', { email })

export const forgotPasswordApi = (email) =>
  authClient.post('/api/auth/forgot-password', { email })

export const resetPasswordApi = (token, newPassword) =>
  authClient.post('/api/auth/reset-password', { token, newPassword })

export const getRolesApi = (userId) =>
  clubClient.get(`/api/v1/roles/user/${userId}`)