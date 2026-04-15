import { useMutation } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../../store/authStore'
import { loginApi, getMeApi, getRolesApi } from '../auth.api'

export function useLogin() {
  const { setAccessToken, setUser, setRoles, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials) => loginApi(credentials),

    onSuccess: async (res) => {
      const { accessToken } = res.data.data
      setAccessToken(accessToken)

      const decoded = jwtDecode(accessToken)
      const userId = decoded.sub

      const [meRes, rolesRes] = await Promise.all([
        getMeApi(),
        getRolesApi(userId),
      ])

      setUser(meRes.data.data.user)
      setRoles(rolesRes.data.data || [])

      // Redirect based on userType
      const userType = meRes.data.data.user.userType
      if (['ADMIN', 'SUPER_ADMIN'].includes(userType)) {
        navigate('/audit')
      } else {
        navigate('/dashboard')
      }
    },
  })
}