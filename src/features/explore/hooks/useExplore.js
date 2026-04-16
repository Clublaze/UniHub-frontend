// All explore hooks in one file — they all follow the same pattern
// select: (res) => res.data.data  extracts from { success, data, message }
import { useQuery } from '@tanstack/react-query'
import {
  getPublicClubsApi,
  getPublicClubDetailApi,
  getPublicSocietiesApi,
  getPublicSocietyDetailApi,
  getPublicEventsApi,
  getPublicEventDetailApi,
} from '../explore.api'

export function usePublicClubs(params = {}) {
  return useQuery({
    queryKey: ['discover', 'clubs', params],
    queryFn: () => getPublicClubsApi(params),
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 5,
  })
}

export function usePublicClubDetail(id) {
  return useQuery({
    queryKey: ['discover', 'club', id],
    queryFn: () => getPublicClubDetailApi(id),
    select: (res) => res.data.data,
    enabled: !!id,
  })
}

export function usePublicSocieties(params = {}) {
  return useQuery({
    queryKey: ['discover', 'societies', params],
    queryFn: () => getPublicSocietiesApi(params),
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 5,
  })
}

export function usePublicSocietyDetail(id) {
  return useQuery({
    queryKey: ['discover', 'society', id],
    queryFn: () => getPublicSocietyDetailApi(id),
    select: (res) => res.data.data,
    enabled: !!id,
  })
}

export function usePublicEvents(params = {}) {
  return useQuery({
    queryKey: ['discover', 'events', params],
    queryFn: () => getPublicEventsApi(params),
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 2,
  })
}

export function usePublicEventDetail(id) {
  return useQuery({
    queryKey: ['discover', 'event', id],
    queryFn: () => getPublicEventDetailApi(id),
    select: (res) => res.data.data,
    enabled: !!id,
  })
}