import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  getAllEventsApi, getEventByIdApi, createEventApi,
  updateEventApi, submitEventApi, resubmitEventApi, completeEventApi,
} from '../events.api'

// retry: false is CRITICAL here.
// Without it, when a 404 comes back (event doesn't exist or no access),
// TanStack Query silently retries 3 times — then data is undefined
// and the page shows "Event not found" with no explanation.
// With retry:false the error state is set immediately on the first failure.
export function useEventById(id) {
  return useQuery({
    queryKey: ['event', id],
    queryFn:  () => getEventByIdApi(id),
    select:   (res) => res.data.data,
    enabled:  !!id,
    retry:    false,
    staleTime: 1000 * 60 * 2,
  })
}

export function useEventsList(params = {}) {
  return useQuery({
    queryKey: ['events', 'list', params],
    queryFn:  () => getAllEventsApi(params),
    select:   (res) => {
      const d = res.data.data
      return Array.isArray(d) ? { data: d, total: d.length } : d
    },
    retry: false,
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