import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  getAllEventsApi, getEventByIdApi, createEventApi,
  updateEventApi, submitEventApi, resubmitEventApi, completeEventApi,
} from '../events.api'

export function useEventById(id) {
  return useQuery({
    queryKey: ['event', id],
    queryFn:  () => getEventByIdApi(id),
    select:   (res) => res.data.data,
    enabled:  !!id,
  })
}

export function useEventsList(params = {}) {
  return useQuery({
    queryKey: ['events', 'list', params],
    queryFn:  () => getAllEventsApi(params),
    select:   (res) => {
      const d = res.data.data
      // Backend returns either an array or a paginated { data, total } object
      return Array.isArray(d) ? { data: d, total: d.length } : d
    },
  })
}

export function useCreateEvent() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => createEventApi(data),
    onSuccess: (res) => {
      const created = res.data.data
      const eventId = created._id || created.id
      toast.success('Event created successfully!')
      qc.invalidateQueries({ queryKey: ['events'] })
      navigate(`/events/${eventId}`)
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to create event.'),
  })
}

export function useUpdateEvent(id) {
  const navigate = useNavigate()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => updateEventApi(id, data),
    onSuccess: () => {
      toast.success('Event updated!')
      qc.invalidateQueries({ queryKey: ['event', id] })
      qc.invalidateQueries({ queryKey: ['events'] })
      navigate(`/events/${id}`)
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to update event.'),
  })
}

export function useSubmitEvent(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => submitEventApi(id),
    onSuccess: () => {
      toast.success('Event submitted for approval!')
      qc.invalidateQueries({ queryKey: ['event', id] })
      qc.invalidateQueries({ queryKey: ['events'] })
    },
    // No onError here — EventDetailPage handles the error messages specially
  })
}

export function useResubmitEvent(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => resubmitEventApi(id),
    onSuccess: () => {
      toast.success('Event resubmitted!')
      qc.invalidateQueries({ queryKey: ['event', id] })
      qc.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to resubmit.'),
  })
}

export function useCompleteEvent(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => completeEventApi(id),
    onSuccess: () => {
      toast.success('Event marked as complete. ECR is now required.')
      qc.invalidateQueries({ queryKey: ['event', id] })
      qc.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to mark complete.'),
  })
}