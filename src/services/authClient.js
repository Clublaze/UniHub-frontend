import axios from 'axios'
import env from '../config/env'
import useAuthStore from '../store/authStore'

export const authApiClient = axios.create({
  baseURL: env.authUrl,
  withCredentials: true,
})

const authClient = axios.create({
  baseURL: env.authUrl,
  withCredentials: true, // always — needed for refresh cookie
})

const skipRefreshUrls = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/api/auth/verify-email',
  '/api/auth/resend-verification',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

function shouldAttemptRefresh(error) {
  const { config, response } = error
  if (!config || response?.status !== 401 || config._retry || config.skipAuthRefresh) {
    return false
  }

  const url = config.url || ''
  return !skipRefreshUrls.some(path => url.includes(path))
}

// Attach access token to every request
authClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401 — try one silent refresh, then force logout
authClient.interceptors.response.use(
  res => res,
  async error => {
    if (shouldAttemptRefresh(error)) {
      const originalRequest = error.config
      originalRequest._retry = true

      try {
        const res = await authApiClient.post('/api/auth/refresh')
        const { accessToken } = res.data.data

        useAuthStore.setState({ accessToken })
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        }

        return authClient(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()

        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login'
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default authClient
