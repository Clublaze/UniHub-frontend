import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getSettingsApi,
  updateNotificationsApi,
  updatePrivacyApi,
  changePasswordApi,
} from '../settings.api'

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn:  () => getSettingsApi(),
    select:   (res) => res.data.data,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export function useUpdateNotifications() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => updateNotificationsApi(data),
    onSuccess: () => {
      toast.success('Notification preferences saved.')
      qc.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to save.'),
  })
}

export function useUpdatePrivacy() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => updatePrivacyApi(data),
    onSuccess: () => {
      toast.success('Privacy settings saved.')
      qc.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to save.'),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data) => changePasswordApi(data),
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to change password.'),
  })
}