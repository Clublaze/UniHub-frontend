import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getMyProfileApi,
  updateProfileApi,
  uploadPhotoApi,
  deletePhotoApi,
  uploadCoverApi,
  deleteCoverApi,
  setPinnedHighlightApi,
  removePinnedHighlightApi,
} from '../profile.api'

// The main profile query — fetches everything in one call
// retry:false because 404 means profile not created yet (not a real error)
export function useMyProfile() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn:  () => getMyProfileApi(),
    select:   (res) => res.data.data,
    staleTime: 1000 * 60 * 2,
    retry: false,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => updateProfileApi(data),
    onSuccess: () => {
      toast.success('Profile updated!')
      qc.invalidateQueries({ queryKey: ['profile', 'me'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to update profile.'),
  })
}

export function useUploadPhoto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file) => {
      const fd = new FormData()
      fd.append('photo', file)
      return uploadPhotoApi(fd)
    },
    onSuccess: () => {
      toast.success('Profile photo updated!')
      qc.invalidateQueries({ queryKey: ['profile', 'me'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to upload photo.'),
  })
}

export function useDeletePhoto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deletePhotoApi,
    onSuccess: () => {
      toast.success('Profile photo removed.')
      qc.invalidateQueries({ queryKey: ['profile', 'me'] })
    },
    onError: () => toast.error('Failed to remove photo.'),
  })
}

export function useUploadCover() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file) => {
      const fd = new FormData()
      fd.append('cover', file)
      return uploadCoverApi(fd)
    },
    onSuccess: () => {
      toast.success('Cover photo updated!')
      qc.invalidateQueries({ queryKey: ['profile', 'me'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to upload cover.'),
  })
}

export function useDeleteCover() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteCoverApi,
    onSuccess: () => {
      toast.success('Cover photo removed.')
      qc.invalidateQueries({ queryKey: ['profile', 'me'] })
    },
    onError: () => toast.error('Failed to remove cover.'),
  })
}