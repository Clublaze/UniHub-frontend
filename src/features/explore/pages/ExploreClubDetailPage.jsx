import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Users } from 'lucide-react'
import { usePublicClubDetail } from '../hooks/useExplore'
import EventCard from '../../../components/shared/EventCard'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Separator } from '../../../components/ui/separator'
import {
  getMyMembershipsApi,
  applyToClubApi,
  leaveClubApi,
} from '../../memberships/memberships.api'
import useAuthStore from '../../../store/authStore'

export default function ExploreClubDetailPage() {
  const { id }  = useParams()
  const user    = useAuthStore(s => s.user)
  const qc      = useQueryClient()

  const { data, isLoading } = usePublicClubDetail(id)

  // Fetch user's memberships to know current join state — only if logged in
  const { data: memberships = [] } = useQuery({
    queryKey: ['memberships', 'my'],
    queryFn:  () => getMyMembershipsApi().then(r => r.data.data ?? []),
    enabled:  !!user,
  })

  const myMembership = memberships.find(m => m.clubId === id)

  const applyMutation = useMutation({
    mutationFn: () => applyToClubApi({ clubId: id, applicationNote: '' }),
    onSuccess:  () => {
      toast.success('Application submitted!')
      qc.invalidateQueries({ queryKey: ['memberships', 'my'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to apply'),
  })

  const leaveMutation = useMutation({
    mutationFn: () => leaveClubApi(id),
    onSuccess:  () => {
      toast.success('You have left the club.')
      qc.invalidateQueries({ queryKey: ['memberships', 'my'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to leave'),
  })

  // Decide which button to show based on membership status
  const JoinButton = () => {
    if (!user) {
      return (
        <Link to="/auth/login">
          <Button>Login to Join</Button>
        </Link>
      )
    }
    if (!myMembership) {
      return (
        <Button
          onClick={() => applyMutation.mutate()}
          disabled={applyMutation.isPending}
        >
          {applyMutation.isPending ? 'Applying...' : 'Join This Club'}
        </Button>
      )
    }
    if (myMembership.status === 'PENDING') {
      return <Button variant="outline" disabled>Application Pending ⏳</Button>
    }
    if (myMembership.status === 'ACTIVE') {
      return (
        <Button
          variant="destructive"
          onClick={() => leaveMutation.mutate()}
          disabled={leaveMutation.isPending}
        >
          {leaveMutation.isPending ? 'Leaving...' : 'Leave Club'}
        </Button>
      )
    }
    // REJECTED or LEFT
    return (
      <Button
        onClick={() => applyMutation.mutate()}
        disabled={applyMutation.isPending}
      >
        {applyMutation.isPending ? 'Applying...' : 'Apply Again'}
      </Button>
    )
  }

  if (isLoading) return <Loader text="Loading club..." />
  if (!data)     return <p className="text-muted-foreground">Club not found.</p>

  // Backend returns { club, leadership, memberCount, recentEvents }
  const {
    club = data,
    leadership   = [],
    memberCount  = 0,
    recentEvents = [],
  } = data

  const clubData = club._id ? club : data

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        to="/explore/clubs"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to clubs
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {clubData.logoUrl ? (
            <img
              src={clubData.logoUrl}
              alt={clubData.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {clubData.name?.[0]}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{clubData.name}</h1>
            <div className="flex items-center flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {memberCount} members
              </span>
              {clubData.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <JoinButton />
      </div>

      {clubData.description && (
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-foreground leading-relaxed">
            {clubData.description}
          </p>
        </div>
      )}

      {/* Leadership table */}
      {leadership.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Leadership</h2>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2 text-muted-foreground font-medium">Role</th>
                  <th className="text-left px-4 py-2 text-muted-foreground font-medium">Name</th>
                </tr>
              </thead>
              <tbody>
                {leadership.map((l, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2 text-muted-foreground">
                      {l.displayRoleName || l.canonicalRole}
                    </td>
                    <td className="px-4 py-2 text-foreground">
                      {l.userName || l.userId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent events */}
      {recentEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Recent Events</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentEvents.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}