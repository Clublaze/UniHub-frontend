import axios from 'axios'
import env from '../config/env'
import useAuthStore from '../store/authStore'

const authClient = axios.create({
  baseURL: env.authUrl,
  withCredentials: true, // always — needed for refresh cookie
})

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
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true
      try {
        const res = await axios.post(
          `${env.authUrl}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const { accessToken } = res.data.data
        useAuthStore.setState({ accessToken })
        error.config.headers.Authorization = `Bearer ${accessToken}`
        return authClient(error.config)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default authClient