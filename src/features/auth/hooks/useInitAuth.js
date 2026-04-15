import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import useAuthStore from '../../../store/authStore'
import { refreshApi, getMeApi, getRolesApi } from '../auth.api'

export function useInitAuth() {
  const { setAccessToken, setUser, setRoles, setLoadingAuth } = useAuthStore()

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Try to get a new access token using the httpOnly refresh cookie
        const refreshRes = await refreshApi()
        const { accessToken } = refreshRes.data.data
        setAccessToken(accessToken)

        // 2. Decode token to get userId and basic fields
        // IMPORTANT: JWT uses 'type' not 'userType' — map it here
        const decoded = jwtDecode(accessToken)
        const userId = decoded.sub

        // 3. Fetch full user profile and roles in parallel
        const [meRes, rolesRes] = await Promise.all([
          getMeApi(),
          getRolesApi(userId),
        ])

        const userData = meRes.data.data.user
        setUser(userData)

        // roles response is an array directly
        setRoles(rolesRes.data.data || [])

      } catch {
        // Refresh failed = no valid session = stay logged out
        // Don't redirect here — router handles it
      } finally {
        setLoadingAuth(false)
      }
    }

    init()
  }, [])
}