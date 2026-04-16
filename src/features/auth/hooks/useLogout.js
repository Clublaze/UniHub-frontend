import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../../store/authStore'
import { logoutApi } from '../auth.api'

export function useLogout() {
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  // Returns a function — call it from any button
  const handleLogout = async () => {
    try {
      await logoutApi() // clears the httpOnly cookie on the server
    } catch {
      // even if the API call fails, clear client state anyway
    } finally {
      logout()  // clears accessToken + user + roles from the store
      navigate('/auth/login', { replace: true })
    }
  }

  return handleLogout
}