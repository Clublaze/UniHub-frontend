import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Loader from './Loader'

export default function PublicRoute({ children }) {
  const { accessToken, isLoadingAuth } = useAuthStore()

  if (isLoadingAuth) {
    return <Loader fullScreen />
  }

  if (accessToken) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}